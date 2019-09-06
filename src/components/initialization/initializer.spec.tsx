import * as React from 'react';
import { shallow } from 'enzyme';

import { Initializer } from './initializer';
import { GcpService, ProjectState } from '../../service/gcp';
import { ISettingRegistry } from '@jupyterlab/coreutils';

describe('Initializer', () => {
  const mockGetProjectState = jest.fn();
  const mockDialogClose = jest.fn();
  const mockGcpService = ({
    getProjectState: mockGetProjectState,
  } as undefined) as GcpService;
  const mockSettingsSet = jest.fn();
  let mockProjectState: ProjectState;

  beforeEach(() => {
    jest.resetAllMocks();
    mockProjectState = {
      allServicesEnabled: false,
      hasCloudFunction: false,
      gcsBuckets: [],
      projectId: 'test-project',
      schedulerRegion: '',
      serviceStatuses: [
        {
          enabled: false,
          service: {
            name: 'Compute Engine API',
            endpoint: 'compute.googleapis.com',
            documentation: 'https://cloud.google.com/compute/',
          },
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
        },
      ],
    };
  });

  it('Shows loaded Message then ServiceEnabler', async () => {
    const mockSettings = ({
      composite: {},
      set: mockSettingsSet,
    } as unknown) as ISettingRegistry.ISettings;
    const projectStatePromise = Promise.resolve(mockProjectState);
    mockGetProjectState.mockReturnValue(projectStatePromise);

    const initializer = shallow(
      <Initializer
        gcpService={mockGcpService}
        onDialogClose={mockDialogClose}
        settings={mockSettings}
      />
    );
    expect(initializer).toMatchSnapshot('Shows Message');

    await projectStatePromise;
    expect(initializer).toMatchSnapshot('Shows ServiceEnabler');
    expect(mockSettingsSet).toHaveBeenCalledWith('projectId', 'test-project');
  });

  it('Shows AppEngineCreator', async () => {
    const mockSettings = ({
      composite: { projectId: 'test-project' },
      set: mockSettingsSet,
    } as unknown) as ISettingRegistry.ISettings;
    mockProjectState.allServicesEnabled = true;
    const projectStatePromise = Promise.resolve(mockProjectState);
    mockGetProjectState.mockReturnValue(projectStatePromise);

    const initializer = shallow(
      <Initializer
        gcpService={mockGcpService}
        onDialogClose={mockDialogClose}
        settings={mockSettings}
      />
    );

    await projectStatePromise;
    expect(initializer).toMatchSnapshot();
    expect(mockSettingsSet).not.toHaveBeenCalled();
  });

  it('Shows GcsBucketSelector', async () => {
    const mockSettings = ({
      composite: {
        projectId: 'test-project',
      },
      set: mockSettingsSet,
    } as unknown) as ISettingRegistry.ISettings;

    mockProjectState.allServicesEnabled = true;
    mockProjectState.schedulerRegion = 'us-central1';
    const projectStatePromise = Promise.resolve(mockProjectState);
    mockGetProjectState.mockReturnValue(projectStatePromise);

    const initializer = shallow(
      <Initializer
        gcpService={mockGcpService}
        onDialogClose={mockDialogClose}
        settings={mockSettings}
      />
    );

    await projectStatePromise;
    expect(initializer).toMatchSnapshot();
    expect(mockSettingsSet).not.toHaveBeenCalled();
  });

  it('Shows CloudFunctionDeployer', async () => {
    const mockSettings = ({
      composite: {
        gcsBucket: 'gs://test-bucket1',
        projectId: 'test-project',
      },
      set: mockSettingsSet,
    } as unknown) as ISettingRegistry.ISettings;

    mockProjectState.allServicesEnabled = true;
    mockProjectState.schedulerRegion = 'us-central1';
    const projectStatePromise = Promise.resolve(mockProjectState);
    mockGetProjectState.mockReturnValue(projectStatePromise);

    const initializer = shallow(
      <Initializer
        gcpService={mockGcpService}
        onDialogClose={mockDialogClose}
        settings={mockSettings}
      />
    );

    await projectStatePromise;
    expect(initializer).toMatchSnapshot();
    expect(mockSettingsSet).not.toHaveBeenCalled();
  });

  it('Sets schedulerRegion when conditions are met', async () => {
    const mockSettings = ({
      composite: {
        gcsBucket: 'gs://test-bucket1',
        projectId: 'test-project',
      },
      set: mockSettingsSet,
    } as unknown) as ISettingRegistry.ISettings;

    mockProjectState.allServicesEnabled = true;
    mockProjectState.schedulerRegion = 'us-central1';
    mockProjectState.hasCloudFunction = true;
    const projectStatePromise = Promise.resolve(mockProjectState);
    mockGetProjectState.mockReturnValue(projectStatePromise);

    const initializer = shallow(
      <Initializer
        gcpService={mockGcpService}
        onDialogClose={mockDialogClose}
        settings={mockSettings}
      />
    );

    await projectStatePromise;
    expect(initializer).toMatchSnapshot();
    expect(mockSettingsSet).toHaveBeenCalledWith(
      'schedulerRegion',
      'us-central1'
    );
  });
});
