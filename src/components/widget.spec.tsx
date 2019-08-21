import { framePromise } from '@jupyterlab/testutils';

import {GcpSchedulerContext, GcpSchedulerWidget} from './widget';
import {GcpService} from '../service/gcp';
import {LaunchSchedulerRequest} from './dialog';

describe('Widget', () => {
  const mockGetProject = jest.fn();
  const mockGcpService = {
    getProjectState: mockGetProject,
  } as undefined as GcpService;
  const schedulerContext = new GcpSchedulerContext();

  it('Updates model value when context is set', async () => {
    const launchSchedulerRequest: LaunchSchedulerRequest = {
      timestamp: Date.now(),
      notebook: null,
      notebookName: null
    };

    const widget = new GcpSchedulerWidget(mockGcpService, schedulerContext);
    await framePromise();
    expect(widget.model.value).toBe(undefined);

    schedulerContext.value = launchSchedulerRequest;
    await framePromise();
    expect(widget.model.value).toBe(launchSchedulerRequest);
  });

});
