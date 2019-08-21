import {Widget} from '@phosphor/widgets';
import {ReactElementWidget} from '@jupyterlab/apputils';
import {INotebookModel} from '@jupyterlab/notebook';
import * as React from 'react';
import * as csstips from 'csstips';
import {style} from 'typestyle';

import {GcpService, ProjectState} from '../service/gcp';
import {Initializer} from './initializer';
import {SchedulerForm} from './scheduler_form';
import {BASE_FONT, COLORS} from '../styles';

/** Props definition including the GcpService for making backend calls. */
export interface PropsWithGcpService {
  gcpService: GcpService;
}

export interface MainProps extends PropsWithGcpService {
  notebookName: string;
  notebook: INotebookModel;
}

interface State {
  projectState?: ProjectState;
}

const mainClass = style({
  backgroundColor: COLORS.white,
  color: COLORS.base,
  ...BASE_FONT,
  ...csstips.vertical,
});

/**
 * Main React component to manage the state of the Scheduler Extension
 */
export class MainWidget extends React.Component<MainProps, State> {

  constructor(props: MainProps) {
    super(props);

    this.state = {};
    this._setProjectState = this._setProjectState.bind(this);
  }

  componentDidMount() {
    this._setProjectState();
  }

  render() {
    const {projectState} = this.state;
    return (
      <main className={mainClass}>
        {!projectState && <p>Validating project configuration...</p>}
        {projectState && projectState.ready &&
          <SchedulerForm {...this.props} />}
        {projectState && !projectState.ready
          && <Initializer gcpService={this.props.gcpService}
            projectState={projectState}
            onStateChange={this._setProjectState} />
        }
      </main>
    );
  }

  private async _setProjectState() {
    const projectState = await this.props.gcpService.getProjectState();
    this.setState({projectState});
  }
}

export function mainWidgetFactory(gcpService: GcpService, notebookName: string,
  notebook: INotebookModel): Widget {
  const props = {gcpService, notebookName, notebook};
  return new ReactElementWidget(<MainWidget {...props} />);
}
