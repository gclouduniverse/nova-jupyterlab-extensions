import * as React from 'react';
import {shallow} from 'enzyme';
import {NBTestUtils} from '@jupyterlab/testutils';

import {MainWidget} from './main';
import {GcpService, ProjectState} from '../service/gcp';

describe('MainWidget', () => {
  const fakeNotebookModel = NBTestUtils.createNotebook().model;
  const mockGetProject = jest.fn();
  const mockGcpService = {
    getProjectState: mockGetProject,
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
      serviceStatuses: [{
        service: {
          name: 'Compute Engine API',
          endpoint: 'compute.googleapis.com',
          documentation: 'https://cloud.google.com/compute/',
        },
        enabled: false,
      }]
    };
  });

  it('Renders with Scheduler', async () => {
    mockProjectState.ready = true;
    mockProjectState.hasGcsBucket = true;
    mockProjectState.hasGcsBucket = true;
    mockProjectState.serviceStatuses[0].enabled = true;
    const statePromise = Promise.resolve(mockProjectState);
    mockGetProject.mockReturnValue(statePromise);
    const main = shallow(
      <MainWidget gcpService={mockGcpService} notebook={fakeNotebookModel} />
    );
    expect(main).toMatchSnapshot();

    await statePromise;
    expect(main).toMatchSnapshot();
  });

  it('Renders with Initializer', async () => {
    const statePromise = Promise.resolve(mockProjectState);
    mockGetProject.mockReturnValue(statePromise);
    const main = shallow(
      <MainWidget gcpService={mockGcpService} notebook={fakeNotebookModel} />
    );
    expect(main).toMatchSnapshot();

    await statePromise;
    expect(main).toMatchSnapshot();
  });
});
