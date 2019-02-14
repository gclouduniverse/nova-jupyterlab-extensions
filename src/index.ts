import { URLExt } from '@jupyterlab/coreutils';
import '../style/variables.css'

import {
    Widget
} from "@phosphor/widgets";

import {
    Dialog
} from "@jupyterlab/apputils";

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

import { style } from 'typestyle'

export const iconStyle = style({
    backgroundImage: 'var(--jp-nova-icon-train)',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '16px'
})


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
	  let notebook_path_array = notebook_path.split("/")
	  let notebook = notebook_path_array[notebook_path_array.length - 1]
	  let path_to_folder = PageConfig.getOption('serverRoot') + "/" + notebook_path
	  path_to_folder = path_to_folder.substring(0, path_to_folder.length - notebook.length);
          let fullRequest = {
            method: 'POST',
	    body: JSON.stringify(
	      {
	      "home_dir": PageConfig.getOption('serverRoot'),
	      "dir": path_to_folder,
	      "notebook": notebook
	      }
	    )
          };
          let setting = ServerConnection.makeSettings();
          let fullUrl = URLExt.join(setting.baseUrl, "nova");
          ServerConnection.makeRequest(fullUrl, fullRequest, setting);
	  console.log("trololo");
          const dialog = new Dialog({
            title: 'Submit Notebook',
            body: new SubmitJobForm(),
            buttons: [
                Dialog.cancelButton(),
                Dialog.okButton({label: 'Submit'})
            ]
        });
        dialog.launch();
    };
    let button = new ToolbarButton({
      className: 'backgroundTraining',
      iconClassName: iconStyle + ' jp-Icon jp-Icon-16 jp-ToolbarButtonComponent-icon',
      onClick: callback,
      tooltip: 'Submit for background training.'
    });

    panel.toolbar.insertItem(0, 'trainOnBackground', button);
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

class SubmitJobForm extends Widget {

    /**
     * Create a redirect form.
     */
    constructor() {
        super({node: SubmitJobForm.createFormNode()});
    }

    private static createFormNode(): HTMLElement {
        const node = document.createElement('div');
        const label = document.createElement('label');
        const text = document.createElement('span');

        node.className = 'jp-RedirectForm';
        text.textContent = 'Enter the Clone URI of the repository';

        label.appendChild(text);
        node.appendChild(label);
        return node;
    }
}


/**
 * Export the plugin as default.
 */
export default plugin;
