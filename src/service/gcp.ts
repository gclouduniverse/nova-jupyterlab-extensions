const ACTIVE = 'ACTIVE';
const CLOUD_FUNCTION_ARCHIVE = 'gs://prodonjs-kubeflow-dev/notebooks_cf.zip';
const CLOUD_FUNCTION_NAME = 'submitScheduledNotebook';
const GAPI_URL = 'https://apis.google.com/js/api.js';
const POLL_INTERVAL = 5000;

interface Service {
  endpoint: string;
  name: string;
  documentation: string;
}

interface AuthResponse {
  token: string;
  project: string;
}

interface Function {
  name: string;
  httpsTrigger: {url: string};
  status: string;
}

interface ListFunctionsResponse {
  functions?: Function[];
}
/** Project initialization state. */
export interface ProjectState {
  allServicesEnabled: boolean;
  hasCloudFunction: boolean;
  hasGcsBucket: boolean;
  projectId: string;
  ready: boolean;
  serviceStatuses: ServiceStatus[];
}

interface ServiceStatus {
  service: Service;
  enabled: boolean;
}

type Operation = gapi.client.servicemanagement.Operation;

// Static list of required GCP services
const REQUIRED_SERVICES: ReadonlyArray<Service> = [
  {
    name: 'Compute Engine API',
    endpoint: 'compute.googleapis.com',
    documentation: 'https://cloud.google.com/compute/',
  },
  {
    name: 'Cloud Storage API',
    endpoint: 'storage-api.googleapis.com',
    documentation: 'https://cloud.google.com/storage/',
  },
  {
    name: 'Cloud Scheduler API',
    endpoint: 'cloudscheduler.googleapis.com',
    documentation: 'https://cloud.google.com/scheduler',
  },
  {
    name: 'AI Platform Training API',
    endpoint: 'ml.googleapis.com',
    documentation: 'https://cloud.google.com/ai-platform/',
  },
  {
    name: 'Cloud Functions API',
    endpoint: 'cloudfunctions.googleapis.com',
    documentation: 'https://cloud.google.com/functions/',
  }
];

/** Default provider function to resolve when the Google API service is ready */
export function defaultGapiProvider() {
  return new Promise<void>((resolve) => {
    const script = document.createElement('script');
    script.src = GAPI_URL;
    script.type = 'text/javascript';
    script.defer = true;
    script.async = true;
    document.body.appendChild(script);
    script.onload = () => {
      gapi.load('client', resolve);
    };
  });
}

/**
 * Class to interact with GCP services.
 */
export class GcpService {
  private static readonly POST = 'POST';
  private static readonly AUTH_PATH = '/gcp/v1/auth';
  private static readonly SERVICE_MANAGER =
      'https://servicemanagement.googleapis.com/v1';
  private static readonly CLOUD_FUNCTIONS =
      'https://cloudfunctions.googleapis.com/v1';

  constructor(private gapiPromise: Promise<void>) {}

  async getProjectState(): Promise<ProjectState> {
    try {
      const auth = await this._getAuth();
      const state: ProjectState = {
        allServicesEnabled: false,
        hasCloudFunction: false,
        hasGcsBucket: false,
        projectId: auth.project,
        ready: false,
        serviceStatuses: [],
      };

      state.serviceStatuses = await this.getServiceStatuses(auth);
      state.allServicesEnabled = state.serviceStatuses.every((s) => s.enabled);
      if (state.allServicesEnabled) {
        const [hasCloudFunction, hasGcsBucket] = await Promise.all(
            [this.hasCloudFunction(auth), this.hasGcsBucket(auth)]);
        state.hasCloudFunction = hasCloudFunction;
        state.hasGcsBucket = hasGcsBucket;
        state.ready = state.allServicesEnabled && state.hasCloudFunction &&
            state.hasGcsBucket;
      }
      return state;
    } catch (err) {
      console.log('Unable to determine project status');
      throw err;
    }
  }

  /**
   * Enables each of the services specified returning a Promise for the
   * complete operation.
   */
  async enableServices(serviceNames: string[]): Promise<Operation[]> {
    try {
      const [auth] = await Promise.all([this._getAuth(), this.gapiPromise]);
      gapi.client.setToken({access_token: auth.token});
      const pendingOperations = await Promise.all(serviceNames.map((s) => {
        return gapi.client.request<gapi.client.servicemanagement.Operation>({
          path: `${GcpService.SERVICE_MANAGER}/services/${s}:enable`,
          method: GcpService.POST,
          body: {consumerId: `project:${auth.project}`}
        });
      }));
      return await Promise.all(pendingOperations.map(
          (o) => this._pollOperation(
              `${GcpService.SERVICE_MANAGER}/${o.result.name}`)));
    } catch (err) {
      console.error('Unable to enable necessary GCP services');
      throw err;
    }
  }

  /**
   * Creates a new Cloud Storage Bucket.
   */
  async createBucket(bucketName: string): Promise<gapi.client.storage.Bucket> {
    try {
      const [auth] = await Promise.all([this._getAuth(), this.gapiPromise]);
      gapi.client.setToken({access_token: auth.token});
      const response = await gapi.client.request({
        path: `/storage/v1/b`,
        method: 'POST',
        params: {project: auth.project},
        body: {name: bucketName}
      });
      return response.result;
    } catch (err) {
      console.error(`Unable to create GCS bucket ${bucketName}`);
      throw err;
    }
  }

  /**
   * Uploads the specified Notebook JSON representation to the specified path.
   */
  async uploadNotebook(notebookContents: string, gcsPath: string):
      Promise<gapi.client.storage.Object> {
    try {
      const [auth] = await Promise.all([this._getAuth(), this.gapiPromise]);
      if (gcsPath.startsWith('gs://')) {
        gcsPath = gcsPath.slice(5);
      }
      const pathParts = gcsPath.split('/');

      gapi.client.setToken({access_token: auth.token});
      const response = await gapi.client.request({
        path: `/upload/storage/v1/b/${pathParts[0]}/o`,
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: notebookContents,
        params: {
          name: pathParts.slice(1).join('/'),
          uploadType: 'media',
        },
      });
      return response.result;
    } catch (err) {
      console.error(`Unable to upload Notebook contents to ${gcsPath}`);
      throw err;
    }
  }

  /**
   * Creates the necessary Cloud Function(s) in the project.
   */
  async createCloudFunction(regionName: string): Promise<Function> {
    try {
      const [auth] = await Promise.all([this._getAuth(), this.gapiPromise]);
      gapi.client.setToken({access_token: auth.token});
      const locationPrefix =
          `projects/${auth.project}/locations/${regionName}/functions`;
      const pendingOperation = await gapi.client.request<Operation>({
        path: `${GcpService.CLOUD_FUNCTIONS}/${locationPrefix}`,
        method: 'POST',
        body: {
          name: `${locationPrefix}/${CLOUD_FUNCTION_NAME}`,
          description: 'Submits a Notebook Job on AI Platform',
          entryPoint: CLOUD_FUNCTION_NAME,
          runtime: 'nodejs10',
          sourceArchiveUrl: CLOUD_FUNCTION_ARCHIVE,
          httpsTrigger: {}  // Needed to indicate http function
        }
      });
      const finishedOperation = await this._pollOperation(
          `${GcpService.CLOUD_FUNCTIONS}/${pendingOperation.result.name}`);
      return finishedOperation.response as Function;
    } catch (err) {
      console.error('Unable to Create Cloud Function');
      throw err;
    }
  }

  /** Returns the status of the required services. */
  private async getServiceStatuses(auth: AuthResponse):
      Promise<ServiceStatus[]> {
    try {
      await this.gapiPromise;
      gapi.client.setToken({access_token: auth.token});
      const response =
          await gapi.client
              .request<gapi.client.servicemanagement.ListServicesResponse>({
                path: `${GcpService.SERVICE_MANAGER}/services`,
                params: {consumerId: `project:${auth.project}`, pageSize: 100}
              });
      const enabledServices =
          new Set(response.result.services.map((m) => m.serviceName));
      return REQUIRED_SERVICES.map(
          (service) => ({
            service,
            enabled: enabledServices.has(service.endpoint),
          }));
    } catch (err) {
      console.error('Unable to return GCP services');
      throw err;
    }
  }

  /** Returns true if the project has at least one GCS bucket present. */
  private async hasGcsBucket(auth: AuthResponse): Promise<boolean> {
    try {
      await this.gapiPromise;
      gapi.client.setToken({access_token: auth.token});
      const response = await gapi.client.request<gapi.client.storage.Buckets>({
        path: '/storage/v1/b',
        params: {project: auth.project},
      });
      return !!response.result.items && response.result.items.length > 0;
    } catch (err) {
      console.error('Unable to list GCS Buckets');
      throw err;
    }
  }

  /**
   * Returns true if the project has a function deployed with the suffix
   * CLOUD_FUNCTION_NAME.
   */
  private async hasCloudFunction(auth: AuthResponse): Promise<boolean> {
    try {
      await this.gapiPromise;
      gapi.client.setToken({access_token: auth.token});
      const response = await gapi.client.request<ListFunctionsResponse>({
        path: `${GcpService.CLOUD_FUNCTIONS}/projects/${
            auth.project}/locations/-/functions`,
      });
      if (!(response.result.functions && response.result.functions.length)) {
        return false;
      } else {
        return !!response.result.functions.find(
            (f) => f.name.endsWith(CLOUD_FUNCTION_NAME) && f.status === ACTIVE);
      }
    } catch (err) {
      console.error('Unable to list Cloud Functions');
      throw err;
    }
  }

  /** Polls the provided Operation at 1s intervals until it has completed. */
  private async _pollOperation(path: string): Promise<Operation> {
    return new Promise((resolve, reject) => {
      const interval = setInterval(async () => {
        try {
          const [auth] = await Promise.all([this._getAuth(), this.gapiPromise]);
          gapi.client.setToken({access_token: auth.token});
          const response = await gapi.client.request<Operation>({path});
          const {result} = response;
          if (!result.done) {
            console.info(
                `Operation ${path} is still running, polling again in ${
                    POLL_INTERVAL / 1000}s`);
            return;
          }

          clearInterval(interval);
          if (result.response) {
            resolve(result);
          } else {
            console.error(`Error returned from Operation ${path}`);
            reject(result);
          }
        } catch (err) {
          console.error(`Unable to retrieve Operation status from ${path}`);
          clearInterval(interval);
          reject(err);
        }
      }, POLL_INTERVAL);
    });
  }

  private async _getAuth(): Promise<AuthResponse> {
    try {
      const response = await fetch(GcpService.AUTH_PATH);
      return await response.json();
    } catch (err) {
      console.error('Unable to obtain GCP Authorization Token');
      throw err;
    }
  }
}
