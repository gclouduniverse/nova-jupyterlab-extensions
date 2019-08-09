// Ensure styles are loaded by webpack
import '../style/index.css';

import {ILayoutRestorer, JupyterLab, JupyterLabPlugin} from '@jupyterlab/application';
import {Dialog} from '@jupyterlab/apputils';
import {ToolbarButton} from '@jupyterlab/apputils';
import {DocumentRegistry} from '@jupyterlab/docregistry';
import {INotebookModel, NotebookPanel} from '@jupyterlab/notebook';
import {toArray} from '@phosphor/algorithm';
import {DisposableDelegate, IDisposable} from '@phosphor/disposable';

import {mainWidgetFactory} from './components/main';
import {SchedulerForm} from './scheduler/schedulerForm';
import {defaultGapiProvider, GcpService} from './service/gcp';

/**
 * The plugin registration information.
 */
const buttonPlugin: JupyterLabPlugin<void> = {
  activate: activateButton,
  id: 'nova:button',
  autoStart: true,
};

const schedulerPlugin: JupyterLabPlugin<void> = {
  activate: activateScheduler,
  id: 'nova:scheduler',
  autoStart: true,
  requires: [ILayoutRestorer],
};

/**
 * A notebook widget extension that adds a button to the toolbar.
 */
export class ButtonExtension implements
    DocumentRegistry.IWidgetExtension<NotebookPanel, INotebookModel> {
  constructor(private gcpService: GcpService) {}
  /**
   * Create a new extension object.
   */
  createNew(
      panel: NotebookPanel,
      context: DocumentRegistry.IContext<INotebookModel>): IDisposable {
    const button = new ToolbarButton({
      className: 'scheduleOnGcp',
      iconClassName:
          'jp-Icon jp-Icon-16 jp-ToolbarButtonComponent-icon jp-SchedulerIcon',
      tooltip: 'Schedule on GCP',
      onClick: () => {
        const dialog = new Dialog({
          title: 'Schedule Notebook on GCP',
          buttons: [Dialog.cancelButton()],
          body: mainWidgetFactory(this.gcpService, context.model),
        });
        dialog.launch();
      }
    });
    // Find the index of spacer and insert after it
    const index =
        toArray(panel.toolbar.names()).findIndex((n) => n === 'spacer');
    panel.toolbar.insertItem(index, 'scheduleOnGcp', button);
    return new DisposableDelegate(() => button.dispose());
  }
}

function activateButton(app: JupyterLab) {
  console.log('Activating Scheduled Notebook Extension');
  const gcpService = new GcpService(defaultGapiProvider());
  app.docRegistry.addWidgetExtension(
      'Notebook', new ButtonExtension(gcpService));
}

/**
 * Activate the extension.
 */
function activateScheduler(app: JupyterLab, restorer: ILayoutRestorer): void {
  console.log('JupyterLab nova scheduler extension is activated!');
  const gcpService = new GcpService(defaultGapiProvider());
  const sidePanel = new SchedulerForm(gcpService);
  sidePanel.id = 'jp-nova-scheduler';
  sidePanel.title.iconClass = 'jp-FolderIcon jp-SideBar-tabIcon';
  sidePanel.title.caption = 'Scheduler';

  if (restorer) {
    restorer.add(sidePanel, 'scheduler');
  }

  app.shell.addToLeftArea(sidePanel, {rank: 450});
}

/**
 * Export the plugin as default.
 */
export default [buttonPlugin, schedulerPlugin];
