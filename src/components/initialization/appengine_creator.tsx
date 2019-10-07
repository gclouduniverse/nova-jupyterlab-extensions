import * as React from 'react';

import { Option, APPENGINE_REGIONS } from '../../data';
import { css } from '../../styles';
import { OnDialogClose, PropsWithGcpService } from '../dialog';
import { LearnMoreLink } from '../shared/learn_more_link';
import { Message } from '../shared/message';
import { SubmitButton } from '../shared/submit_button';
import { SelectInput } from '../shared/select_input';

interface Props extends PropsWithGcpService {
  onDialogClose: OnDialogClose;
  onStateChange: () => void;
}

interface State {
  creatingApp: boolean;
  hasError?: boolean;
  message?: string;
  region: string;
  regionOptions: Option[];
}

const SUPPORTED_REGIONS_LINK =
  'https://cloud.google.com/scheduler/docs/#supported_regions';

/** Responsible for creating an AppEngine Project. */
export class AppEngineCreator extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      creatingApp: false,
      region: String(APPENGINE_REGIONS[0].value),
      regionOptions: APPENGINE_REGIONS,
    };

    this._onCreate = this._onCreate.bind(this);
  }

  render() {
    const { creatingApp, message, hasError, regionOptions } = this.state;
    return (
      <div className={css.column}>
        <p>
          In order to use Cloud Scheduler, your project must contain an App
          Engine app that is located in one of the supported regions
          <LearnMoreLink href={SUPPORTED_REGIONS_LINK} />. Please select a
          region near your users and click Create.
        </p>
        <div>
          <SelectInput
            label="Region"
            name="region"
            options={regionOptions}
            onChange={e => this.setState({ region: e.target.value })}
          />
        </div>
        {message && (
          <Message
            asActivity={!hasError && creatingApp}
            asError={hasError}
            text={message}
          />
        )}
        {
          // TODO: Refactor action bar to its own shared component
          <div className={css.actionBar}>
            <button className={css.button} onClick={this.props.onDialogClose}>
              Cancel
            </button>
            <SubmitButton
              actionPending={creatingApp}
              onClick={this._onCreate}
              text="Create"
            />
          </div>
        }
      </div>
    );
  }

  private async _onCreate() {
    const { region } = this.state;
    this.setState({
      creatingApp: true,
      hasError: false,
      message: `Please wait while we create an App Engine app in ${region}...`,
    });
    try {
      await this.props.gcpService.createAppEngineApp(region);
      this.setState({
        creatingApp: false,
        message: `Successfully created App Engine app in ${region}`,
      });
      this.props.onStateChange();
    } catch (err) {
      this.setState({
        creatingApp: false,
        message: `${err}: Unable to create App Engine app in ${region}`,
        hasError: true,
      });
    }
  }
}
