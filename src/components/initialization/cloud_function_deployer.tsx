import * as React from 'react';

import { css } from '../../styles';
import { OnDialogClose, PropsWithGcpService } from '../dialog';
import { LearnMoreLink } from '../shared/learn_more_link';
import { Message } from '../shared/message';
import { SubmitButton } from '../shared/submit_button';

interface Props extends PropsWithGcpService {
  onDialogClose: OnDialogClose;
  onCreated: () => void;
  region: string;
}

interface State {
  deploying: boolean;
  hasError?: boolean;
  message?: string;
}

const HTTP_TRIGGER_LINK =
  'https://cloud.google.com/functions/docs/calling/http';

/** Responsible for selecting/creating a GCS bucket. */
export class CloudFunctionDeployer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      deploying: false,
    };

    this._onDeploy = this._onDeploy.bind(this);
  }

  render() {
    const { deploying, hasError, message } = this.state;
    return (
      <div className={css.column}>
        <p>
          Your project must have an{' '}
          <LearnMoreLink
            href={HTTP_TRIGGER_LINK}
            text="HTTP-triggered Cloud Function"
          />{' '}
          in order to submit Notebooks for scheduled execution. Click the Deploy
          button to provision the necessary function in the{' '}
          <em>{this.props.region}</em> region.
        </p>
        {message && (
          <Message
            asActivity={!hasError && deploying}
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
              actionPending={deploying}
              onClick={this._onDeploy}
              text="Deploy"
            />
          </div>
        }
      </div>
    );
  }

  private async _onDeploy() {
    const { gcpService, region } = this.props;
    this.setState({
      deploying: true,
      message: `Deploying Cloud Function in ${region}. This may take a few minutes...`,
      hasError: false,
    });
    try {
      await gcpService.createCloudFunction(region);
      this.setState({
        deploying: false,
        message: `Successfully created Cloud Function in ${region}`,
      });
      this.props.onCreated();
    } catch (err) {
      this.setState({
        deploying: false,
        message: `Unable to create Cloud Function in ${region}`,
        hasError: true,
      });
    }
  }
}
