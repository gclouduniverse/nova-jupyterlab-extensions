/* eslint-disable @typescript-eslint/camelcase */
import { GcpService, RunNotebookRequest } from './gcp';

const _setTimeout = global.setTimeout;
const FAKE_GAPI_PROVIDER = Promise.resolve();
const FAKE_AUTH = {
  token: 'authtoken',
  project: 'test-project',
};

// Helper to ensure that interval calls to the poller are scheduled immediately
// Implementation borrowed from
// https://github.com/facebook/jest/issues/7151#issuecomment-463370069
function pollerHelper(): () => void {
  let running = false;
  const start = async () => {
    running = true;
    while (running) {
      jest.runOnlyPendingTimers();
      await new Promise(r => _setTimeout(r, 1));
    }
  };
  start();
  return () => {
    running = false;
  };
}

// Fake implementation of fetch to get Auth token
function fakeAuthFetch(): Promise<Response> {
  return Promise.resolve({
    json: () => Promise.resolve(FAKE_AUTH),
  } as Response);
}

describe('GcpService', () => {
  const gcpService = new GcpService(FAKE_GAPI_PROVIDER);
  let gapiRequestMock: jest.Mock;

  beforeEach(() => {
    jest.useFakeTimers();
    gapiRequestMock = jest.fn();

    (global as any).fetch = jest.fn(fakeAuthFetch);
    (global as any).gapi = {
      client: {
        request: gapiRequestMock,
        setToken: jest.fn(),
      },
    };
  });

  describe('API Services', () => {
    it('Gets project state with all items available', async () => {
      gapiRequestMock.mockImplementation((args: { path: string }) => {
        if (args.path.indexOf('servicemanagement') >= 0) {
          return {
            result: {
              services: [
                { serviceName: 'storage-api.googleapis.com' },
                { serviceName: 'cloudscheduler.googleapis.com' },
                { serviceName: 'ml.googleapis.com' },
                { serviceName: 'cloudfunctions.googleapis.com' },
              ],
            },
          };
        } else if (args.path.indexOf('cloudfunctions') >= 0) {
          return {
            result: {
              name: 'submitScheduledNotebook',
              status: 'ACTIVE',
              httpsTrigger: {
                url: 'https://mycloudfunctiourl.goog',
              },
            },
          };
        } else if (args.path.indexOf('storage') >= 0) {
          return {
            result: {
              items: [{ name: 'bucket1' }],
            },
          };
        } else if (args.path.indexOf('cloudscheduler') >= 0) {
          return {
            result: {
              locations: [{ locationId: 'us-central1' }],
            },
          };
        }
      });
      const projectState = await gcpService.getProjectState();

      expect(gapi.client.setToken).toBeCalledWith({
        access_token: FAKE_AUTH.token,
      });
      expect(projectState).toEqual({
        allServicesEnabled: true,
        hasCloudFunction: true,
        gcsBuckets: ['gs://bucket1'],
        projectId: 'test-project',
        schedulerRegion: 'us-central1',
        serviceStatuses: [
          {
            service: {
              name: 'Cloud Storage API',
              endpoint: 'storage-api.googleapis.com',
              documentation: 'https://cloud.google.com/storage/',
            },
            enabled: true,
          },
          {
            service: {
              name: 'Cloud Scheduler API',
              endpoint: 'cloudscheduler.googleapis.com',
              documentation: 'https://cloud.google.com/scheduler',
            },
            enabled: true,
          },
          {
            service: {
              name: 'AI Platform Training API',
              endpoint: 'ml.googleapis.com',
              documentation: 'https://cloud.google.com/ai-platform/',
            },
            enabled: true,
          },
          {
            service: {
              name: 'Cloud Functions API',
              endpoint: 'cloudfunctions.googleapis.com',
              documentation: 'https://cloud.google.com/functions/',
            },
            enabled: true,
          },
        ],
      });
      expect(gapi.client.request).toHaveBeenCalledWith({
        params: {
          consumerId: 'project:test-project',
          pageSize: 100,
        },
        path: 'https://servicemanagement.googleapis.com/v1/services',
      });
      expect(gapi.client.request).toHaveBeenCalledWith({
        params: {
          project: 'test-project',
        },
        path: '/storage/v1/b',
      });
      expect(gapi.client.request).toHaveBeenCalledWith({
        path:
          'https://cloudscheduler.googleapis.com/v1/projects/test-project/locations',
      });
      expect(gapi.client.request).toHaveBeenCalledWith({
        path:
          'https://cloudfunctions.googleapis.com/v1/projects/test-project/locations/us-central1/functions/submitScheduledNotebook',
      });
    });

    it('Gets project state with disabled APIs and no resources', async () => {
      gapiRequestMock.mockImplementation((args: { path: string }) => {
        if (args.path.indexOf('servicemanagement') >= 0) {
          return { result: { services: [] } };
        } else if (args.path.indexOf('storage') >= 0) {
          throw new Error('404 Not Found');
        } else if (args.path.indexOf('cloudscheduler') >= 0) {
          throw new Error('403 Not Authorized');
        }
      });

      const projectState = await gcpService.getProjectState();

      expect(gapi.client.setToken).toBeCalledWith({
        access_token: FAKE_AUTH.token,
      });
      expect(projectState).toEqual({
        allServicesEnabled: false,
        hasCloudFunction: false,
        gcsBuckets: [],
        projectId: 'test-project',
        schedulerRegion: '',
        serviceStatuses: [
          {
            service: {
              name: 'Cloud Storage API',
              endpoint: 'storage-api.googleapis.com',
              documentation: 'https://cloud.google.com/storage/',
            },
            enabled: false,
          },
          {
            service: {
              name: 'Cloud Scheduler API',
              endpoint: 'cloudscheduler.googleapis.com',
              documentation: 'https://cloud.google.com/scheduler',
            },
            enabled: false,
          },
          {
            service: {
              name: 'AI Platform Training API',
              endpoint: 'ml.googleapis.com',
              documentation: 'https://cloud.google.com/ai-platform/',
            },
            enabled: false,
          },
          {
            service: {
              name: 'Cloud Functions API',
              endpoint: 'cloudfunctions.googleapis.com',
              documentation: 'https://cloud.google.com/functions/',
            },
            enabled: false,
          },
        ],
      });
      expect(gapi.client.request).toHaveBeenCalledWith({
        params: {
          consumerId: 'project:test-project',
          pageSize: 100,
        },
        path: 'https://servicemanagement.googleapis.com/v1/services',
      });
      expect(gapi.client.request).toHaveBeenCalledWith({
        params: {
          project: 'test-project',
        },
        path: '/storage/v1/b',
      });
      expect(gapi.client.request).toHaveBeenCalledWith({
        path:
          'https://cloudscheduler.googleapis.com/v1/projects/test-project/locations',
      });
      expect(gapi.client.request).not.toHaveBeenCalledWith({
        path:
          'https://cloudfunctions.googleapis.com/v1/projects/test-project/locations/us-central1/functions/submitScheduledNotebook',
      });
    });

    it('Gets project state with no Cloud Function', async () => {
      gapiRequestMock.mockImplementation((args: { path: string }) => {
        if (args.path.indexOf('servicemanagement') >= 0) {
          return {
            result: {
              services: [
                { serviceName: 'storage-api.googleapis.com' },
                { serviceName: 'cloudscheduler.googleapis.com' },
                { serviceName: 'ml.googleapis.com' },
              ],
            },
          };
        } else if (args.path.indexOf('cloudfunctions') >= 0) {
          throw new Error('404 Not Found');
        } else if (args.path.indexOf('storage') >= 0) {
          return {
            result: {
              items: [{ name: 'bucket1' }],
            },
          };
        } else if (args.path.indexOf('cloudscheduler') >= 0) {
          return {
            result: {
              locations: [{ locationId: 'us-east1' }],
            },
          };
        }
      });
      const projectState = await gcpService.getProjectState();

      expect(gapi.client.setToken).toBeCalledWith({
        access_token: FAKE_AUTH.token,
      });
      expect(projectState).toEqual({
        allServicesEnabled: false,
        hasCloudFunction: false,
        gcsBuckets: ['gs://bucket1'],
        projectId: 'test-project',
        schedulerRegion: 'us-east1',
        serviceStatuses: [
          {
            service: {
              name: 'Cloud Storage API',
              endpoint: 'storage-api.googleapis.com',
              documentation: 'https://cloud.google.com/storage/',
            },
            enabled: true,
          },
          {
            service: {
              name: 'Cloud Scheduler API',
              endpoint: 'cloudscheduler.googleapis.com',
              documentation: 'https://cloud.google.com/scheduler',
            },
            enabled: true,
          },
          {
            service: {
              name: 'AI Platform Training API',
              endpoint: 'ml.googleapis.com',
              documentation: 'https://cloud.google.com/ai-platform/',
            },
            enabled: true,
          },
          {
            service: {
              name: 'Cloud Functions API',
              endpoint: 'cloudfunctions.googleapis.com',
              documentation: 'https://cloud.google.com/functions/',
            },
            enabled: false,
          },
        ],
      });
      expect(gapi.client.request).toHaveBeenCalledWith({
        params: {
          consumerId: 'project:test-project',
          pageSize: 100,
        },
        path: 'https://servicemanagement.googleapis.com/v1/services',
      });
      expect(gapi.client.request).toHaveBeenCalledWith({
        params: {
          project: 'test-project',
        },
        path: '/storage/v1/b',
      });
      expect(gapi.client.request).toHaveBeenCalledWith({
        path:
          'https://cloudscheduler.googleapis.com/v1/projects/test-project/locations',
      });
      expect(gapi.client.request).toHaveBeenCalledWith({
        path:
          'https://cloudfunctions.googleapis.com/v1/projects/test-project/locations/us-east1/functions/submitScheduledNotebook',
      });
    });

    it('Enables services', async () => {
      let operationNo = 1;
      gapiRequestMock.mockImplementation(
        (request: { path: string; body: any }) => {
          if (request.path.endsWith('enable')) {
            // Enable requests
            return { result: { name: `operation${operationNo++}` } };
          } else {
            // Operation polls
            return {
              result: {
                done: true,
                response: { name: request.path.split('/').pop() },
              },
            };
          }
        }
      );

      const stopTimers = pollerHelper();
      const operations = await gcpService.enableServices([
        'service1',
        'service2',
      ]);
      stopTimers();

      expect(gapi.client.request).toBeCalledWith({
        path:
          'https://servicemanagement.googleapis.com/v1/services/service1:enable',
        method: 'POST',
        body: { consumerId: 'project:test-project' },
      });

      expect(gapi.client.request).toBeCalledWith({
        path:
          'https://servicemanagement.googleapis.com/v1/services/service2:enable',
        method: 'POST',
        body: { consumerId: 'project:test-project' },
      });
      expect(gapi.client.request).toBeCalledWith({
        path: 'https://servicemanagement.googleapis.com/v1/operation1',
      });
      expect(gapi.client.request).toBeCalledWith({
        path: 'https://servicemanagement.googleapis.com/v1/operation2',
      });
      expect(operations).toHaveLength(2);
    });

    it('Enables services with failed operations', async () => {
      let operationNo = 1;
      gapiRequestMock.mockImplementation(
        (request: { path: string; body: any }) => {
          if (request.path.endsWith('enable')) {
            // Enable requests
            return { result: { name: `operation${operationNo++}` } };
          } else {
            // Operation polls
            const operation = request.path.split('/').pop();
            const result: any = { result: { done: true } };
            if (operation === 'operation2') {
              result.result.error = `${operation} failed`;
            } else {
              result.result.response = `${operation} finished`;
            }
            return result;
          }
        }
      );

      const stopTimers = pollerHelper();
      expect.assertions(5);
      try {
        await gcpService.enableServices(['service1', 'service2']);
      } catch (err) {
        expect(err.error).toEqual('operation2 failed');
      }
      stopTimers();

      expect(gapi.client.request).toBeCalledWith({
        path:
          'https://servicemanagement.googleapis.com/v1/services/service1:enable',
        method: 'POST',
        body: { consumerId: 'project:test-project' },
      });
      expect(gapi.client.request).toBeCalledWith({
        path:
          'https://servicemanagement.googleapis.com/v1/services/service2:enable',
        method: 'POST',
        body: { consumerId: 'project:test-project' },
      });
      expect(gapi.client.request).toBeCalledWith({
        path: 'https://servicemanagement.googleapis.com/v1/operation1',
      });
      expect(gapi.client.request).toBeCalledWith({
        path: 'https://servicemanagement.googleapis.com/v1/operation2',
      });
    });
  });

  describe('AppEngine', () => {
    it('Creates an App', async () => {
      const createdApp = {
        id: 'test-project',
        name: 'test-project',
        locationId: 'us-central',
      };
      gapiRequestMock
        .mockResolvedValueOnce({ result: { name: 'createappoperation' } })
        .mockResolvedValueOnce({
          result: { done: true, response: createdApp },
        });

      const stopTimers = pollerHelper();
      const appEngineApp = await gcpService.createAppEngineApp('us-central');
      stopTimers();
      expect(appEngineApp).toEqual(createdApp);

      expect(gapi.client.request).toBeCalledWith({
        path: 'https://appengine.googleapis.com/v1/apps',
        method: 'POST',
        body: { id: 'test-project', locationId: 'us-central' },
      });
      expect(gapi.client.request).toHaveBeenNthCalledWith(2, {
        path: 'https://appengine.googleapis.com/v1/createappoperation',
      });
    });

    it('Fails to create an App', async () => {
      // Mock a chain of requests so the operation poller has to poll twice
      gapiRequestMock
        .mockResolvedValueOnce({ result: { name: 'createappoperation' } })
        .mockResolvedValueOnce({
          result: { done: true, error: 'Could not create AppEngine App' },
        });

      const stopTimers = pollerHelper();
      expect.assertions(3);
      try {
        await gcpService.createAppEngineApp('us-west1');
      } catch (err) {
        expect(err).toEqual({
          done: true,
          error: 'Could not create AppEngine App',
        });
      }
      stopTimers();

      expect(gapi.client.request).toBeCalledWith({
        path: 'https://appengine.googleapis.com/v1/apps',
        method: 'POST',
        body: { id: 'test-project', locationId: 'us-west1' },
      });
      expect(gapi.client.request).toHaveBeenNthCalledWith(2, {
        path: 'https://appengine.googleapis.com/v1/createappoperation',
      });
    });

    it('Lists available AppEngine locations', async () => {
      const expectedLocations = [
        {
          name: 'apps/test-project/locations/us-west2',
          location: 'us-west2',
        },
        {
          name: 'apps/test-project/locations/europe-west2',
          location: 'europe-west2',
        },
        {
          name: 'apps/test-project/locations/us-central',
          location: 'us-central',
        },
      ];
      gapiRequestMock.mockResolvedValue({
        result: { locations: expectedLocations },
      });

      const locations = await gcpService.getAppEngineLocations();
      expect(locations).toEqual(expectedLocations);
    });

    it('Throws an error if locations cannot be retrieved', async () => {
      const error = { error: 'Could not retrieve locations' };
      gapiRequestMock.mockRejectedValue(error);

      expect.assertions(2);
      try {
        await gcpService.getAppEngineLocations();
      } catch (err) {
        expect(err).toEqual(error);
      }

      expect(gapi.client.request).toBeCalledWith({
        path: 'https://appengine.googleapis.com/v1/apps/test-project/locations',
      });
    });
  });

  describe('GCS', () => {
    const bucketName = 'my-bucket';

    it('Creates a Bucket', async () => {
      gapiRequestMock.mockResolvedValue({ result: { name: bucketName } });

      const bucket = await gcpService.createBucket(bucketName);
      expect(bucket.name).toBe(bucketName);

      expect(gapi.client.request).toBeCalledWith({
        path: '/storage/v1/b',
        method: 'POST',
        params: { project: 'test-project' },
        body: {
          name: bucketName,
          versioning: { enabled: true },
        },
      });
    });

    it('Throws an error when creating a Bucket', async () => {
      const error = { error: 'Could not create bucket' };
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
        params: { project: 'test-project' },
        body: {
          name: bucketName,
          versioning: { enabled: true },
        },
      });
    });

    it('Uploads a Notebook', async () => {
      const fakeObject = { bucket: 'fake-bucket', name: 'notebook.json' };
      gapiRequestMock.mockResolvedValue({ result: fakeObject });

      const fakeContents = 'fake Notebook content';
      const object = await gcpService.uploadNotebook(
        fakeContents,
        'gs://fake-bucket/notebook.json'
      );

      expect(object).toEqual(fakeObject);

      expect(gapi.client.request).toBeCalledWith({
        path: '/upload/storage/v1/b/fake-bucket/o',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        params: { name: 'notebook.json', uploadType: 'media' },
        body: fakeContents,
      });
    });

    it('Throws an error when uploading a Notebook', async () => {
      const error = {
        result: {
          error: {
            code: 429,
            status: 'RESOURCE_EXHAUSTED',
            message: 'Could not upload Notebook',
          },
        },
      };
      gapiRequestMock.mockRejectedValue(error);

      const fakeContents = 'fake Notebook content';
      expect.assertions(2);
      try {
        await gcpService.uploadNotebook(
          fakeContents,
          'gs://fake-bucket/notebook.json'
        );
      } catch (err) {
        expect(err).toEqual('RESOURCE_EXHAUSTED: Could not upload Notebook');
      }

      expect(gapi.client.request).toBeCalledWith({
        path: '/upload/storage/v1/b/fake-bucket/o',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        params: { name: 'notebook.json', uploadType: 'media' },
        body: fakeContents,
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
            'https://us-central1-test-project.cloudfunctions.net/submitScheduledNotebook',
        },
      };
      gapiRequestMock
        .mockResolvedValueOnce({ result: { name: 'createoperation' } })
        .mockResolvedValueOnce({ result: { done: false } })
        .mockResolvedValueOnce({
          result: { done: true, response: createdFunction },
        });

      const stopTimers = pollerHelper();
      const cloudFunction = await gcpService.createCloudFunction('us-central1');
      stopTimers();
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
          sourceArchiveUrl:
            'gs://artifacts.deeplearning-platform-ui.appspot.com/gcp_scheduled_notebook_helper.zip',
          httpsTrigger: {},
        },
      });
      expect(gapi.client.request).toHaveBeenNthCalledWith(2, {
        path: 'https://cloudfunctions.googleapis.com/v1/createoperation',
      });
      expect(gapi.client.request).toHaveBeenNthCalledWith(3, {
        path: 'https://cloudfunctions.googleapis.com/v1/createoperation',
      });
    });

    it('Fails to create new Function', async () => {
      // Mock a chain of requests so the operation poller has to poll twice
      gapiRequestMock
        .mockResolvedValueOnce({ result: { name: 'createoperation' } })
        .mockResolvedValueOnce({ result: { done: false } })
        .mockResolvedValueOnce({
          result: { done: true, error: 'Could not create Function' },
        });

      const stopTimers = pollerHelper();
      expect.assertions(4);
      try {
        await gcpService.createCloudFunction('us-central1');
      } catch (err) {
        expect(err).toEqual({ done: true, error: 'Could not create Function' });
      }
      stopTimers();

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
          sourceArchiveUrl:
            'gs://artifacts.deeplearning-platform-ui.appspot.com/gcp_scheduled_notebook_helper.zip',
          httpsTrigger: {},
        },
      });
      expect(gapi.client.request).toHaveBeenNthCalledWith(2, {
        path: 'https://cloudfunctions.googleapis.com/v1/createoperation',
      });
      expect(gapi.client.request).toHaveBeenNthCalledWith(3, {
        path: 'https://cloudfunctions.googleapis.com/v1/createoperation',
      });
    });
  });

  describe('Notebooks', () => {
    const runNotebookRequest: RunNotebookRequest = {
      jobId: 'test_notebook_job',
      imageUri: 'gcr.io/deeplearning-platform-release/tf-gpu.1-14:m32',
      inputNotebookGcsPath: 'gs://test-bucket/test_nb.ipynb',
      masterType: '',
      outputNotebookGcsPath: 'gs://test-bucket/test_nb-out.ipynb',
      region: 'us-east1',
      scaleTier: 'STANDARD_1',
    };

    const aiPlatformJobBody: gapi.client.ml.GoogleCloudMlV1__Job = {
      jobId: 'test_notebook_job',
      labels: { job_type: 'jupyterlab_scheduled_notebook' },
      trainingInput: {
        args: [
          'nbexecutor',
          '--input-notebook',
          'gs://test-bucket/test_nb.ipynb',
          '--output-notebook',
          'gs://test-bucket/test_nb-out.ipynb',
        ],
        masterConfig: {
          imageUri: 'gcr.io/deeplearning-platform-release/tf-gpu.1-14:m32',
        },
        region: 'us-east1',
        scaleTier: 'STANDARD_1',
      },
    } as gapi.client.ml.GoogleCloudMlV1__Job;

    it('Submits Notebook Job to AI Platform', async () => {
      const now = new Date().toLocaleString();
      const returnedJob = {
        jobId: 'test_notebook_job',
        createTime: now,
      };
      gapiRequestMock.mockResolvedValue({ result: returnedJob });

      const job = await gcpService.runNotebook(runNotebookRequest);
      expect(gapi.client.request).toHaveBeenCalledWith({
        method: 'POST',
        path: 'https://ml.googleapis.com/v1/projects/test-project/jobs',
        body: aiPlatformJobBody,
      });
      expect(job).toEqual(returnedJob);
    });

    it('Throws an error when submitting Notebook to AI Platform', async () => {
      const error = { error: 'Could not create AI Platform Job' };
      gapiRequestMock.mockRejectedValue(error);

      expect.assertions(2);
      try {
        await gcpService.runNotebook(runNotebookRequest);
      } catch (err) {
        expect(err).toEqual(error);
      }

      expect(gapi.client.request).toHaveBeenCalledWith({
        method: 'POST',
        path: 'https://ml.googleapis.com/v1/projects/test-project/jobs',
        body: aiPlatformJobBody,
      });
    });

    it('Submits Schedule Notebook Job to Cloud Scheduler', async () => {
      const returnedJob = {
        name: 'test_scheduled_notebook_job',
      };
      gapiRequestMock.mockResolvedValue({ result: returnedJob });

      const expectedCloudFunctionUrl =
        'https://us-central1-test-project.cloudfunctions.net/submitScheduledNotebook';
      const serviceAccountEmail = 'test-project@appspot.gserviceaccount.com';
      const schedule = '0 1 * * 5';

      const job = await gcpService.scheduleNotebook(
        runNotebookRequest,
        'us-central1',
        schedule
      );

      expect(gapi.client.request).toHaveBeenCalledWith({
        body: {
          description: 'jupyterlab_scheduled_notebook',
          httpTarget: {
            body: btoa(JSON.stringify(aiPlatformJobBody)),
            headers: { 'Content-Type': 'application/json' },
            httpMethod: 'POST',
            oidcToken: { serviceAccountEmail },
            uri: expectedCloudFunctionUrl,
          },
          name: `projects/test-project/locations/us-central1/jobs/${runNotebookRequest.jobId}`,
          schedule,
          timeZone: expect.any(String),
        },
        method: 'POST',
        path:
          'https://cloudscheduler.googleapis.com/v1/projects/test-project/locations/us-central1/jobs',
      });
      expect(job).toEqual(returnedJob);
    });

    it('Throws an error when submitting Schedule Notebook Job', async () => {
      const error = { error: 'Could not create Cloud Scheduler Job' };
      gapiRequestMock.mockRejectedValue(error);

      const expectedCloudFunctionUrl =
        'https://us-east1-test-project.cloudfunctions.net/submitScheduledNotebook';
      const serviceAccountEmail = 'test-project@appspot.gserviceaccount.com';
      const schedule = '0 1 * * 5';

      expect.assertions(2);
      try {
        await gcpService.scheduleNotebook(
          runNotebookRequest,
          'us-east1',
          schedule
        );
      } catch (err) {
        expect(err).toEqual(error);
      }

      expect(gapi.client.request).toHaveBeenCalledWith({
        body: {
          description: 'jupyterlab_scheduled_notebook',
          httpTarget: {
            body: btoa(JSON.stringify(aiPlatformJobBody)),
            headers: { 'Content-Type': 'application/json' },
            httpMethod: 'POST',
            oidcToken: { serviceAccountEmail },
            uri: expectedCloudFunctionUrl,
          },
          name: `projects/test-project/locations/us-east1/jobs/${runNotebookRequest.jobId}`,
          schedule,
          timeZone: expect.any(String),
        },
        method: 'POST',
        path:
          'https://cloudscheduler.googleapis.com/v1/projects/test-project/locations/us-east1/jobs',
      });
    });
  });

  describe('Container Image', () => {
    it('Gets image URI from JupyterLab server', async () => {
      const mockFetch = jest.fn().mockResolvedValue({
        text: () => Promise.resolve('tf-cpu.1-14.m34'),
      });
      (global as any).fetch = mockFetch;

      const imageUri = await gcpService.getImageUri();
      expect(imageUri).toBe('gcr.io/deeplearning-platform-release/tf-cpu.1-14');
      expect(mockFetch).toHaveBeenCalledWith('/gcp/v1/runtime');
    });

    it('Returns an empty string if image URI retrieval fails', async () => {
      const error = { error: 'Unable to retrieve environment' };
      const mockFetch = jest.fn().mockRejectedValue(error);
      (global as any).fetch = mockFetch;

      const imageUri = await gcpService.getImageUri();
      expect(imageUri).toBe('');
      expect(mockFetch).toHaveBeenCalledWith('/gcp/v1/runtime');
    });
  });
});
