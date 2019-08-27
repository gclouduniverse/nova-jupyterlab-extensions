const ACTIVE = 'ACTIVE';
const CLOUD_FUNCTION_ARCHIVE =
    'gs://artifacts.deeplearning-platform-ui.appspot.com/gcp_scheduled_notebook_helper.zip';
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

interface ServiceStatus {
  service: Service;
  enabled: boolean;
}

/**
 * Cloud Scheduler Job
 * https://cloud.google.com/scheduler/docs/reference/rest/v1/projects.locations.jobs#Job
 */
export interface CloudSchedulerJob {
  name: string;
  description: string;
  schedule: string;
  timeZone: string;
  httpTarget: {
    body: string; headers: {[name: string]: string}; httpMethod: string;
    uri: string;
    oidcToken: {serviceAccountEmail: string;}
  };
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

/** Message type describing an AI Platform training Job */
export interface RunNotebookRequest {
  imageUri: string;
  inputNotebookGcsPath: string;
  jobId: string;
  masterType: string;
  outputNotebookGcsPath: string;
  scaleTier: string;
  region: string;
}

type Operation = gapi.client.servicemanagement.Operation;

// Static list of required GCP services
const REQUIRED_SERVICES: ReadonlyArray<Service> = [
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
  private static readonly AI_PLATFORM = 'https://ml.googleapis.com/v1';
  private static readonly CLOUD_FUNCTIONS =
      'https://cloudfunctions.googleapis.com/v1';
  private static readonly CLOUD_SCHEDULER =
      'https://cloudscheduler.googleapis.com/v1';
  private static readonly SERVICE_MANAGER =
      'https://servicemanagement.googleapis.com/v1';

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

      state.serviceStatuses = await this._getServiceStatuses(auth);
      state.allServicesEnabled = state.serviceStatuses.every((s) => s.enabled);
      const rejectHandler = () => false;
      const [hasCloudFunction, hasGcsBucket] = await Promise.all([
        this._hasCloudFunction(auth).catch(rejectHandler),
        this._hasGcsBucket(auth).catch(rejectHandler)
      ]);
      state.hasCloudFunction = hasCloudFunction;
      state.hasGcsBucket = hasGcsBucket;

      state.ready = state.allServicesEnabled && state.hasCloudFunction &&
          state.hasGcsBucket;

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

  /**
   * Submits a Notebook for recurring scheduled execution on AI Platform via a
   * new Cloud Scheduler job.
   * @param request
   * @param cloudFunctionUrl
   * @param serviceAccountEmail
   */
  async scheduleNotebook(
      request: RunNotebookRequest, cloudFunctionUrl: string,
      serviceAccountEmail: string,
      schedule: string): Promise<CloudSchedulerJob> {
    let timeZone = 'America/New_York';
    try {
      timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch (err) {
    }

    try {
      const [auth] = await Promise.all([this._getAuth(), this.gapiPromise]);
      gapi.client.setToken({access_token: auth.token});
      // TODO: Region needs to match the location of the AppEngine project,
      // not the AI Platform request
      // https://cloud.google.com/scheduler/docs/
      const locationPrefix =
          `projects/${auth.project}/locations/${request.region}/jobs`;
      const requestBody: CloudSchedulerJob = {
        name: `${locationPrefix}/${request.jobId}`,
        description: 'Scheduled Notebook',
        schedule,
        timeZone,
        httpTarget: {
          body: btoa(JSON.stringify(this._buildAiPlatformJobRequest(request))),
          headers: {'Content-Type': 'application/json'},
          httpMethod: 'POST',
          oidcToken: {serviceAccountEmail},
          uri: cloudFunctionUrl,
        }
      };
      const response = await gapi.client.request<CloudSchedulerJob>({
        path: `${GcpService.CLOUD_SCHEDULER}/${locationPrefix}`,
        method: 'POST',
        body: requestBody
      });
      return response.result;
    } catch (err) {
      console.error('Unable to create Cloud Scheduler job');
      throw err;
    }
  }

  /**
   * Submits a Notebook for immediate execution on AI Platform.
   * @param cloudFunctionUrl
   * @param request
   */
  async runNotebook(request: RunNotebookRequest):
      Promise<gapi.client.ml.GoogleCloudMlV1__Job> {
    try {
      const [auth] = await Promise.all([this._getAuth(), this.gapiPromise]);
      gapi.client.setToken({access_token: auth.token});
      const response =
          await gapi.client.request<gapi.client.ml.GoogleCloudMlV1__Job>({
            path: `${GcpService.AI_PLATFORM}/projects/${auth.project}/jobs`,
            method: 'POST',
            body: this._buildAiPlatformJobRequest(request)
          });
      return response.result;
    } catch (err) {
      console.error('Unable to submit Notebook to AI Platform');
      throw err;
    }
  }

  /** Returns the status of the required services. */
  private async _getServiceStatuses(auth: AuthResponse):
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
  private async _hasGcsBucket(auth: AuthResponse): Promise<boolean> {
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
  private async _hasCloudFunction(auth: AuthResponse): Promise<boolean> {
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

  private _buildAiPlatformJobRequest(request: RunNotebookRequest):
      gapi.client.ml.GoogleCloudMlV1__Job {
    return {
      jobId: request.jobId,
      labels: {job_type: 'jupyterlab_scheduled_notebook'},
      trainingInput: {
        args: [
          'nbexecutor',
          '--input-notebook',
          request.inputNotebookGcsPath,
          '--output-notebook',
          request.outputNotebookGcsPath,
        ],
        masterConfig: {imageUri: request.imageUri},
        region: request.region,
        scaleTier: request.scaleTier,
      }
    } as gapi.client.ml.GoogleCloudMlV1__Job;
  }
}
