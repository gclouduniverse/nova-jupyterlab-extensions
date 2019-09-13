import { ISettingRegistry } from '@jupyterlab/coreutils';
import { INotebookModel } from '@jupyterlab/notebook';
import { Dialog } from '@material-ui/core';
import * as csstips from 'csstips';
import * as React from 'react';
import { stylesheet } from 'typestyle';

import { GcpService } from '../service/gcp';
import { BASE_FONT, COLORS } from '../styles';
import { Initializer } from './initialization/initializer';
import { SchedulerForm } from './scheduler_form';

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
  dialogClosedByUser: boolean;
  gcpSettings?: GcpSettings;
  canSchedule: boolean;
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
    const { canSchedule, dialogClosedByUser, gcpSettings } = this.state;
    const { gcpService, request } = this.props;
    const hasNotebook = !!(request && request.notebook);
    return (
      <Dialog open={hasNotebook && !dialogClosedByUser}>
        <main className={localStyles.main}>
          <p className={localStyles.header}>Schedule a notebook run</p>
          {!canSchedule && (
            <Initializer
              gcpService={gcpService}
              onDialogClose={this._onDialogClose}
              settings={this.props.settings}
            />
          )}
          {canSchedule && hasNotebook && (
            <SchedulerForm
              gcpService={gcpService}
              gcpSettings={gcpSettings}
              notebookName={request.notebookName}
              notebook={request.notebook}
              onDialogClose={this._onDialogClose}
            />
          )}
        </main>
      </Dialog>
    );
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
}
