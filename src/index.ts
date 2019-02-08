import { URLExt } from '@jupyterlab/coreutils';

import {
  IDisposable, DisposableDelegate
} from '@phosphor/disposable';

import {
  JupyterLab, JupyterLabPlugin
} from '@jupyterlab/application';

import {
  ToolbarButton
} from '@jupyterlab/apputils';

import {
  DocumentRegistry
} from '@jupyterlab/docregistry';

import {
  NotebookPanel, INotebookModel
} from '@jupyterlab/notebook';

import {
  PageConfig 
} from '@jupyterlab/coreutils';

import { ServerConnection } from '@jupyterlab/services';

/**
 * The plugin registration information.
 */
const plugin: JupyterLabPlugin<void> = {
  activate,
  id: 'my-extension-name:buttonPlugin',
  autoStart: true
};


/**
 * A notebook widget extension that adds a button to the toolbar.
 */
export
class ButtonExtension implements DocumentRegistry.IWidgetExtension<NotebookPanel, INotebookModel> {
  /**
   * Create a new extension object.
   */
  createNew(panel: NotebookPanel, context: DocumentRegistry.IContext<INotebookModel>): IDisposable {
    let callback = () => {
      	  let notebook_path = panel.context.contentsModel.path
	  let a = context.path
	  let b = context.localPath
	  console.log(notebook_path)
	  console.log(a)
	  console.log(b) 
	  console.log(PageConfig.getOption('serverRoot')) 
	  console.log(ServerConnection.makeSettings());
          let fullRequest = {
            method: 'POST',
            body: JSON.stringify({"path": PageConfig.getOption('serverRoot')})
          };
          let setting = ServerConnection.makeSettings();
          let fullUrl = URLExt.join(setting.baseUrl, "nova");
          ServerConnection.makeRequest(fullUrl, fullRequest, setting);
    };
    let button = new ToolbarButton({
      className: 'myButton',
      iconClassName: 'fa fa-fast-forward',
      onClick: callback,
      tooltip: 'Ololo'
    });

    panel.toolbar.insertItem(0, 'runAll', button);
    return new DisposableDelegate(() => {
      button.dispose();
    });
  }
}

/**
 * Activate the extension.
 */
function activate(app: JupyterLab) {
  app.docRegistry.addWidgetExtension('Notebook', new ButtonExtension());
};


/**
 * Export the plugin as default.
 */
export default plugin;
