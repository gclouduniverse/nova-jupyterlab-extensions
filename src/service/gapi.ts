
const GAPI_URL = 'https://apis.google.com/js/api.js';

/** Helper class for the Google API client. */
export class GapiService {
  private loaded: Promise<void>;

  constructor() {
    const script = document.createElement('script');
    script.src = GAPI_URL;
    script.type = 'text/javascript';
    script.defer = true;
    script.async = true;

    this.loaded = new Promise((resolve) => {
      document.body.appendChild(script);
      script.onload = () => {
        gapi.load('client', resolve);
      };
    });
  }

  /**
   * Loads the Google API Client
   * @param clientName
   * @param version
   */
  async loadClient<T>(clientName: string, version = 'v1') {
    await this.loaded;
    if (!(gapi.client as any)[clientName]) {
      await gapi.client.load(clientName, version);
    }
  }
}
