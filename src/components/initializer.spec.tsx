import * as React from 'react';
import {shallow} from 'enzyme';

import {Initializer} from './initializer';
import {GcpService, ProjectState} from '../service/gcp';

describe('Initializer', () => {
  const mockEnableServices = jest.fn();
  const mockCreateBucket = jest.fn();
  const mockCreateCloudFunction = jest.fn();
  const mockOnStateChange = jest.fn();
  const mockGcpService = {
    enableServices: mockEnableServices,
    createCloudFunction: mockCreateCloudFunction,
    createBucket: mockCreateBucket
  } as undefined as GcpService;
  let mockProjectState: ProjectState;

  beforeEach(() => {
    jest.resetAllMocks();
    mockProjectState = {
      allServicesEnabled: false,
      hasCloudFunction: false,
      hasGcsBucket: false,
      projectId: 'test-project',
      ready: false,
      serviceStatuses: [
        {
          enabled: false,
          service: {
            name: 'Compute Engine API',
            endpoint: 'compute.googleapis.com',
            documentation: 'https://cloud.google.com/compute/',
          }
        },
        {
          enabled: false,
          service: {
            name: 'Cloud Storage API',
            endpoint: 'storage-api.googleapis.com',
            documentation: 'https://cloud.google.com/storage/',
          },
        },
        {
          enabled: false,
          service: {
            name: 'Cloud Scheduler API',
            endpoint: 'cloudscheduler.googleapis.com',
            documentation: 'https://cloud.google.com/scheduler',
          },
        },
        {
          enabled: false,
          service: {
            name: 'AI Platform Training API',
            endpoint: 'ml.googleapis.com',
            documentation: 'https://cloud.google.com/ai-platform/',
          },
        },
        {
          enabled: false,
          service: {
            name: 'Cloud Functions API',
            endpoint: 'cloudfunctions.googleapis.com',
            documentation: 'https://cloud.google.com/functions/',
          },
        }
      ]
    };
  });

  it('Issues requests to configure project on click', async () => {
    // All mocks resolve
    const enableServicesPromise = Promise.resolve(true);
    const createBucketPromise = Promise.resolve(true);
    const createCloudFunctionPromise = Promise.resolve(true);
    mockEnableServices.mockReturnValue(enableServicesPromise);
    mockCreateBucket.mockReturnValue(createBucketPromise);
    mockCreateCloudFunction.mockReturnValue(createCloudFunctionPromise);

    const initializer = shallow(<Initializer gcpService={mockGcpService}
      onStateChange={mockOnStateChange} projectState={mockProjectState} />);
    initializer.find('SubmitButton').simulate('click');
    expect(initializer.contains(<p>Enabling GCP API(s)...</p>)).toBe(true);

    await enableServicesPromise;
    expect(initializer.contains(<p>Enabling GCP API(s)...</p>)).toBe(false);
    expect(initializer.contains(<p>Creating Cloud Storage Bucket..</p>))
      .toBe(true);
    expect(initializer.contains(<p>Creating Cloud Function...</p>))
      .toBe(true);

    await createBucketPromise;
    expect(initializer.contains(<p>Creating Cloud Storage Bucket..</p>))
      .toBe(false);

    await createCloudFunctionPromise;
    expect(initializer.contains(<p>Creating Cloud Function...</p>))
      .toBe(false);

    expect(mockEnableServices).toHaveBeenCalledWith([
      'compute.googleapis.com',
      'storage-api.googleapis.com',
      'cloudscheduler.googleapis.com',
      'ml.googleapis.com',
      'cloudfunctions.googleapis.com'
    ]);
    expect(mockCreateCloudFunction).toHaveBeenCalledWith('us-central1');
    expect(mockCreateBucket).toHaveBeenCalledWith('test-project');
    expect(mockOnStateChange).toBeCalledTimes(3);
  });

  it('Fails to enable all services', async () => {
    const error = {error: 'Cannot Enable Services'};
    const enableServicesPromise = Promise.reject(error);
    mockEnableServices.mockReturnValue(enableServicesPromise);
    expect.assertions(8);

    const initializer = shallow(<Initializer gcpService={mockGcpService}
      onStateChange={mockOnStateChange} projectState={mockProjectState} />);
    initializer.find('SubmitButton').simulate('click');
    expect(initializer.contains(<p>Enabling GCP API(s)...</p>)).toBe(true);

    try {
      await enableServicesPromise;
    }
    catch (err) {
      expect(err).toEqual(error);
    }
    expect(initializer.contains(<p>Enabling GCP API(s)...</p>)).toBe(false);
    expect(initializer.contains(
      <p className='error'>Unable to enable necessary GCP APIs</p>)).toBe(true);

    expect(mockEnableServices).toHaveBeenCalledWith([
      'compute.googleapis.com',
      'storage-api.googleapis.com',
      'cloudscheduler.googleapis.com',
      'ml.googleapis.com',
      'cloudfunctions.googleapis.com'
    ]);
    expect(mockCreateCloudFunction).not.toHaveBeenCalled();
    expect(mockCreateBucket).not.toHaveBeenCalled();
    expect(mockOnStateChange).toBeCalledTimes(1);
  });

  it('Fails to create Cloud Function', async () => {
    const error = {error: 'Cannot Create Cloud Function'};
    const createBucketPromise = Promise.resolve(true);
    const createCloudFunctionPromise = Promise.reject(error);
    mockProjectState.allServicesEnabled = true;
    mockProjectState.serviceStatuses.forEach((s) => s.enabled = true);
    mockCreateBucket.mockReturnValue(createBucketPromise);
    mockCreateCloudFunction.mockReturnValue(createCloudFunctionPromise);
    expect.assertions(9);

    const initializer = shallow(<Initializer gcpService={mockGcpService}
      onStateChange={mockOnStateChange} projectState={mockProjectState} />);
    initializer.find('SubmitButton').simulate('click');
    expect(initializer.contains(<p>Creating Cloud Storage Bucket..</p>))
      .toBe(true);
    expect(initializer.contains(<p>Creating Cloud Function...</p>))
      .toBe(true);

    await createBucketPromise;
    expect(initializer.contains(<p>Creating Cloud Storage Bucket..</p>))
      .toBe(false);
    try {
      await createCloudFunctionPromise;
    }
    catch (err) {
      expect(err).toEqual(error);
    }
    expect(initializer.contains(
      <p className='error'>Unable to create Cloud Function</p>)).toBe(true);

    expect(mockEnableServices).not.toHaveBeenCalled();
    expect(mockCreateCloudFunction).toHaveBeenCalledWith('us-central1');
    expect(mockCreateBucket).toHaveBeenCalledWith('test-project');
    expect(mockOnStateChange).toBeCalledTimes(2);
  });

  it('Fails to create GCS Bucket', async () => {
    const error = {error: 'Cannot Create GCS Bucket'};
    const createBucketPromise = Promise.reject(error);
    mockProjectState.allServicesEnabled = true;
    mockProjectState.serviceStatuses.forEach((s) => s.enabled = true);
    mockProjectState.hasCloudFunction = true;
    mockCreateBucket.mockReturnValue(createBucketPromise);
    expect.assertions(8);

    const initializer = shallow(<Initializer gcpService={mockGcpService}
      onStateChange={mockOnStateChange} projectState={mockProjectState} />);
    initializer.find('SubmitButton').simulate('click');
    expect(initializer.contains(<p>Creating Cloud Storage Bucket..</p>))
      .toBe(true);
    try {
      await createBucketPromise;
    }
    catch (err) {
      expect(err).toEqual(error);
    }
    expect(initializer.contains(<p>Creating Cloud Storage Bucket..</p>))
      .toBe(false);
    expect(initializer.contains(
      <p className='error'>Unable to create GCS Bucket</p>)).toBe(true);

    expect(mockEnableServices).not.toHaveBeenCalled();
    expect(mockCreateCloudFunction).not.toHaveBeenCalled();
    expect(mockCreateBucket).toHaveBeenCalledWith('test-project');
    expect(mockOnStateChange).toBeCalledTimes(1);
  });
});
