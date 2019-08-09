import * as React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import {Check, Close, Launch} from '@material-ui/icons';

import {PropsWithGcpService, CSS_BASE} from './main';
import {ProjectState} from '../service/gcp';
interface Props extends PropsWithGcpService {
  projectState: ProjectState;
  onStateChange: () => void;
}

interface State {
  enablingApis: boolean;
  creatingGcsBucket: boolean;
  creatingCloudFunction: boolean;
  error?: string;
}

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
    const {enablingApis, creatingGcsBucket, creatingCloudFunction} = this.state;
    const operationsPending = enablingApis || creatingGcsBucket ||
      creatingCloudFunction;
    return (
      <div>
        <p>
          In order to schedule Notebook runs, the following APIs must be
          enabled, a Cloud Storage Bucket must be available, and a Cloud
          Function used by the Scheduler must be deployed in your project.
          These services may incur additional charges when used. By
          clicking <em>Initialize</em>, you are agreeing to the terms
          of service for the various APIs and charges in use.
        </p>
        <div className={`${CSS_BASE}-serviceStatuses`}>
          {projectState.serviceStatuses.map((s) => {
            return <a className={`${CSS_BASE}-serviceStatusItem`}
              key={s.service.endpoint} href={s.service.documentation}
              target="_blank">
              {this._getIconForState(s.enabled)}
              <span>{s.service.name}</span>
              <Launch fontSize='small' classes={{fontSizeSmall: 'smallIcon'}} />
            </a>;
          })}
          <div className={`${CSS_BASE}-serviceStatusItem`}>
            {this._getIconForState(projectState.hasGcsBucket)}
            <span>Has GCS Bucket?</span>
          </div>
          <div className={`${CSS_BASE}-serviceStatusItem`}>
            {this._getIconForState(projectState.hasCloudFunction)}
            <span>Has Cloud Function?</span>
          </div>
        </div>
        <div>
          {operationsPending ?
            <CircularProgress size='18px' /> :
            <button className={`${CSS_BASE}-button`}
              onClick={this._onInitialize}>Initialize</button>
          }
        </div>
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
    return enabled ?
      <Check fontSize='small' classes={{fontSizeSmall: 'smallIcon'}}
        className={`${CSS_BASE}-greenCheck`} /> :
      <Close fontSize='small' classes={{fontSizeSmall: 'smallIcon'}}
        className={`${CSS_BASE}-redX`} />;
  }

  private async _onInitialize() {
    const {gcpService, projectState} = this.props;
    const toEnable = projectState.serviceStatuses
      .filter((s) => !s.enabled)
      .map((s) => s.service.endpoint);
    // Services must be enabled before GCS Bucket and Cloud Function creation
    if (toEnable.length) {
      this.setState({enablingApis: true});
      try {
        await gcpService.enableServices(toEnable);
      } catch (err) {
        this.setState({error: 'Unable to enable necessary GCP APIs'});
      }
      this.setState({enablingApis: false});
      this.props.onStateChange();
    }

    // Cloud Function and GCS Bucket creation can happen concurrently
    if (!projectState.hasCloudFunction) {
      this._createCloudFunction();
    }
    if (!projectState.hasGcsBucket) {
      this._createGcsBucket();
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
