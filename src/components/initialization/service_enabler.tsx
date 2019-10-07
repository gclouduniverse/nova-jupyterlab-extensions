import * as React from 'react';
import * as csstips from 'csstips';
import { Check, Close } from '@material-ui/icons';
import { withStyles } from '@material-ui/core';
import { stylesheet } from 'typestyle';

import { PropsWithGcpService, OnDialogClose } from '../dialog';
import { ProjectState } from '../../service/gcp';
import { css, COLORS } from '../../styles';
import { LearnMoreLink } from '../shared/learn_more_link';
import { SubmitButton } from '../shared/submit_button';
import { Message } from '../shared/message';

interface Props extends PropsWithGcpService {
  onDialogClose: OnDialogClose;
  onStateChange: () => void;
  projectState: ProjectState;
}

interface State {
  enablingApis: boolean;
  message?: string;
  hasError?: boolean;
}

const localStyles = stylesheet({
  serviceStatuses: {
    ...csstips.vertical,
    ...csstips.padding('16px', 0),
  },
  serviceStatusItem: {
    alignItems: 'center',
    color: COLORS.link,
    letterSpacing: '0.09px',
    lineHeight: '20px',
    ...csstips.horizontal,
    $nest: {
      '&>*': { paddingRight: '4px' },
    },
  },
});

// tslint:disable-next-line:enforce-name-casing
const GreenCheck = withStyles({
  root: {
    color: COLORS.green,
    fontSize: '16px',
  },
})(Check);

// tslint:disable-next-line:enforce-name-casing
const RedClose = withStyles({
  root: {
    color: COLORS.red,
    fontSize: '16px',
  },
})(Close);

/** Responsible for enabling necessary GCP services. */
export class ServiceEnabler extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      enablingApis: false,
    };

    this._onEnable = this._onEnable.bind(this);
  }

  render() {
    const { projectState } = this.props;
    const { enablingApis, message, hasError } = this.state;
    return (
      <div className={css.column}>
        <p>
          In order to schedule Notebook runs, the following APIs must be
          enabled. These services may incur additional charges when used. By
          clicking <em>Enable</em>, you are agreeing to the terms of service for
          the various APIs and charges for their use. This may take a few
          minutes.
        </p>
        <div className={localStyles.serviceStatuses}>
          {projectState.serviceStatuses.map(s => {
            return (
              <div
                className={localStyles.serviceStatusItem}
                key={s.service.endpoint}
              >
                {this._getIconForState(s.enabled)}
                <LearnMoreLink
                  href={s.service.documentation}
                  text={s.service.name}
                />
              </div>
            );
          })}
        </div>
        {message && (
          <Message
            asActivity={!hasError && enablingApis}
            asError={hasError}
            text={message}
          />
        )}
        {
          <div className={css.actionBar}>
            <button className={css.button} onClick={this.props.onDialogClose}>
              Cancel
            </button>
            <SubmitButton
              actionPending={enablingApis}
              onClick={this._onEnable}
              text="Enable"
            />
          </div>
        }
      </div>
    );
  }

  private _getIconForState(enabled: boolean): JSX.Element {
    return enabled ? <GreenCheck /> : <RedClose />;
  }

  private async _onEnable() {
    const toEnable = this.props.projectState.serviceStatuses
      .filter(s => !s.enabled)
      .map(s => s.service.endpoint);
    // Services must be enabled before GCS Bucket and Cloud Function creation
    if (toEnable.length) {
      this.setState({
        enablingApis: true,
        hasError: false,
        message: 'Enabling all necessary APIs. This may take a few minutes...',
      });
      try {
        await this.props.gcpService.enableServices(toEnable);
        this.setState({ enablingApis: false, message: 'All services enabled' });
        this.props.onStateChange();
      } catch (err) {
        this.setState({
          enablingApis: false,
          hasError: true,
          message: `${err}: Unable to enable necessary GCP APIs`,
        });
      }
    }
  }
}
