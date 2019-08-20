import * as React from 'react';
import {shallow} from 'enzyme';
import {NBTestUtils} from '@jupyterlab/testutils';

import {MainWidget, MainProps} from './main';
import {GcpService, ProjectState} from '../service/gcp';

describe('MainWidget', () => {
  const mockGetProject = jest.fn();
  const mockGcpService = {
    getProjectState: mockGetProject,
  } as undefined as GcpService;
  const mockProps: MainProps = {
    gcpService: mockGcpService,
    notebook: NBTestUtils.createNotebook().model,
    notebookName: 'Test Notebook.ipynb'
  };
  let mockProjectState: ProjectState;

  beforeEach(() => {
    jest.resetAllMocks();
    mockProjectState = {
      allServicesEnabled: false,
      hasCloudFunction: false,
      hasGcsBucket: false,
      projectId: 'test-project',
      ready: false,
      serviceStatuses: [{
        service: {
          name: 'Cloud Storage API',
          endpoint: 'storage-api.googleapis.com',
          documentation: 'https://cloud.google.com/storage/',
        },
        enabled: false,
      }]
    };
  });

  it('Renders with SchedulerForm', async () => {
    mockProjectState.ready = true;
    mockProjectState.hasGcsBucket = true;
    mockProjectState.hasGcsBucket = true;
    mockProjectState.serviceStatuses[0].enabled = true;
    const statePromise = Promise.resolve(mockProjectState);
    mockGetProject.mockReturnValue(statePromise);
    const main = shallow(<MainWidget {...mockProps} />);
    expect(main).toMatchSnapshot('Validating');

    await statePromise;
    expect(main).toMatchSnapshot('SchedulerForm');
  });

  it('Renders with Initializer', async () => {
    const statePromise = Promise.resolve(mockProjectState);
    mockGetProject.mockReturnValue(statePromise);
    const main = shallow(<MainWidget {...mockProps} />);
    expect(main).toMatchSnapshot('Validating');

    await statePromise;
    expect(main).toMatchSnapshot('Initializer');
  });
});
