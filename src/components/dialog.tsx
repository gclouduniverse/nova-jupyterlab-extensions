import { Dialog } from '@material-ui/core';
import * as csstips from 'csstips';
import * as React from 'react';
import {stylesheet} from 'typestyle';

import { GcpService, ProjectState } from '../service/gcp';
import { BASE_FONT, COLORS } from '../styles';
import { Initializer } from './initializer';
import { SchedulerForm } from './scheduler_form';
import {INotebookModel} from '@jupyterlab/notebook';

/** Information provided to the GcpSchedulerWidget */
export interface LaunchSchedulerRequest {
  timestamp: number;
  notebookName: string;
  notebook: INotebookModel;
}

/** Props definition including the GcpService for making backend calls. */
export interface PropsWithGcpService {
  gcpService: GcpService;
}

/** Definition for a function that closes the SchedulerDialog. */
export type OnDialogClose = () => void;

interface Props extends PropsWithGcpService {
  request: LaunchSchedulerRequest;
}

interface State {
  dialogClosedByUser: boolean;
  projectState?: ProjectState;
}

const localStyles = stylesheet({
  header: {
    ...BASE_FONT,
    fontWeight: 500,
    fontSize: '15px',
    marginTop: 0,
  },
  main: {
    backgroundColor: COLORS.white,
    color: COLORS.base,
    padding: '16px',
    width: '480px',
    ...BASE_FONT,
    ...csstips.vertical,
  }
});

/**
 * Dialog wrapping the GCP scheduler UI.
 */
export class SchedulerDialog extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);

    this.state = {dialogClosedByUser: false};
    this._setProjectState = this._setProjectState.bind(this);
    this._onDialogClose = this._onDialogClose.bind(this);
  }

  componentDidMount() {
    this._setProjectState();
  }

  /**
   * Set the dialog to be open since for any new request with a valid Notebook.
   */
  componentDidUpdate(prevProps: Props) {
    if (prevProps.request !== this.props.request &&
      !!this.props.request.notebook) {
      this.setState({dialogClosedByUser: false});
    }
  }

  render() {
    const {dialogClosedByUser, projectState} = this.state;
    const {gcpService, request} = this.props;
    const hasNotebook = !!(request && request.notebook);
    return (
      <Dialog open={hasNotebook && !dialogClosedByUser}>
        <main className={localStyles.main}>
          <p className={localStyles.header}>Schedule a notebook run</p>
          {!projectState && <p>Validating project configuration...</p>}
          {projectState && projectState.ready && hasNotebook &&
            <SchedulerForm gcpService={gcpService}
              notebookName={request.notebookName}
              notebook={request.notebook}
              onDialogClose={this._onDialogClose} />}
          {projectState && !projectState.ready
            && <Initializer gcpService={gcpService}
              projectState={projectState}
              onDialogClose={this._onDialogClose}
              onStateChange={this._setProjectState}
            />
          }
        </main>
      </Dialog>
    );
  }

  private async _setProjectState() {
    const projectState = await this.props.gcpService.getProjectState();
    this.setState({projectState});
  }

  private _onDialogClose() {
    this.setState({dialogClosedByUser: true});
  }
}


