"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const coreutils_1 = require("@jupyterlab/coreutils");
require("../style/variables.css");
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
const typestyle_1 = require("typestyle");
exports.iconStyle = typestyle_1.style({
    backgroundImage: 'var(--jp-nova-icon-train)',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '16px'
});
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
            className: 'backgroundTraining',
            iconClassName: exports.iconStyle + ' jp-Icon jp-Icon-16 jp-ToolbarButtonComponent-icon',
            onClick: callback,
            tooltip: 'Submit for background training.'
        });
        panel.toolbar.insertItem(0, 'trainOnBackground', button);
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
