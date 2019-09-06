import { ISettingRegistry } from '@jupyterlab/coreutils';
import { framePromise } from '@jupyterlab/testutils';

import { GcpService } from '../service/gcp';
import { LaunchSchedulerRequest } from './dialog';
import { GcpSchedulerContext, GcpSchedulerWidget } from './widget';

describe('Widget', () => {
  const mockGetProject = jest.fn();
  const mockGcpService = ({
    getProjectState: mockGetProject,
  } as unknown) as GcpService;
  // Need to mock more of the settings behavior since we can't prevent render
  // from being called
  const mockSettings = ({
    changed: {
      connect: jest.fn(),
      disconnect: jest.fn(),
    },
    composite: {},
  } as unknown) as ISettingRegistry.ISettings;

  it('Updates model value when context is set', async () => {
    const schedulerContext = new GcpSchedulerContext();
    const launchSchedulerRequest: LaunchSchedulerRequest = {
      timestamp: Date.now(),
      notebook: null,
      notebookName: null,
    };

    const widget = new GcpSchedulerWidget(
      mockGcpService,
      mockSettings,
      schedulerContext
    );
    await framePromise();
    expect(widget.model.value).toBe(undefined);

    schedulerContext.value = launchSchedulerRequest;
    await framePromise();
    expect(widget.model.value).toBe(launchSchedulerRequest);
  });
});
