import {
  JupyterLab, JupyterLabPlugin
} from '@jupyterlab/application';

import '../style/index.css';


/**
 * Initialization data for the nova extension.
 */
const extension: JupyterLabPlugin<void> = {
  id: 'nova',
  autoStart: true,
  activate: (app: JupyterLab) => {
    console.log('JupyterLab extension nova is activated!');
  }
};

export default extension;
