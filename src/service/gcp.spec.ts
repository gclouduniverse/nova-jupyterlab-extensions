import {GcpService} from './gcp';

const FAKE_GAPI_PROMISE = Promise.resolve();
const FAKE_AUTH = {
  token: 'authtoken',
  project: 'test-project'
};

// Fake implementation of fetch to get Auth token
function fakeAuthFetch(): Promise<Response> {
  return Promise.resolve({json: () => Promise.resolve(FAKE_AUTH)} as Response);
}

describe('GcpService', () => {
  const gcpService = new GcpService(FAKE_GAPI_PROMISE);
  let gapiRequestMock: jest.Mock;

  beforeEach(() => {
    gapiRequestMock = jest.fn();

    (global as any).fetch = jest.fn(fakeAuthFetch);
    (global as any).gapi = {
      client: {
        request: gapiRequestMock,
        setToken: jest.fn(),
      }
    };
  });

  describe('API Services', () => {
    it('Gets service statuses with none enabled', async () => {
      gapiRequestMock.mockResolvedValue({result: {services: []}});
      const services = await gcpService.getServiceStatuses();

      expect(gapi.client.setToken).toBeCalledWith({
        access_token: FAKE_AUTH.token
      });
      expect(services).toEqual([
        {serviceName: 'cloudfunctions.googleapis.com', enabled: false},
        {serviceName: 'cloudscheduler.googleapis.com', enabled: false},
        {serviceName: 'ml.googleapis.com', enabled: false},
        {serviceName: 'storage-api.googleapis.com', enabled: false}
      ]);
    });

    it('Gets service statuses with some enabled', async () => {
      gapiRequestMock.mockResolvedValue({
        result: {
          services: [
            {serviceName: 'ml.googleapis.com'},
            {serviceName: 'cloudfunctions.googleapis.com'},
          ]
        }
      });
      const services = await gcpService.getServiceStatuses();

      expect(gapi.client.setToken).toBeCalledWith({
        access_token: FAKE_AUTH.token
      });
      expect(services).toEqual([
        {serviceName: 'cloudfunctions.googleapis.com', enabled: true},
        {serviceName: 'cloudscheduler.googleapis.com', enabled: false},
        {serviceName: 'ml.googleapis.com', enabled: true},
        {serviceName: 'storage-api.googleapis.com', enabled: false}
      ]);
    });

    it('Throws error when service statuses cannot be retrieved', async () => {
      const err = {body: 'Bad request', status: 400};
      gapiRequestMock.mockRejectedValue(err);

      expect.assertions(2);
      try {
        await gcpService.getServiceStatuses();
      } catch (received) {
        expect(received).toEqual(err);
      }
      expect(gapi.client.setToken).toBeCalledWith({
        access_token: FAKE_AUTH.token
      });
    });

    it('Enables services', async () => {
      let operationNo = 1;
      gapiRequestMock.mockImplementation(
          (request: {path: string, body: any}) => {
            if (request.path.endsWith('enable')) {  // Enable requests
              return {result: {name: `operation${operationNo++}`}};
            } else {  // Operation polls
              return {
                result: {
                  done: true,
                  response: {name: request.path.split('/').pop()}
                }
              };
            }
          });

      const operations =
          await gcpService.enableServices(['service1', 'service2']);

      expect(gapi.client.request).toBeCalledWith({
        path:
            'https://servicemanagement.googleapis.com/v1/services/service1:enable',
        method: 'POST',
        body: {consumerId: 'project:test-project'}
      });

      expect(gapi.client.request).toBeCalledWith({
        path:
            'https://servicemanagement.googleapis.com/v1/services/service2:enable',
        method: 'POST',
        body: {consumerId: 'project:test-project'}
      });
      expect(gapi.client.request).toBeCalledWith({
        path: 'https://servicemanagement.googleapis.com/v1/operation1'
      });
      expect(gapi.client.request).toBeCalledWith({
        path: 'https://servicemanagement.googleapis.com/v1/operation2'
      });
      expect(operations).toHaveLength(2);
    });

    it('Enables services with failed operations', async () => {
      let operationNo = 1;
      gapiRequestMock.mockImplementation(
          (request: {path: string, body: any}) => {
            if (request.path.endsWith('enable')) {  // Enable requests
              return {result: {name: `operation${operationNo++}`}};
            } else {  // Operation polls
              const operation = request.path.split('/').pop();
              const result: any = {result: {done: true}};
              if (operation === 'operation2') {
                result.result.error = `${operation} failed`;
              } else {
                result.result.response = `${operation} finished`;
              }
              return result;
            }
          });

      expect.assertions(5);
      try {
        await gcpService.enableServices(['service1', 'service2']);
      } catch (err) {
        expect(err.error).toEqual('operation2 failed');
      }

      expect(gapi.client.request).toBeCalledWith({
        path:
            'https://servicemanagement.googleapis.com/v1/services/service1:enable',
        method: 'POST',
        body: {consumerId: 'project:test-project'}
      });
      expect(gapi.client.request).toBeCalledWith({
        path:
            'https://servicemanagement.googleapis.com/v1/services/service2:enable',
        method: 'POST',
        body: {consumerId: 'project:test-project'}
      });
      expect(gapi.client.request).toBeCalledWith({
        path: 'https://servicemanagement.googleapis.com/v1/operation1'
      });
      expect(gapi.client.request).toBeCalledWith({
        path: 'https://servicemanagement.googleapis.com/v1/operation2'
      });
    });
  });

  describe('GCS', () => {
    const bucketName = 'my-bucket';

    it('Creates a Bucket', async () => {
      gapiRequestMock.mockResolvedValue({result: {name: bucketName}});

      const bucket = await gcpService.createBucket(bucketName);
      expect(bucket.name).toBe(bucketName);

      expect(gapi.client.request).toBeCalledWith({
        path: '/storage/v1/b',
        method: 'POST',
        params: {project: 'test-project'},
        body: {name: bucketName}
      });
    });

    it('Throws an error when creating a Bucket', async () => {
      const error = {error: 'Could not create bucket'};
      gapiRequestMock.mockRejectedValue(error);

      expect.assertions(2);
      try {
        await gcpService.createBucket(bucketName);
      } catch (err) {
        expect(err).toEqual(error);
      }

      expect(gapi.client.request).toBeCalledWith({
        path: '/storage/v1/b',
        method: 'POST',
        params: {project: 'test-project'},
        body: {name: bucketName}
      });
    });

    it('Uploads a Notebook', async () => {
      const fakeObject = {bucket: 'fake-bucket', name: 'notebook.json'};
      gapiRequestMock.mockResolvedValue({result: fakeObject});

      const fakeContents = 'fake Notebook content';
      const object = await gcpService.uploadNotebook(
          fakeContents, 'gs://fake-bucket/notebook.json');

      expect(object).toEqual(fakeObject);

      expect(gapi.client.request).toBeCalledWith({
        path: '/upload/storage/v1/b/fake-bucket/o',
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        params: {name: 'notebook.json', uploadType: 'media'},
        body: fakeContents
      });
    });

    it('Throws an error when uploading a Notebook', async () => {
      const error = {error: 'Could not upload Notebook'};
      gapiRequestMock.mockRejectedValue(error);

      const fakeContents = 'fake Notebook content';
      expect.assertions(2);
      try {
        await gcpService.uploadNotebook(
            fakeContents, 'gs://fake-bucket/notebook.json');
      } catch (err) {
        expect(err).toEqual(error);
      }

      expect(gapi.client.request).toBeCalledWith({
        path: '/upload/storage/v1/b/fake-bucket/o',
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        params: {name: 'notebook.json', uploadType: 'media'},
        body: fakeContents
      });
    });
  });

  describe('Cloud Functions', () => {
    it('Creates new Function', async () => {
      // Mock a chain of requests so the operation poller has to poll twice
      const createdFunction = {
        name:
            'projects/test-project/locations/us-central1/functions/submitScheduledNotebook',
        httpsTrigger: {
          url:
              'https://us-central1-test-project.cloudfunctions.net/submitScheduledNotebook'
        }
      };
      gapiRequestMock.mockResolvedValueOnce({result: {name: 'createoperation'}})
          .mockResolvedValueOnce({result: {done: false}})
          .mockResolvedValueOnce(
              {result: {done: true, response: createdFunction}});

      const cloudFunction = await gcpService.createCloudFunction('us-central1');
      expect(cloudFunction).toEqual(createdFunction);

      expect(gapi.client.request).toBeCalledWith({
        path:
            'https://cloudfunctions.googleapis.com/v1/projects/test-project/locations/us-central1/functions',
        method: 'POST',
        body: {
          name:
              'projects/test-project/locations/us-central1/functions/submitScheduledNotebook',
          description: 'Submits a Notebook Job on AI Platform',
          entryPoint: 'submitScheduledNotebook',
          runtime: 'nodejs10',
          sourceArchiveUrl: 'gs://prodonjs-kubeflow-dev/notebooks_cf.zip',
          httpsTrigger: {},
        }
      });
      expect(gapi.client.request).toHaveBeenNthCalledWith(2, {
        path: 'https://cloudfunctions.googleapis.com/v1/createoperation'
      });
      expect(gapi.client.request).toHaveBeenNthCalledWith(3, {
        path: 'https://cloudfunctions.googleapis.com/v1/createoperation'
      });
    });

    it('Fails to create new Function', async () => {
      // Mock a chain of requests so the operation poller has to poll twice
      gapiRequestMock.mockResolvedValueOnce({result: {name: 'createoperation'}})
          .mockResolvedValueOnce({result: {done: false}})
          .mockResolvedValueOnce(
              {result: {done: true, error: 'Could not create Function'}});

      expect.assertions(4);
      try {
        await gcpService.createCloudFunction('us-central1');
      } catch (err) {
        expect(err).toEqual({done: true, error: 'Could not create Function'});
      }

      expect(gapi.client.request).toBeCalledWith({
        path:
            'https://cloudfunctions.googleapis.com/v1/projects/test-project/locations/us-central1/functions',
        method: 'POST',
        body: {
          name:
              'projects/test-project/locations/us-central1/functions/submitScheduledNotebook',
          description: 'Submits a Notebook Job on AI Platform',
          entryPoint: 'submitScheduledNotebook',
          runtime: 'nodejs10',
          sourceArchiveUrl: 'gs://prodonjs-kubeflow-dev/notebooks_cf.zip',
          httpsTrigger: {},
        }
      });
      expect(gapi.client.request).toHaveBeenNthCalledWith(2, {
        path: 'https://cloudfunctions.googleapis.com/v1/createoperation'
      });
      expect(gapi.client.request).toHaveBeenNthCalledWith(3, {
        path: 'https://cloudfunctions.googleapis.com/v1/createoperation'
      });
    });
  });
});
