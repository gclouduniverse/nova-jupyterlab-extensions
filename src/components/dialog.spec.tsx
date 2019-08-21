import { NBTestUtils } from '@jupyterlab/testutils';
import { Dialog } from '@material-ui/core';
import { shallow } from 'enzyme';
import * as React from 'react';

import { GcpService, ProjectState } from '../service/gcp';
import { LaunchSchedulerRequest, SchedulerDialog } from './dialog';

describe('SchedulerDialog', () => {
  const mockGetProject = jest.fn();
  const mockGcpService = {
    getProjectState: mockGetProject,
  } as undefined as GcpService;
  const fakeNotebook = NBTestUtils.createNotebook();
  NBTestUtils.populateNotebook(fakeNotebook);
  const launchSchedulerRequest: LaunchSchedulerRequest = {
    timestamp: Date.now(),
    notebook: null,
    notebookName: null
  };
  const mockProps = {
    gcpService: mockGcpService,
    request: launchSchedulerRequest
  };
  let mockProjectState: ProjectState;

  beforeEach(() => {
    jest.resetAllMocks();
    launchSchedulerRequest.notebookName = null;
    launchSchedulerRequest.notebook = null;
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

  it('Renders closed Dialog without Notebook', async () => {
    mockProjectState.ready = true;
    mockProjectState.hasGcsBucket = true;
    mockProjectState.hasGcsBucket = true;
    mockProjectState.serviceStatuses[0].enabled = true;
    const statePromise = Promise.resolve(mockProjectState);
    mockGetProject.mockReturnValue(statePromise);

    const dialog = shallow(<SchedulerDialog {...mockProps} />);
    await statePromise;
    expect(dialog).toMatchSnapshot('Dialog Closed');
  });

  it('Renders with SchedulerForm', async () => {
    mockProjectState.ready = true;
    mockProjectState.hasGcsBucket = true;
    mockProjectState.hasGcsBucket = true;
    mockProjectState.serviceStatuses[0].enabled = true;
    const statePromise = Promise.resolve(mockProjectState);
    mockGetProject.mockReturnValue(statePromise);
    mockProps.request.notebookName = 'Foo.ipynb';
    mockProps.request.notebook = fakeNotebook.model;

    const dialog = shallow(<SchedulerDialog {...mockProps} />);
    expect(dialog).toMatchSnapshot('Validating');

    await statePromise;
    expect(dialog).toMatchSnapshot('SchedulerForm');
  });

  it('Reopens a closed dialog when request prop changes', async () => {
    mockProjectState.ready = true;
    mockProjectState.hasGcsBucket = true;
    mockProjectState.hasGcsBucket = true;
    mockProjectState.serviceStatuses[0].enabled = true;
    const statePromise = Promise.resolve(mockProjectState);
    mockGetProject.mockReturnValue(statePromise);
    mockProps.request.notebookName = 'Foo.ipynb';
    mockProps.request.notebook = fakeNotebook.model;

    const dialog = shallow(<SchedulerDialog {...mockProps} />);
    await statePromise;
    expect(dialog.find(Dialog).prop('open')).toBe(true);
    dialog.setState({dialogClosedByUser: true});
    expect(dialog.find(Dialog).prop('open')).toBe(false);

    const newRequest: LaunchSchedulerRequest = {
      timestamp: Date.now(),
      notebookName: 'A different notebook.ipynb',
      notebook: launchSchedulerRequest.notebook
    };
    dialog.setProps({request: newRequest});
    expect(dialog.find(Dialog).prop('open')).toBe(true);
  });

  it('Renders with Initializer', async () => {
    const statePromise = Promise.resolve(mockProjectState);
    mockGetProject.mockReturnValue(statePromise);
    mockProps.request.notebookName = 'Foo.ipynb';
    mockProps.request.notebook = fakeNotebook.model;

    const dialog = shallow(<SchedulerDialog {...mockProps} />);
    expect(dialog).toMatchSnapshot('Validating');

    await statePromise;
    expect(dialog).toMatchSnapshot('Initializer');
  });
});
