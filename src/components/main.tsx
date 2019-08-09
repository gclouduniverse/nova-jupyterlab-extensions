import {Widget} from '@phosphor/widgets';
import * as React from 'react';

import {GcpService, ProjectState} from '../service/gcp';
import {ReactElementWidget} from '@jupyterlab/apputils';
import {Initializer} from './initializer';
import {INotebookModel} from '@jupyterlab/notebook';

/** Props definition including the GcpService for making backend calls. */
export interface PropsWithGcpService {
  gcpService: GcpService;
}

interface Props extends PropsWithGcpService {
  notebook: INotebookModel;
}

interface State {
  projectState?: ProjectState;
}

export const CSS_BASE = 'jp-MainWidget';

/**
 * Main React component to manage the state of the Scheduler Extension
 */
export class MainWidget extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);

    this.state = {};
    this._setProjectState = this._setProjectState.bind(this);
  }

  async componentDidMount() {
    this._setProjectState();
  }

  render() {
    const {projectState} = this.state;
    return (<div className={CSS_BASE}>
      <main className={`${CSS_BASE}-main`}>
        {!projectState && <p>Validating project configuration...</p>}
        {projectState && projectState.ready && <p>PLACEHOLDER FOR SCHEDULER</p>}
        {projectState && !projectState.ready
          && <Initializer gcpService={this.props.gcpService}
            projectState={projectState}
            onStateChange={this._setProjectState} />
        }
      </main>
    </div>);
  }

  private async _setProjectState() {
    const projectState = await this.props.gcpService.getProjectState();
    this.setState({projectState});
  }
}

export function mainWidgetFactory(gcpService: GcpService,
  notebook: INotebookModel): Widget {
  const props = {gcpService, notebook};
  return new ReactElementWidget(<MainWidget {...props} />);
}
