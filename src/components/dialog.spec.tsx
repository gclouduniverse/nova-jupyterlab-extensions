import { ISettingRegistry } from '@jupyterlab/coreutils';
import { NBTestUtils } from '@jupyterlab/testutils';
import { Dialog } from '@material-ui/core';
import { shallow } from 'enzyme';
import * as React from 'react';

import { GcpService } from '../service/gcp';
import { LaunchSchedulerRequest, SchedulerDialog, OnJobSubmit } from './dialog';
import { INotebookModel } from '@jupyterlab/notebook';

describe('SchedulerDialog', () => {
  const mockGetProject = jest.fn();
  const mockGcpService = ({
    getProjectState: mockGetProject,
  } as undefined) as GcpService;
  const mockSettingsChangedConnect = jest.fn();
  const mockSettingsChangedDisconnect = jest.fn();
  const fakeNotebook = NBTestUtils.createNotebook();
  NBTestUtils.populateNotebook(fakeNotebook);
  const launchSchedulerRequest: LaunchSchedulerRequest = {
    timestamp: Date.now(),
    notebook: null,
    notebookName: null,
  };

  beforeEach(() => {
    jest.resetAllMocks();
    jest.useFakeTimers();
    launchSchedulerRequest.notebookName = null;
    launchSchedulerRequest.notebook = null;
  });

  it('Renders closed Dialog without Notebook', async () => {
    const settings = ({
      changed: {
        connect: mockSettingsChangedConnect,
        disconnect: mockSettingsChangedDisconnect,
      },
      composite: {},
    } as unknown) as ISettingRegistry.ISettings;

    const dialog = shallow(
      <SchedulerDialog
        gcpService={mockGcpService}
        request={launchSchedulerRequest}
        settings={settings}
      />
    );
    expect(settings.changed.connect).toHaveBeenCalled();
    expect(dialog).toMatchSnapshot('Dialog Closed');
  });

  it('Renders with Python2 warning', async () => {
    const settings = ({
      changed: {
        connect: mockSettingsChangedConnect,
        disconnect: mockSettingsChangedDisconnect,
      },
      composite: {
        projectId: 'test-project',
        gcsBucket: 'gs://test-project/notebooks',
        schedulerRegion: 'us-east1',
        serviceAccount: 'test-project@appspot.gserviceaccount.com',
      },
    } as unknown) as ISettingRegistry.ISettings;
    launchSchedulerRequest.notebookName = 'p2-nb.ipynb';
    launchSchedulerRequest.notebook = {
      defaultKernelName: 'Python 2',
    } as INotebookModel;

    const dialog = shallow(
      <SchedulerDialog
        gcpService={mockGcpService}
        request={launchSchedulerRequest}
        settings={settings}
      />
    );
    expect(settings.changed.connect).toHaveBeenCalled();
    expect(dialog).toMatchSnapshot('Python2Warning');
  });

  it('Renders with SchedulerForm', async () => {
    const settings = ({
      changed: {
        connect: mockSettingsChangedConnect,
        disconnect: mockSettingsChangedDisconnect,
      },
      composite: {
        projectId: 'test-project',
        gcsBucket: 'gs://test-project/notebooks',
        schedulerRegion: 'us-east1',
        serviceAccount: 'test-project@appspot.gserviceaccount.com',
      },
    } as unknown) as ISettingRegistry.ISettings;
    launchSchedulerRequest.notebookName = 'Foo.ipynb';
    launchSchedulerRequest.notebook = fakeNotebook.model;

    const dialog = shallow(
      <SchedulerDialog
        gcpService={mockGcpService}
        request={launchSchedulerRequest}
        settings={settings}
      />
    );
    expect(settings.changed.connect).toHaveBeenCalled();
    expect(dialog).toMatchSnapshot('SchedulerForm');
  });

  it('Renders with Initializer', async () => {
    const settings = ({
      changed: {
        connect: mockSettingsChangedConnect,
        disconnect: mockSettingsChangedDisconnect,
      },
      composite: {
        projectId: 'test-project',
      },
    } as unknown) as ISettingRegistry.ISettings;
    launchSchedulerRequest.notebookName = 'Foo.ipynb';
    launchSchedulerRequest.notebook = fakeNotebook.model;

    const dialog = shallow(
      <SchedulerDialog
        gcpService={mockGcpService}
        request={launchSchedulerRequest}
        settings={settings}
      />
    );
    expect(dialog).toMatchSnapshot('Initializer');
  });

  it('Reopens a closed dialog when request prop changes', async () => {
    const settings = ({
      changed: {
        connect: mockSettingsChangedConnect,
        disconnect: mockSettingsChangedDisconnect,
      },
      composite: {
        projectId: 'test-project',
        gcsBucket: 'gs://test-project/notebooks',
        schedulerRegion: 'us-east1',
        serviceAccount: 'test-project@appspot.gserviceaccount.com',
      },
    } as unknown) as ISettingRegistry.ISettings;
    launchSchedulerRequest.notebookName = 'Foo.ipynb';
    launchSchedulerRequest.notebook = fakeNotebook.model;

    const dialog = shallow(
      <SchedulerDialog
        gcpService={mockGcpService}
        request={launchSchedulerRequest}
        settings={settings}
      />
    );
    expect(dialog.find(Dialog).prop('open')).toBe(true);
    dialog.setState({ dialogClosedByUser: true });
    expect(dialog.find(Dialog).prop('open')).toBe(false);

    const newRequest: LaunchSchedulerRequest = {
      timestamp: Date.now(),
      notebookName: 'A different notebook.ipynb',
      notebook: launchSchedulerRequest.notebook,
    };
    dialog.setProps({ request: newRequest });
    expect(dialog.find(Dialog).prop('open')).toBe(true);
  });

  it('Shows JobSubmittedMessage and hides after timeout', async () => {
    const settings = ({
      changed: {
        connect: mockSettingsChangedConnect,
        disconnect: mockSettingsChangedDisconnect,
      },
      composite: {
        projectId: 'test-project',
        gcsBucket: 'gs://test-project/notebooks',
        schedulerRegion: 'us-east1',
        serviceAccount: 'test-project@appspot.gserviceaccount.com',
      },
    } as unknown) as ISettingRegistry.ISettings;
    launchSchedulerRequest.notebookName = 'Foo.ipynb';
    launchSchedulerRequest.notebook = fakeNotebook.model;

    const dialog = shallow(
      <SchedulerDialog
        gcpService={mockGcpService}
        request={launchSchedulerRequest}
        settings={settings}
      />
    );
    const onJobSubmit: OnJobSubmit = dialog
      .find('[onJobSubmit]')
      .prop('onJobSubmit');

    onJobSubmit({
      message: 'Job was Submitted',
      link: 'http://test.com/joblink',
    });

    expect(dialog).toMatchSnapshot('JobSubmittedMessage');
    jest.runAllTimers();
    expect(dialog.find(Dialog).prop('open')).toBe(false);
  });
});
