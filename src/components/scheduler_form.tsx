import * as React from 'react';
import {CircularProgress} from '@material-ui/core';

import {SchedulerDescription} from './shared/scheduler_description';
import {TextInput} from './shared/text_input';
import {CheckboxInput} from './shared/checkbox_input';
import {SelectInput} from './shared/select_input';
import {
  CONTAINER_IMAGES, CUSTOM, MASTER_TYPES, Option, REGIONS, SCALE_TIERS,
  SCHEDULE_TYPES, SINGLE
} from '../data';
import {MainProps} from './main';
import {LearnMoreLink} from './shared/learn_more_link';
import {RunNotebookRequest} from '../service/gcp';

interface State {
  imageUri: string;
  jobId: string;
  region: string;
  scaleTier: string;
  scaleTierOptions: Option[];
  masterType?: string;
  masterTypeOptions: Option[];
  schedule?: string;
  shouldSubmitFiles: boolean;
  shouldShowFrequency: boolean;
  submitPending: boolean;
  status?: string;
}

const CHECKBOX_LABEL = 'Submit all the files in the with the notebook';
const SCHEDULE_LINK =
  'https://cloud.google.com/scheduler/docs/configuring/cron-job-schedules';
const SCALE_TIER_LINK =
  'https://cloud.google.com/ml-engine/docs/machine-types#scale_tiers';

/** Form Component to submit Scheduled Notebooks */
export class SchedulerForm extends React.Component<MainProps, State> {

  constructor(props: MainProps) {
    super(props);
    this.state = {
      imageUri: String(CONTAINER_IMAGES[0].value),
      jobId: '',
      region: String(REGIONS[0].value),
      scaleTier: String(SCALE_TIERS[0].value),
      scaleTierOptions: SCALE_TIERS,
      masterTypeOptions: MASTER_TYPES,
      schedule: '? 0 * * *',
      shouldSubmitFiles: true,
      shouldShowFrequency: false,
      submitPending: false,
    };

    this.onScaleTierChanged = this.onScaleTierChanged.bind(this);
    this._run = this._run.bind(this);
  }

  render() {
    const {scaleTier, scaleTierOptions, masterTypeOptions,
      shouldShowFrequency, submitPending, status} = this.state;
    return (
      <div>
        <SchedulerDescription />
        <p style={{fontWeight: 500}}>Notebook: {this.props.notebookName}</p>

        <CheckboxInput label={CHECKBOX_LABEL}
          onChange={(shouldSubmitFiles) => this.setState({shouldSubmitFiles})} />
        <TextInput label="Run name"
          onChange={(jobId) => this.setState({jobId})} />
        <SelectInput label="Region"
          options={REGIONS} onChange={(region) => this.setState({region})} />
        <SelectInput label="Scale tier" options={scaleTierOptions}
          onChange={this.onScaleTierChanged} />
        <p>
          A scale is a predefined cluster specification.
          <LearnMoreLink href={SCALE_TIER_LINK} />
        </p>
        {scaleTier === CUSTOM &&
          <SelectInput label="Machine type" options={masterTypeOptions}
            onChange={(masterType) => this.setState({masterType})} />
        }
        <SelectInput label="Container" options={CONTAINER_IMAGES}
          onChange={(imageUri) => this.setState({imageUri})} />
        <SelectInput label="Type" options={SCHEDULE_TYPES}
          onChange={(scheduleType) => this.setState({
            shouldShowFrequency: scheduleType !== SINGLE
          })} />
        {shouldShowFrequency &&
          <div>
            <TextInput label="Frequency"
              onChange={(schedule) => this.setState({schedule})} />
            <p>
              Schedule is specified using unix-cron format. You can define a
            schedule so that your job runs multiple times a day,
            or runs on specific days and months.
              <LearnMoreLink href={SCHEDULE_LINK} />
            </p>
          </div>
        }
        <div>
          {submitPending ? <CircularProgress size='18px' /> :
            <button
              onClick={this._run}>Submit</button>}
        </div>
        {status && <p>{status}</p>}
      </div>
    );
  }

  onScaleTierChanged(scaleTier: string) {
    this.setState({
      scaleTier,
      masterType: scaleTier !== CUSTOM ? '' : this.state.masterType
    });
  }

  private async _run() {
    const {gcpService, notebook} = this.props;
    const request = this._buildRunNotebookRequest();

    let status =
      `Uploading ${this.props.notebookName} to ${request.inputNotebookGcsPath}`;
    this.setState({status});
    await gcpService.uploadNotebook(notebook.toString(),
      request.inputNotebookGcsPath);

    if (this.state.shouldShowFrequency && this.state.schedule) {
      status = 'Submitting Job to Cloud Scheduler';
      this.setState({status});
      // TODO: Obtain Cloud Function URL and Service Account from settings
      const job = await gcpService.scheduleNotebook(request,
        'https://us-central1-prodonjs-kubeflow-dev.cloudfunctions.net/submitScheduledNotebook',
        'prodonjs-kubeflow-dev@appspot.gserviceaccount.com',
        this.state.schedule
      );
      status = `Successfully created ${job.name}`;
    } else {
      status = 'Submitting Job to AI Platform';
      this.setState({status});
      const job = await gcpService.runNotebook(request);
      status = `Successfully created ${job.jobId}`;
    }
    this.setState({status});
  }

  private _buildRunNotebookRequest(): RunNotebookRequest {
    const {notebookName} = this.props;
    const {jobId, imageUri, region, scaleTier, masterType} = this.state;

    // TODO: Obtain bucket from project settings stored during initialization
    const inputNotebookGcsPath = `gs://prodonjs-kubeflow-dev/notebooks/${notebookName}`;
    const outputNotebookGcsPath = inputNotebookGcsPath + '__out.ipynb';
    return {
      jobId,
      imageUri,
      inputNotebookGcsPath,
      masterType,
      outputNotebookGcsPath,
      scaleTier,
      region,
    };
  }
}
