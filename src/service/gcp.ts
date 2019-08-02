interface ServiceStatus {
  serviceName: string;
  enabled: boolean;
}

interface AuthResponse {
  token: string;
  project: string;
}

type Operation = gapi.client.servicemanagement.Operation;

/**
 * Class to interact with GCP services.
 */
export class GcpService {
  private static readonly GAPI_URL = 'https://apis.google.com/js/api.js';
  private static readonly POST = 'POST';
  private static readonly AUTH_PATH = '/gcp/v1/auth';
  private static readonly SERVICE_MANAGER =
      'https://servicemanagement.googleapis.com/v1';
  private static readonly CLOUD_FUNCTIONS =
      'https://cloudfunctions.googleapis.com/v1';
  private static readonly REQUIRED_SERVICES = [
    'cloudfunctions.googleapis.com',
    'cloudscheduler.googleapis.com',
    'ml.googleapis.com',
    'storage-api.googleapis.com',
  ];
  private _gapiPromise: Promise<void>;

  constructor() {
    this._gapiPromise = new Promise<void>((resolve) => {
      const script = document.createElement('script');
      script.src = GcpService.GAPI_URL;
      script.type = 'text/javascript';
      script.defer = true;
      script.async = true;
      document.body.appendChild(script);
      script.onload = () => {
        gapi.load('client', resolve);
      };
    });
  }

  /** Returns the status of the required services. */
  async getServiceStatuses(): Promise<ServiceStatus[]> {
    const [auth] = await Promise.all([this._getAuth(), this._gapiPromise]);
    gapi.client.setToken({access_token: auth.token});

    const response =
        await gapi.client
            .request<gapi.client.servicemanagement.ListServicesResponse>({
              path: `${GcpService.SERVICE_MANAGER}/services`,
              params: {consumerId: `project:${auth.project}`, pageSize: 100}
            });
    const enabledServices =
        new Set(response.result.services.map((m) => m.serviceName));
    return GcpService.REQUIRED_SERVICES.map((s) => ({
                                              serviceName: s,
                                              enabled: enabledServices.has(s),
                                            }));
  }

  /**
   * Enables each of the services specified returning a Promise for the
   * complete operation.
   */
  async enableServices(serviceNames: string[]): Promise<Operation[]> {
    const [auth] = await Promise.all([this._getAuth(), this._gapiPromise]);
    gapi.client.setToken({access_token: auth.token});
    try {
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
    const [auth] = await Promise.all([this._getAuth(), this._gapiPromise]);
    gapi.client.setToken({access_token: auth.token});
    const response = await gapi.client.request({
      path: `/storage/v1/b`,
      method: 'POST',
      params: {project: auth.project},
      body: {name: bucketName}
    });
    return response.result;
  }

  /**
   * Uploads the specified Notebook JSON representation to the specified path.
   */
  async uploadNotebook(notebookContents: string, gcsPath: string):
      Promise<gapi.client.storage.Object> {
    const [auth] = await Promise.all([this._getAuth(), this._gapiPromise]);
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
        uploadType: 'media',
        name: pathParts.slice(1).join('/'),
      },
    });
    return response.result;
  }

  /**
   * Creates the necessary Cloud Function(s) in the project.
   */
  async createCloudFunction(regionName: string): Promise<Operation> {
    const [auth] = await Promise.all([this._getAuth(), this._gapiPromise]);
    gapi.client.setToken({access_token: auth.token});
    const locationPrefix =
        `projects/${auth.project}/locations/${regionName}/functions`;
    try {
      const pendingOperation = await gapi.client.request<Operation>({
        path: `${GcpService.CLOUD_FUNCTIONS}/${locationPrefix}`,
        method: 'POST',
        body: {
          name: `${locationPrefix}/submitScheduledNotebook2`,
          description: 'Submits a Notebook Job on AI Platform',
          entryPoint: 'submitScheduledNotebook',
          runtime: 'nodejs10',
          sourceArchiveUrl: 'gs://prodonjs-kubeflow-dev/notebooks_cf.zip',
          httpsTrigger: {}  // Needed to indicate http function
        }
      });
      return this._pollOperation(
          `${GcpService.CLOUD_FUNCTIONS}/${pendingOperation.result.name}`);
    } catch (err) {
      console.error('Unable to Create Cloud Function');
      throw err;
    }
  }

  /** Polls the provided Operation at 1s intervals until it has completed. */
  private async _pollOperation(path: string): Promise<Operation> {
    const [auth] = await Promise.all([this._getAuth(), this._gapiPromise]);
    gapi.client.setToken({access_token: auth.token});
    return new Promise((resolve, reject) => {
      const interval = setInterval(async () => {
        try {
          const response = await gapi.client.request<Operation>({path});
          const {result} = response;
          if (!result.done) {
            console.info(
                `Operation ${path} still running, polling again in 1s`);
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
      }, 1000);
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
