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
      let notebook_path = panel.context.contentsModel.path;
      let notebook_path_array = notebook_path.split("/")
      let notebook = notebook_path_array[notebook_path_array.length - 1]
      let path_to_folder = PageConfig.getOption('serverRoot') + "/" + notebook_path
      path_to_folder = path_to_folder.substring(0, path_to_folder.length - notebook.length);
      let setting = ServerConnection.makeSettings();
      let fullUrl = URLExt.join(setting.baseUrl, "nova");
          
      console.log("trololo");
      const dialog = new Dialog({
        title: 'Submit notebook',
        body: new SubmitJobForm(),
        focusNodeSelector: 'input',
        buttons: [
            Dialog.cancelButton(),
            Dialog.okButton({label: 'SUBMIT'})
        ]
      });
      const result = dialog.launch();
      result.then(result => {
        if (typeof result.value != 'undefined' && result.value) {
          let fullRequest = {
            method: 'POST',
            body: JSON.stringify(
              {
                "home_dir": PageConfig.getOption('serverRoot'),
                "dir": path_to_folder,
                "notebook": notebook,
                "gpu_count": +(result.value["gpu_count"]),
                "gpu_type": result.value["gpu_type"]
              }
            )
          };
          ServerConnection.makeRequest(fullUrl, fullRequest, setting);
          console.log(result.value);
        }
        dialog.dispose();
      });
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
        const gpuTypeInput = document.createElement('input');
        const gpuCountInput = document.createElement('input');
        const gpuTypeLabel = document.createElement('span');
        const gpuCountLabel = document.createElement('span');

        gpuTypeLabel.textContent = 'Enter gpu type (not all GPUs avilable in all regions!)';
        gpuCountLabel.textContent = 'Enter gpu count';

        gpuTypeInput.placeholder = "t4";
        gpuTypeInput.setAttribute("id", "gpuTypeInput");
        gpuCountInput.placeholder = "1";
        gpuCountInput.setAttribute("id", "gpuCountInput");

        var gpus = ["k80", "p4", "t4", "p100", "v100"];
        var selectGpuList = document.createElement("select");
        selectGpuList.id = "gpuTypeInput";

        for (var i = 0; i < gpus.length; i++) {
          var option = document.createElement("option");
          option.value = gpus[i];
          option.text = gpus[i];
          selectGpuList.appendChild(option);
        }

        var k80_counts = ["1", "2", "4", "8"];
        var selectGpuCount = document.createElement("select");
        selectGpuCount.id = "gpuCountInput";
        for (var i = 0; i < k80_counts.length; i++) {
          var option = document.createElement("option");
          option.value = k80_counts[i];
          option.text = k80_counts[i];
          selectGpuCount.appendChild(option);
        }

        function update_gpu_count() {
            let gpu_type_to_counts: {[key: string]: string[]} = {
              "k80": ["1", "2", "4", "8"],
              "p4": ["1", "2", "4"],
              "t4": ["1", "2", "4"],
              "p100": ["1", "2", "4"],
              "v100": ["1", "2", "4", "8"]
            }
            let gpu_type = selectGpuList.value;
            let gpu_counts = gpu_type_to_counts[gpu_type];
            while (selectGpuCount.firstChild) {
              selectGpuCount.removeChild(selectGpuCount.firstChild);
            }
            for (var i = 0; i < gpu_counts.length; i++) {
              var option = document.createElement("option");
              option.value = gpu_counts[i];
              option.text = gpu_counts[i];
              selectGpuCount.appendChild(option);
            }
        }
        selectGpuList.onchange = update_gpu_count;

        node.className = 'jp-RedirectForm';
        text.textContent = 'Enter the Clone URI of the repository';

        label.appendChild(text);
        node.appendChild(label);
        node.appendChild(selectGpuList);
        node.appendChild(gpuTypeLabel);
        node.appendChild(selectGpuCount);
        node.appendChild(gpuCountLabel);
        return node;
    }

    getValue(): {[value: string]: string} {
      return {
        "gpu_type": (<HTMLInputElement>this.node.querySelector('#gpuTypeInput')).value,
        "gpu_count": (<HTMLInputElement>this.node.querySelector('#gpuCountInput')).value
      };
    }
}


/**
 * Export the plugin as default.
 */
export default plugin;
