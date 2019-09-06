import { ISettingRegistry } from '@jupyterlab/coreutils';
import * as React from 'react';

import { ProjectState } from '../../service/gcp';
import { css } from '../../styles';
import { GcpSettings, OnDialogClose, PropsWithGcpService } from '../dialog';
import { Message } from '../shared/message';
import { AppEngineCreator } from './appengine_creator';
import { CloudFunctionDeployer } from './cloud_function_deployer';
import { GcsBucketSelector } from './gcs_bucket_selector';
import { ServiceEnabler } from './service_enabler';

interface Props extends PropsWithGcpService {
  onDialogClose: OnDialogClose;
  settings: ISettingRegistry.ISettings;
}

interface State {
  hasSelectedBucket: boolean;
  projectState?: ProjectState;
}

/**
 * Manages the project initialization process which populates all necessary
 * settings.
 */
export class Initializer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasSelectedBucket: false };

    this._setProjectState = this._setProjectState.bind(this);
    this._updateSettingsFromProjectState = this._updateSettingsFromProjectState.bind(
      this
    );
  }

  componentDidMount() {
    this._setProjectState();
  }

  render() {
    const { gcpService, onDialogClose, settings } = this.props;
    const { hasSelectedBucket, projectState } = this.state;

    // Set helper state variables
    const allServicesEnabled = projectState && projectState.allServicesEnabled;
    const needsServicesEnabled =
      projectState && !projectState.allServicesEnabled;
    const needsAppEngineProject =
      allServicesEnabled && !projectState.schedulerRegion;
    const needsGcsBucketSetting =
      allServicesEnabled && projectState.schedulerRegion && !hasSelectedBucket;
    const needsCloudFunction =
      allServicesEnabled &&
      projectState.schedulerRegion &&
      hasSelectedBucket &&
      !projectState.hasCloudFunction;

    return (
      <div className={css.column}>
        {!projectState && (
          <Message
            asActivity={true}
            text="Validating project configuration..."
          />
        )}
        {needsServicesEnabled && (
          <ServiceEnabler
            gcpService={gcpService}
            onDialogClose={onDialogClose}
            onStateChange={this._setProjectState}
            projectState={projectState}
          />
        )}
        {needsAppEngineProject && (
          <AppEngineCreator
            gcpService={gcpService}
            onDialogClose={onDialogClose}
            onStateChange={this._setProjectState}
          />
        )}
        {needsGcsBucketSetting && (
          <GcsBucketSelector
            buckets={projectState.gcsBuckets}
            gcpService={gcpService}
            onDialogClose={onDialogClose}
            onSelected={async bucket => {
              await settings.set('gcsBucket', bucket);
              this.setState({ hasSelectedBucket: true });
            }}
          />
        )}
        {needsCloudFunction && (
          <CloudFunctionDeployer
            gcpService={gcpService}
            onDialogClose={onDialogClose}
            onCreated={this._setProjectState}
            region={projectState.schedulerRegion}
          />
        )}
      </div>
    );
  }

  private async _setProjectState() {
    const projectState = await this.props.gcpService.getProjectState();
    this._updateSettingsFromProjectState(projectState);
    this.setState({ projectState });
  }

  private _updateSettingsFromProjectState(projectState: ProjectState) {
    const { settings } = this.props;
    const gcpSettings = (settings.composite as unknown) as GcpSettings;
    this.setState({ hasSelectedBucket: !!gcpSettings.gcsBucket });
    if (gcpSettings.projectId !== projectState.projectId) {
      settings.set('projectId', projectState.projectId);
    }
    if (
      !gcpSettings.schedulerRegion &&
      projectState.schedulerRegion &&
      projectState.hasCloudFunction
    ) {
      settings.set('schedulerRegion', projectState.schedulerRegion);
    }
  }
}
