/* eslint-disable @typescript-eslint/camelcase */
const CLOUD_FUNCTION_ARCHIVE =
  'gs://artifacts.deeplearning-platform-ui.appspot.com/gcp_scheduled_notebook_helper.zip';
const CLOUD_FUNCTION_NAME = 'submitScheduledNotebook';
const GAPI_URL = 'https://apis.google.com/js/api.js';
const POLL_INTERVAL = 5000;
const SERVICE_ACCOUNT_DOMAIN = 'appspot.gserviceaccount.com';
const SCHEDULED_JOB_INDICATOR = 'jupyterlab_scheduled_notebook';

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
  httpsTrigger: { url: string };
  status: string;
}

interface ServiceStatus {
  service: Service;
  enabled: boolean;
}

interface AppEngineApp {
  id: string;
  name: string;
  locationId: string;
}

interface Location {
  name: string;
  locationId: string;
}

interface AppEngineLocation extends Location {
  metadata: { standardEnvironmentAvailable?: boolean };
}

interface ListAppEngineLocationsResponse {
  locations: AppEngineLocation[];
}

interface ListCloudSchedulerLocationsResponse {
  locations: Location[];
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
    body: string;
    headers: { [name: string]: string };
    httpMethod: string;
    uri: string;
    oidcToken: { serviceAccountEmail: string };
  };
}

/** Project initialization state. */
export interface ProjectState {
  allServicesEnabled: boolean;
  schedulerRegion: string;
  gcsBuckets: string[];
  hasCloudFunction: boolean;
  projectId: string;
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
  },
];

/** Default provider function to resolve when the Google API service is ready */
export function defaultGapiProvider() {
  return new Promise<void>(resolve => {
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
  private static readonly RUNTIME_ENV_PATH = '/gcp/v1/runtime';
  private static readonly AI_PLATFORM = 'https://ml.googleapis.com/v1';
  private static readonly APP_ENGINE = 'https://appengine.googleapis.com/v1';
  private static readonly CLOUD_FUNCTIONS =
    'https://cloudfunctions.googleapis.com/v1';
  private static readonly CLOUD_SCHEDULER =
    'https://cloudscheduler.googleapis.com/v1';
  private static readonly SERVICE_MANAGER =
    'https://servicemanagement.googleapis.com/v1';

  constructor(private gapiPromise: Promise<void>) {}

  /**
   * Retrieves all necessary details about the user's project to allow the
   * extension to know whether or not Notebooks can be scheduled.
   */
  async getProjectState(): Promise<ProjectState> {
    try {
      const auth = await this._getAuth();
      const state: ProjectState = {
        allServicesEnabled: false,
        schedulerRegion: '',
        gcsBuckets: [],
        hasCloudFunction: false,
        projectId: auth.project,
        serviceStatuses: [],
      };

      state.serviceStatuses = await this._getServiceStatuses(auth);
      state.allServicesEnabled = state.serviceStatuses.every(s => s.enabled);
      const [appEngineLocation, gcsBuckets] = await Promise.all([
        this._getCloudSchedulerLocation(auth).catch(() => ''),
        this._getGcsBuckets(auth).catch(() => []),
      ]);
      state.schedulerRegion = appEngineLocation;
      state.gcsBuckets = gcsBuckets;
      if (state.schedulerRegion) {
        state.hasCloudFunction = await this._hasCloudFunction(
          auth,
          state.schedulerRegion
        );
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
      gapi.client.setToken({ access_token: auth.token });
      const pendingOperations = await Promise.all(
        serviceNames.map(s => {
          return gapi.client.request<gapi.client.servicemanagement.Operation>({
            path: `${GcpService.SERVICE_MANAGER}/services/${s}:enable`,
            method: GcpService.POST,
            body: { consumerId: `project:${auth.project}` },
          });
        })
      );
      return await Promise.all(
        pendingOperations.map(o =>
          this._pollOperation(`${GcpService.SERVICE_MANAGER}/${o.result.name}`)
        )
      );
    } catch (err) {
      console.error('Unable to enable necessary GCP services');
      this._handleApiError(err);
    }
  }

  /**
   * Creates a new AppEngine app in the specified region.
   */
  async createAppEngineApp(regionName: string): Promise<AppEngineApp> {
    try {
      const [auth] = await Promise.all([this._getAuth(), this.gapiPromise]);
      gapi.client.setToken({ access_token: auth.token });
      const pendingOperation = await gapi.client.request<Operation>({
        path: `${GcpService.APP_ENGINE}/apps`,
        method: 'POST',
        body: { id: auth.project, locationId: regionName },
      });
      const finishedOperation = await this._pollOperation(
        `${GcpService.APP_ENGINE}/${pendingOperation.result.name}`
      );
      return finishedOperation.response as AppEngineApp;
    } catch (err) {
      console.error(`Unable to create App Engine app in ${regionName}`);
      this._handleApiError(err);
    }
  }

  /**
   * Creates a new Cloud Storage Bucket.
   */
  async createBucket(bucketName: string): Promise<gapi.client.storage.Bucket> {
    try {
      const [auth] = await Promise.all([this._getAuth(), this.gapiPromise]);
      gapi.client.setToken({ access_token: auth.token });
      const response = await gapi.client.request({
        path: `/storage/v1/b`,
        method: 'POST',
        params: { project: auth.project },
        body: {
          name: bucketName,
          versioning: { enabled: true },
        },
      });
      return response.result;
    } catch (err) {
      console.error(`Unable to create GCS bucket ${bucketName}`);
      this._handleApiError(err);
    }
  }

  /**
   * Uploads the specified Notebook JSON representation to the specified path.
   */
  async uploadNotebook(
    notebookContents: string,
    gcsPath: string
  ): Promise<gapi.client.storage.Object> {
    try {
      const [auth] = await Promise.all([this._getAuth(), this.gapiPromise]);
      if (gcsPath.startsWith('gs://')) {
        gcsPath = gcsPath.slice(5);
      }
      const pathParts = gcsPath.split('/');

      gapi.client.setToken({ access_token: auth.token });
      const response = await gapi.client.request({
        path: `/upload/storage/v1/b/${pathParts[0]}/o`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: notebookContents,
        params: {
          name: pathParts.slice(1).join('/'),
          uploadType: 'media',
        },
      });
      return response.result;
    } catch (err) {
      console.error(`Unable to upload Notebook contents to ${gcsPath}`);
      this._handleApiError(err);
    }
  }

  /**
   * Creates the necessary Cloud Function(s) in the project.
   */
  async createCloudFunction(regionName: string): Promise<Function> {
    try {
      const [auth] = await Promise.all([this._getAuth(), this.gapiPromise]);
      gapi.client.setToken({ access_token: auth.token });
      const locationPrefix = `projects/${auth.project}/locations/${regionName}/functions`;
      const pendingOperation = await gapi.client.request<Operation>({
        path: `${GcpService.CLOUD_FUNCTIONS}/${locationPrefix}`,
        method: 'POST',
        body: {
          name: `${locationPrefix}/${CLOUD_FUNCTION_NAME}`,
          description: 'Submits a Notebook Job on AI Platform',
          entryPoint: CLOUD_FUNCTION_NAME,
          runtime: 'nodejs10',
          sourceArchiveUrl: CLOUD_FUNCTION_ARCHIVE,
          httpsTrigger: {}, // Needed to indicate http function
        },
      });
      const finishedOperation = await this._pollOperation(
        `${GcpService.CLOUD_FUNCTIONS}/${pendingOperation.result.name}`
      );
      return finishedOperation.response as Function;
    } catch (err) {
      console.error('Unable to Create Cloud Function');
      this._handleApiError(err);
    }
  }

  /**
   * Submits a Notebook for recurring scheduled execution on AI Platform via a
   * new Cloud Scheduler job.
   * @param request
   * @param regionName
   * @param serviceAccountEmail
   * @param schedule
   */
  async scheduleNotebook(
    request: RunNotebookRequest,
    regionName: string,
    schedule: string
  ): Promise<CloudSchedulerJob> {
    let timeZone = 'America/New_York';
    try {
      timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch (err) {
      console.warn('Unable to determine timezone');
    }

    try {
      const [auth] = await Promise.all([this._getAuth(), this.gapiPromise]);
      gapi.client.setToken({ access_token: auth.token });
      const locationPrefix = `projects/${auth.project}/locations/${regionName}/jobs`;
      const requestBody: CloudSchedulerJob = {
        name: `${locationPrefix}/${request.jobId}`,
        description: SCHEDULED_JOB_INDICATOR,
        schedule,
        timeZone,
        httpTarget: {
          body: btoa(JSON.stringify(this._buildAiPlatformJobRequest(request))),
          headers: { 'Content-Type': 'application/json' },
          httpMethod: 'POST',
          oidcToken: {
            serviceAccountEmail: `${auth.project}@${SERVICE_ACCOUNT_DOMAIN}`,
          },
          uri: `https://${regionName}-${auth.project}.cloudfunctions.net/${CLOUD_FUNCTION_NAME}`,
        },
      };
      const response = await gapi.client.request<CloudSchedulerJob>({
        path: `${GcpService.CLOUD_SCHEDULER}/${locationPrefix}`,
        method: 'POST',
        body: requestBody,
      });
      return response.result;
    } catch (err) {
      console.error('Unable to create Cloud Scheduler job');
      this._handleApiError(err);
    }
  }

  /**
   * Submits a Notebook for immediate execution on AI Platform.
   * @param cloudFunctionUrl
   * @param request
   */
  async runNotebook(
    request: RunNotebookRequest
  ): Promise<gapi.client.ml.GoogleCloudMlV1__Job> {
    try {
      const [auth] = await Promise.all([this._getAuth(), this.gapiPromise]);
      gapi.client.setToken({ access_token: auth.token });
      const response = await gapi.client.request<
        gapi.client.ml.GoogleCloudMlV1__Job
      >({
        path: `${GcpService.AI_PLATFORM}/projects/${auth.project}/jobs`,
        method: 'POST',
        body: this._buildAiPlatformJobRequest(request),
      });
      return response.result;
    } catch (err) {
      console.error('Unable to submit Notebook to AI Platform');
      this._handleApiError(err);
    }
  }

  async getImageUri(): Promise<string> {
    // TODO need to check if image exist
    const imageUriPrefix = 'gcr.io/deeplearning-platform-release/';
    const runtimeEnv = await this._getRuntimeEnv();
    if (!runtimeEnv) return '';

    const lastDotIndex = runtimeEnv.lastIndexOf('.');
    return `${imageUriPrefix}${runtimeEnv.substr(0, lastDotIndex)}`;
  }

  /** Retrieves the list of regions where AppEngine can be deployed. */
  async getAppEngineLocations(): Promise<AppEngineLocation[]> {
    try {
      const [auth] = await Promise.all([this._getAuth(), this.gapiPromise]);
      gapi.client.setToken({ access_token: auth.token });
      const response = await gapi.client.request<
        ListAppEngineLocationsResponse
      >({
        path: `${GcpService.APP_ENGINE}/apps/${auth.project}/locations`,
      });
      return response.result.locations || [];
    } catch (err) {
      console.error('Unable to retrieve AppEngine locations');
      this._handleApiError(err);
    }
  }

  /** Returns the status of the required services. */
  private async _getServiceStatuses(
    auth: AuthResponse
  ): Promise<ServiceStatus[]> {
    try {
      await this.gapiPromise;
      gapi.client.setToken({ access_token: auth.token });
      const response = await gapi.client.request<
        gapi.client.servicemanagement.ListServicesResponse
      >({
        path: `${GcpService.SERVICE_MANAGER}/services`,
        params: { consumerId: `project:${auth.project}`, pageSize: 100 },
      });
      const enabledServices = new Set(
        response.result.services.map(m => m.serviceName)
      );
      return REQUIRED_SERVICES.map(service => ({
        service,
        enabled: enabledServices.has(service.endpoint),
      }));
    } catch (err) {
      console.error('Unable to return GCP services');
      this._handleApiError(err);
    }
  }

  private async _getRuntimeEnv(): Promise<string> {
    try {
      const response = await fetch(GcpService.RUNTIME_ENV_PATH);
      return await response.text();
    } catch (err) {
      console.error('Unable to obtain runtime environment');
      return '';
    }
  }

  /**
   * Returns the region where the Cloud Scheduler is available, which
   * corresponds to the AppEngine location if it has been created.
   */
  private async _getCloudSchedulerLocation(
    auth: AuthResponse
  ): Promise<string> {
    try {
      await this.gapiPromise;
      gapi.client.setToken({ access_token: auth.token });
      const response = await gapi.client.request<
        ListCloudSchedulerLocationsResponse
      >({
        path: `${GcpService.CLOUD_SCHEDULER}/projects/${auth.project}/locations`,
      });
      if (response.result.locations && response.result.locations.length) {
        return response.result.locations[0].locationId;
      }
      return '';
    } catch (err) {
      console.error('Could not determine Cloud Scheduler location');
      this._handleApiError(err);
    }
  }

  /** Returns the list of GCS Bucket names accessible with the credential. */
  private async _getGcsBuckets(auth: AuthResponse): Promise<string[]> {
    try {
      await this.gapiPromise;
      gapi.client.setToken({ access_token: auth.token });
      const response = await gapi.client.request<gapi.client.storage.Buckets>({
        path: '/storage/v1/b',
        params: { project: auth.project },
      });
      return (response.result.items || []).map(b => `gs://${b.name}`);
    } catch (err) {
      console.error('Unable to list GCS Buckets');
      this._handleApiError(err);
    }
  }

  /**
   * Returns true if the project has the necessary Cloud Function deployed
   * in the given region
   */
  private async _hasCloudFunction(
    auth: AuthResponse,
    region: string
  ): Promise<boolean> {
    try {
      await this.gapiPromise;
      gapi.client.setToken({ access_token: auth.token });
      await gapi.client.request<Function>({
        path: `${GcpService.CLOUD_FUNCTIONS}/projects/${auth.project}/locations/${region}/functions/${CLOUD_FUNCTION_NAME}`,
      });
      return true;
    } catch (err) {
      console.error(`${CLOUD_FUNCTION_NAME} not found in ${region}`);
      return false;
    }
  }

  /** Polls the provided Operation at 1s intervals until it has completed. */
  private async _pollOperation(path: string): Promise<Operation> {
    return new Promise((resolve, reject) => {
      const interval = setInterval(async () => {
        try {
          const [auth] = await Promise.all([this._getAuth(), this.gapiPromise]);
          gapi.client.setToken({ access_token: auth.token });
          const response = await gapi.client.request<Operation>({ path });
          const { result } = response;
          if (!result.done) {
            console.info(
              `Operation ${path} is still running, polling again in ${POLL_INTERVAL /
                1000}s`
            );
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

  private _buildAiPlatformJobRequest(
    request: RunNotebookRequest
  ): gapi.client.ml.GoogleCloudMlV1__Job {
    return {
      jobId: request.jobId,
      labels: { job_type: SCHEDULED_JOB_INDICATOR },
      trainingInput: {
        args: [
          'nbexecutor',
          '--input-notebook',
          request.inputNotebookGcsPath,
          '--output-notebook',
          request.outputNotebookGcsPath,
        ],
        masterConfig: { imageUri: request.imageUri },
        masterType: request.masterType || undefined,
        region: request.region,
        scaleTier: request.scaleTier,
      },
    } as gapi.client.ml.GoogleCloudMlV1__Job;
  }

  private _handleApiError(err: any) {
    // Check for Google API Error structure
    // https://cloud.google.com/apis/design/errors#error_codes
    if (err.result && err.result.error) {
      const status = err.result.error.status || err.result.error.code;
      throw `${status}: ${err.result.error.message}`;
    }
    throw err;
  }
}
