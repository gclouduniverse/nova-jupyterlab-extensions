import { ISettingRegistry } from '@jupyterlab/coreutils';
import { INotebookModel } from '@jupyterlab/notebook';
import { Dialog } from '@material-ui/core';
import * as csstips from 'csstips';
import * as React from 'react';
import { stylesheet } from 'typestyle';

import { GcpService } from '../service/gcp';
import { BASE_FONT, COLORS, css } from '../styles';
import { Initializer } from './initialization/initializer';
import { SchedulerForm } from './scheduler_form';
import { Message } from './shared/message';
import { ActionBar } from './shared/action_bar';

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

export interface JobSubmittedMessage {
  message: string;
  link: string;
}

/** Definition for a function that closes the SchedulerDialog. */
export type OnDialogClose = () => void;

/**
 * Definition for function that shows a message and link after a job is
 * submitted.
 */
export type OnJobSubmit = (message: JobSubmittedMessage) => void;

/** Extension settings. */
export interface GcpSettings {
  projectId: string;
  gcsBucket: string;
  schedulerRegion: string;
  oAuthClientId?: string;
  oAuthClientSecret?: string;
}

interface Props extends PropsWithGcpService {
  request: LaunchSchedulerRequest;
  settings: ISettingRegistry.ISettings;
}

interface State {
  canSchedule: boolean;
  dialogClosedByUser: boolean;
  gcpSettings?: GcpSettings;
  jobSubmittedMessage?: JobSubmittedMessage;
}

const localStyles = stylesheet({
  header: {
    ...BASE_FONT,
    fontWeight: 500,
    fontSize: '15px',
    marginTop: 0,
    marginBottom: '12px',
  },
  main: {
    backgroundColor: COLORS.white,
    color: COLORS.base,
    padding: '16px',
    width: '480px',
    ...BASE_FONT,
    ...csstips.vertical,
  },
});

const JOB_SUBMITTED_MESSAGE_TIMEOUT = 5000;
const PYTHON2 = 'python2';
const PYTHON2_WARNING =
  'Python 2 Notebooks are not supported. Please upgrade your Notebook to use Python 3';

/**
 * Dialog wrapping the GCP scheduler UI.
 */
export class SchedulerDialog extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      dialogClosedByUser: false,
      canSchedule: false,
    };
    this._settingsChanged = this._settingsChanged.bind(this);
    this._onDialogClose = this._onDialogClose.bind(this);
    this._onJobSubmit = this._onJobSubmit.bind(this);
  }

  /** Establishes the binding for Settings Signal and invokes the handler. */
  componentDidMount() {
    this.props.settings.changed.connect(this._settingsChanged);
    this._settingsChanged(this.props.settings);
  }

  componentWillUnmount() {
    this.props.settings.changed.disconnect(this._settingsChanged);
  }

  /**
   * Set the dialog to be open since for any new request with a valid Notebook.
   */
  componentDidUpdate(prevProps: Props) {
    if (
      prevProps.request !== this.props.request &&
      !!this.props.request.notebook
    ) {
      this.setState({ dialogClosedByUser: false });
    }
  }

  render() {
    const { dialogClosedByUser } = this.state;
    const hasNotebook = !!(this.props.request && this.props.request.notebook);
    return (
      <Dialog open={hasNotebook && !dialogClosedByUser}>
        <main className={localStyles.main}>
          <p className={localStyles.header}>Schedule a notebook run</p>
          {this._getDialogContent()}
        </main>
      </Dialog>
    );
  }

  private _getDialogContent(): JSX.Element {
    const { canSchedule, gcpSettings, jobSubmittedMessage } = this.state;
    const { gcpService, request } = this.props;
    const hasNotebook = !!(request && request.notebook);
    if (jobSubmittedMessage) {
      return (
        <div className={css.column}>
          <Message text={jobSubmittedMessage.message} />
          <ActionBar onDialogClose={this._onDialogClose}>
            <a
              href={jobSubmittedMessage.link}
              target="_blank"
              className={css.button}
            >
              View Job
            </a>
          </ActionBar>
        </div>
      );
    } else if (
      hasNotebook &&
      request.notebook.defaultKernelName.toLowerCase().replace(' ', '') ==
        PYTHON2
    ) {
      // For now, only exclude Python 2 kernels
      return (
        <div className={css.column}>
          <Message asError={true} text={PYTHON2_WARNING} />
          <ActionBar onDialogClose={this._onDialogClose} />
        </div>
      );
    } else if (!canSchedule) {
      return (
        <Initializer
          gcpService={gcpService}
          onDialogClose={this._onDialogClose}
          settings={this.props.settings}
        />
      );
    } else if (canSchedule && hasNotebook) {
      return (
        <SchedulerForm
          gcpService={gcpService}
          gcpSettings={gcpSettings}
          notebookName={request.notebookName}
          notebook={request.notebook}
          onDialogClose={this._onDialogClose}
          onJobSubmit={this._onJobSubmit}
        />
      );
    }
    return null;
  }

  // Casts to GcpSettings shape from JSONObject
  private _settingsChanged(newSettings: ISettingRegistry.ISettings) {
    const settings = (newSettings.composite as unknown) as GcpSettings;
    const canSchedule = !!(
      settings.projectId &&
      settings.gcsBucket &&
      settings.schedulerRegion
    );

    this.setState({ gcpSettings: settings, canSchedule });
  }

  private _onDialogClose() {
    this.setState({ dialogClosedByUser: true });
  }

  private _onJobSubmit(jobSubmittedMessage: JobSubmittedMessage) {
    this.setState({ jobSubmittedMessage });
    setTimeout(() => {
      this.setState({
        dialogClosedByUser: true,
        jobSubmittedMessage: undefined,
      });
    }, JOB_SUBMITTED_MESSAGE_TIMEOUT);
  }
}
