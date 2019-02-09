"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const coreutils_1 = require("@jupyterlab/coreutils");
const disposable_1 = require("@phosphor/disposable");
const apputils_1 = require("@jupyterlab/apputils");
const coreutils_2 = require("@jupyterlab/coreutils");
const services_1 = require("@jupyterlab/services");
/**
 * The plugin registration information.
 */
const plugin = {
    activate,
    id: 'my-extension-name:buttonPlugin',
    autoStart: true
};
/**
 * A notebook widget extension that adds a button to the toolbar.
 */
class ButtonExtension {
    /**
     * Create a new extension object.
     */
    createNew(panel, context) {
        let callback = () => {
            let notebook_path = panel.context.contentsModel.path;
            let a = context.path;
            let b = context.localPath;
            console.log(notebook_path);
            console.log(a);
            console.log(b);
            console.log(coreutils_2.PageConfig.getOption('serverRoot'));
            console.log(services_1.ServerConnection.makeSettings());
            let notebook_path_array = notebook_path.split("/");
            let notebook = notebook_path_array[notebook_path_array.length - 1];
            let path_to_folder = coreutils_2.PageConfig.getOption('serverRoot') + "/" + notebook_path;
            path_to_folder = path_to_folder.substring(0, path_to_folder.length - notebook.length);
            let fullRequest = {
                method: 'POST',
                body: JSON.stringify({
                    "home_dir": coreutils_2.PageConfig.getOption('serverRoot'),
                    "dir": path_to_folder,
                    "notebook": notebook
                })
            };
            let setting = services_1.ServerConnection.makeSettings();
            let fullUrl = coreutils_1.URLExt.join(setting.baseUrl, "nova");
            services_1.ServerConnection.makeRequest(fullUrl, fullRequest, setting);
            console.log("trololo");
        };
        let button = new apputils_1.ToolbarButton({
            className: 'myButton',
            iconClassName: 'fa fa-fast-forward',
            onClick: callback,
            tooltip: 'Ololo'
        });
        panel.toolbar.insertItem(0, 'runAll', button);
        return new disposable_1.DisposableDelegate(() => {
            button.dispose();
        });
    }
}
exports.ButtonExtension = ButtonExtension;
/**
 * Activate the extension.
 */
function activate(app) {
    app.docRegistry.addWidgetExtension('Notebook', new ButtonExtension());
}
;
/**
 * Export the plugin as default.
 */
exports.default = plugin;
