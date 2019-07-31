import {GapiService} from './gapi';

export interface AuthResponse {
  token: string;
  project: string;
}

/**
 * Class to interact with GCP services.
 */
export class GcpService {
  private static AUTH_PATH = '/gcp/v1/auth';

  constructor(private gapiService: GapiService) {}

  async getEnabledServices(): Promise<string[]> {
    const [auth] = await Promise.all(
        [this.getAuth(), this.gapiService.loadClient('servicemanagement')]);
    gapi.client.setToken({access_token: auth.token});
    const response = await gapi.client.servicemanagement.services.list(
        {consumerId: `project:${auth.project}`, pageSize: 100});
    return response.result.services.map((s) => s.serviceName);
  }

  async uploadNotebook(notebookContents: string, gcsPath: string):
      Promise<gapi.client.storage.Object> {
    const [auth] = await Promise.all(
        [this.getAuth(), this.gapiService.loadClient('storage')]);
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

  private async getAuth(): Promise<AuthResponse> {
    try {
      const response = await fetch(GcpService.AUTH_PATH);
      return await response.json();
    } catch (err) {
      console.error('Unable to obtain GCP Authorization Token');
      throw err;
    }
  }
}
