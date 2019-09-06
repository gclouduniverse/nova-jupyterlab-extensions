import * as React from 'react';

import { Option } from '../../data';
import { css } from '../../styles';
import { OnDialogClose, PropsWithGcpService } from '../dialog';
import { LearnMoreLink } from '../shared/learn_more_link';
import { Message } from '../shared/message';
import { SelectInput } from '../shared/select_input';
import { SubmitButton } from '../shared/submit_button';
import { TextInput } from '../shared/text_input';

interface Props extends PropsWithGcpService {
  buckets: string[];
  onDialogClose: OnDialogClose;
  onSelected: (bucket: string) => void;
}

interface State {
  createNewBucket: boolean;
  bucket?: string;
  bucketOptions: Option[];
  actionPending: boolean;
  hasError?: boolean;
  message?: string;
  newBucket?: string;
}

const BUCKET_NAMING_LINK = 'https://cloud.google.com/storage/docs/naming';
const CREATE_NEW_OPTION: Option = { text: 'Create new...', value: '__new__' };

/** Responsible for selecting/creating a GCS bucket. */
export class GcsBucketSelector extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const bucket = props.buckets.length
      ? props.buckets[0]
      : String(CREATE_NEW_OPTION.value);

    this.state = {
      actionPending: false,
      createNewBucket: bucket === CREATE_NEW_OPTION.value,
      bucket,
      bucketOptions: props.buckets
        .map((b): Option => ({ text: b, value: b }))
        .concat([CREATE_NEW_OPTION]),
    };

    this._onBucketSelected = this._onBucketSelected.bind(this);
    this._onSubmit = this._onSubmit.bind(this);
  }

  render() {
    const {
      actionPending,
      bucketOptions,
      createNewBucket,
      hasError,
      message,
    } = this.state;
    return (
      <div className={css.column}>
        <p>
          Select an existing or
          <LearnMoreLink href={BUCKET_NAMING_LINK} text="create a new" />
          Cloud Storage bucket to store your Notebook sources and outputs.
        </p>
        <div>
          <SelectInput
            label="Bucket"
            name="bucket"
            options={bucketOptions}
            onChange={this._onBucketSelected}
          />
          {createNewBucket && (
            <TextInput
              label="New Bucket"
              name="newBucket"
              onChange={e => this.setState({ newBucket: e.target.value })}
            />
          )}
        </div>
        {message && (
          <Message
            asActivity={!hasError && actionPending}
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
              actionPending={actionPending}
              onClick={this._onSubmit}
              text={createNewBucket ? 'Create' : 'Select'}
            />
          </div>
        }
      </div>
    );
  }

  private _onBucketSelected(e: React.ChangeEvent<HTMLSelectElement>) {
    const bucket = e.target.value;
    const createNewBucket = bucket === CREATE_NEW_OPTION.value;
    this.setState({ bucket, createNewBucket });
  }

  private async _onSubmit() {
    let { bucket } = this.state;
    const { createNewBucket, newBucket } = this.state;
    if (createNewBucket) {
      if (newBucket && newBucket.startsWith('gs://')) {
        try {
          await this._createGcsBucket(newBucket);
          bucket = newBucket;
        } catch (err) {
          this.setState({
            actionPending: false,
            message: `Unable to create Cloud Storage bucket ${newBucket}`,
            hasError: true,
          });
          return;
        }
      } else {
        this.setState({
          hasError: true,
          message: 'Please provide a valid bucket name starting with gs://',
        });
        return;
      }
    }
    this.props.onSelected(bucket);
  }

  // Creates the GCS Bucket
  private async _createGcsBucket(bucket: string) {
    this.setState({
      actionPending: true,
      hasError: false,
      message: `Creating Cloud Storage bucket ${bucket}...`,
    });
    await this.props.gcpService.createBucket(bucket.slice(5)); // strip gs://
    this.setState({
      actionPending: false,
      message: `Successfully created Cloud Storage bucket ${bucket}`,
    });
  }
}
