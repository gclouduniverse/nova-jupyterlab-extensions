import * as React from 'react';
import * as csstips from 'csstips';
import {Check, Close} from '@material-ui/icons';
import {withStyles} from '@material-ui/core';
import {stylesheet} from 'typestyle';

import {PropsWithGcpService, OnDialogClose} from './dialog';
import {ProjectState} from '../service/gcp';
import {css, COLORS} from '../styles';
import {LearnMoreLink} from './shared/learn_more_link';
import {SubmitButton} from './shared/submit_button';

interface Props extends PropsWithGcpService {
  projectState: ProjectState;
  onDialogClose: OnDialogClose;
  onStateChange: () => void;
}

interface State {
  enablingApis: boolean;
  creatingGcsBucket: boolean;
  creatingCloudFunction: boolean;
  error?: string;
}

const localStyles = stylesheet({
  serviceStatuses: {
    ...csstips.vertical,
    ...csstips.padding('16px', 0)
  },
  serviceStatusItem: {
    alignItems: 'center',
    color: COLORS.link,
    letterSpacing: '0.09px',
    lineHeight: '20px',
    ...csstips.horizontal,
    $nest: {
      '&>*': {paddingRight: '4px'}
    }
  }
});

// tslint:disable-next-line:enforce-name-casing
const GreenCheck = withStyles({
  root: {
    color: COLORS.green,
    fontSize: '16px',
  }
})(Check);

// tslint:disable-next-line:enforce-name-casing
const RedClose = withStyles({
  root: {
    color: COLORS.red,
    fontSize: '16px',
  }
})(Close);

export class Initializer extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      enablingApis: false,
      creatingCloudFunction: false,
      creatingGcsBucket: false,
    };
    this._onInitialize = this._onInitialize.bind(this);
  }

  render() {
    const {projectState} = this.props;
    const {enablingApis, error, creatingGcsBucket,
      creatingCloudFunction} = this.state;
    const operationsPending = enablingApis || creatingGcsBucket ||
      creatingCloudFunction;
    return (
      <div className={css.column}>
        <p>
          In order to schedule Notebook runs, the following APIs must be
          enabled, a Cloud Storage Bucket must be available, and a Cloud
          Function used by the Scheduler must be deployed in your project.
          These services may incur additional charges when used. By
          clicking <em>Initialize</em>, you are agreeing to the terms
          of service for the various APIs and charges in use.
        </p>
        <div className={localStyles.serviceStatuses}>
          {projectState.serviceStatuses.map((s) => {
            return <div className={localStyles.serviceStatusItem}
              key={s.service.endpoint}>
              {this._getIconForState(s.enabled)}
              <LearnMoreLink href={s.service.documentation}
                text={s.service.name} />
            </div>;
          })}
          <div className={localStyles.serviceStatusItem}>
            {this._getIconForState(projectState.hasGcsBucket)}
            <span>Has GCS Bucket?</span>
          </div>
          <div className={localStyles.serviceStatusItem}>
            {this._getIconForState(projectState.hasCloudFunction)}
            <span>Has Cloud Function?</span>
          </div>
        </div>
        <div className={css.actionBar}>
          <button className={css.button} onClick={this.props.onDialogClose}>
            Close</button>
          <SubmitButton actionPending={operationsPending}
            onClick={this._onInitialize} text='Initialize' />
        </div>
        {error && <p className='error'>{error}</p>}
        {operationsPending &&
          <div>
            {enablingApis && <p>Enabling GCP API(s)...</p>}
            {creatingGcsBucket && <p>Creating Cloud Storage Bucket..</p>}
            {creatingCloudFunction && <p>Creating Cloud Function...</p>}
          </div>
        }
      </div>
    );
  }

  private _getIconForState(enabled: boolean): JSX.Element {
    return enabled ? <GreenCheck /> : <RedClose />;
  }

  private async _onInitialize() {
    const {gcpService, projectState} = this.props;
    const toEnable = projectState.serviceStatuses
      .filter((s) => !s.enabled)
      .map((s) => s.service.endpoint);
    // Services must be enabled before GCS Bucket and Cloud Function creation
    let error: string;
    if (toEnable.length) {
      this.setState({enablingApis: true});
      try {
        await gcpService.enableServices(toEnable);
      } catch (err) {
        error = 'Unable to enable necessary GCP APIs';
      }
      this.setState({enablingApis: false});
      this.props.onStateChange();
    }

    if (error) {
      this.setState({error});
    } else {
      // Cloud Function and GCS Bucket creation can happen concurrently
      if (!projectState.hasCloudFunction) {
        this._createCloudFunction();
      }
      if (!projectState.hasGcsBucket) {
        this._createGcsBucket();
      }
    }
  }

  private async _createCloudFunction() {
    this.setState({creatingCloudFunction: true});
    try {
      await this.props.gcpService.createCloudFunction('us-central1');
    } catch (err) {
      this.setState({error: 'Unable to create Cloud Function'});
    }
    this.setState({creatingCloudFunction: false});
    this.props.onStateChange();
  }

  private async _createGcsBucket() {
    this.setState({creatingGcsBucket: true});
    try {
      await this.props.gcpService.createBucket(this.props.projectState.projectId);
    } catch (err) {
      this.setState({error: 'Unable to create GCS Bucket'});
    }
    this.setState({creatingGcsBucket: false});
    this.props.onStateChange();
  }

}
