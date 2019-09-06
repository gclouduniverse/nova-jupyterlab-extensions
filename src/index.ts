// Ensure styles are loaded by webpack
import '../style/index.css';

import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
} from '@jupyterlab/application';
import { ToolbarButton } from '@jupyterlab/apputils';
import { ISettingRegistry } from '@jupyterlab/coreutils';
import { DocumentRegistry } from '@jupyterlab/docregistry';
import { INotebookModel, NotebookPanel } from '@jupyterlab/notebook';
import { toArray } from '@phosphor/algorithm';
import { DisposableDelegate, IDisposable } from '@phosphor/disposable';
import { GcpSchedulerContext, GcpSchedulerWidget } from './components/widget';
import { defaultGapiProvider, GcpService } from './service/gcp';

/**
 * A notebook widget extension that adds a button to the toolbar.
 */
class ButtonExtension
  implements DocumentRegistry.IWidgetExtension<NotebookPanel, INotebookModel> {
  constructor(private schedulerContext: GcpSchedulerContext) {}

  createNew(
    panel: NotebookPanel,
    context: DocumentRegistry.IContext<INotebookModel>
  ): IDisposable {
    const button = new ToolbarButton({
      className: 'scheduleOnGcp',
      iconClassName:
        'jp-Icon jp-Icon-16 jp-ToolbarButtonComponent-icon jp-SchedulerIcon',
      tooltip: 'Schedule on GCP',
      onClick: () => {
        // Update the context to the active Notebook
        this.schedulerContext.value = {
          notebookName: context.path,
          notebook: context.model,
          timestamp: Date.now(),
        };
      },
    });

    // Find the index of spacer and insert after it
    const index = toArray(panel.toolbar.names()).findIndex(n => n === 'spacer');
    panel.toolbar.insertItem(index, 'scheduleOnGcp', button);
    return new DisposableDelegate(() => button.dispose());
  }
}

async function activateButton(
  app: JupyterFrontEnd,
  settingRegistry: ISettingRegistry
) {
  console.log('Activating GCP Scheduled Notebook Extension');
  const gcpService = new GcpService(defaultGapiProvider());
  const schedulerContext = new GcpSchedulerContext();
  const settings = await settingRegistry.load(
    'jupyterlab_gcpscheduler:gcpsettings'
  );
  const schedulerWidget = new GcpSchedulerWidget(
    gcpService,
    settings,
    schedulerContext
  );
  schedulerWidget.id = 'gcpscheduler';
  app.shell.add(schedulerWidget, 'bottom');

  app.docRegistry.addWidgetExtension(
    'Notebook',
    new ButtonExtension(schedulerContext)
  );
}

/**
 * The plugin registration information.
 */
const buttonPlugin: JupyterFrontEndPlugin<void> = {
  activate: activateButton,
  autoStart: true,
  id: 'gcpscheduler:button',
  requires: [ISettingRegistry],
};

/**
 * Export the plugin as default.
 */
export default [buttonPlugin];
