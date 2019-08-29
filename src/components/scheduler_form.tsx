import {INotebookModel} from '@jupyterlab/notebook';
import * as React from 'react';
import {withFormik, FormikProps, FormikBag} from 'formik';

import {
  CONTAINER_IMAGES,
  CUSTOM,
  MASTER_TYPES,
  REGIONS,
  SCALE_TIERS,
  SCHEDULE_TYPES,
  SINGLE,
  Option,
} from '../data';
import {RunNotebookRequest} from '../service/gcp';
import {css} from '../styles';
import {CheckboxInput} from './shared/checkbox_input';
import {LearnMoreLink} from './shared/learn_more_link';
import {SchedulerDescription} from './shared/scheduler_description';
import {SelectInput} from './shared/select_input';
import {SubmitButton} from './shared/submit_button';
import {TextInput} from './shared/text_input';
import {PropsWithGcpService, OnDialogClose} from './dialog';

export interface SchedulerFormProps extends PropsWithGcpService {
  notebookName: string;
  notebook: INotebookModel;
  onDialogClose: OnDialogClose;
}

interface SchedulerFormValues {
  jobId: string;
  region: string;
  scaleTier: string;
  masterType?: string;
  imageUri: string;
  scheduleType: string;
  schedule?: string;
  shouldSubmitFiles?: boolean;
}

interface EnhancedSchedulerFormProps extends SchedulerFormProps, FormikProps<SchedulerFormValues> {}

interface SchedulerFormState {
  masterTypesOptions: Option[];
}

const CHECKBOX_LABEL = 'Submit all the files in the with the notebook';
const SCHEDULE_LINK =
  'https://cloud.google.com/scheduler/docs/configuring/cron-job-schedules';
const SCALE_TIER_LINK =
  'https://cloud.google.com/ml-engine/docs/machine-types#scale_tiers';

/** Form Component to submit Scheduled Notebooks */
export class SchedulerForm extends React.Component<EnhancedSchedulerFormProps, SchedulerFormState> {

  constructor(props: EnhancedSchedulerFormProps) {
    super(props);

    this.state = {
      masterTypesOptions: MASTER_TYPES,
    };
  }

  onScaleTierChanged = (e: React.ChangeEvent<any>) => {
    const {handleChange, setFieldValue} = this.props;
    setFieldValue('masterType', e.target.value !== CUSTOM ? '' : MASTER_TYPES[0].value);
    handleChange(e)
  }

  render() {
    const {values, submitForm, handleChange, isSubmitting, status} = this.props;
    return (
      <div>
        <SchedulerDescription />
        <p className={css.bold}>Notebook: {this.props.notebookName}</p>

        <CheckboxInput
          label={CHECKBOX_LABEL}
          name="shouldSubmitFiles"
          onChange={handleChange} />
        <TextInput
          label="Run name"
          name="jobId"
          value={values.jobId}
          onChange={handleChange} />
        <SelectInput
          label="Region"
          name="region"
          value={values.region}
          options={REGIONS}
          onChange={handleChange} />
        <SelectInput
          label="Scale tier"
          name="scaleTier"
          value={values.scaleTier}
          options={SCALE_TIERS}
          onChange={this.onScaleTierChanged} />
        <p className={css.noTopMargin}>
          A scale is a predefined cluster specification.
          <LearnMoreLink href={SCALE_TIER_LINK} />
        </p>
        {values.scaleTier === CUSTOM &&
          <SelectInput
            label="Machine type"
            name="masterType"
            value={values.masterType}
            options={MASTER_TYPES}
            onChange={handleChange} />
        }
        <SelectInput
          label="Container"
          name="imageUri"
          value={values.imageUri}
          options={CONTAINER_IMAGES}
          onChange={handleChange} />
        <SelectInput
          label="Type"
          name="scheduleType"
          value={values.scheduleType}
          options={SCHEDULE_TYPES}
          onChange={handleChange} />
        {values.scheduleType !== SINGLE &&
          <div>
            <TextInput
              label="Frequency"
              name="schedule"
              value={values.schedule}
              onChange={handleChange} />
            <p className={css.noTopMargin}>
              Schedule is specified using unix-cron format. You can define a
              schedule so that your job runs multiple times a day,
              or runs on specific days and months.
              <LearnMoreLink href={SCHEDULE_LINK} />
            </p>
          </div>
        }
        <div className={css.actionBar}>
          <button className={css.button} onClick={this.props.onDialogClose}>
            Cancel
          </button>
          <SubmitButton
            actionPending={isSubmitting}
            onClick={() => {
              submitForm();
            }}
            text='Submit' />
        </div>
        {status && status.msg && <div>{status.msg}</div>}
      </div>
    );
  }
}

export const EnhancedSchedulerForm = withFormik<SchedulerFormProps, SchedulerFormValues>({
  mapPropsToValues: () => (
    {
      jobId: '',
      region: String(REGIONS[1].value),
      scaleTier: String(SCALE_TIERS[0].value),
      imageUri: String(CONTAINER_IMAGES[0].value),
      scheduleType: SINGLE,
      schedule: '',
    }
  ),
  handleSubmit: submit,
})(SchedulerForm);

async function submit(values: SchedulerFormValues, formikBag: FormikBag<SchedulerFormProps, SchedulerFormValues>) {
  const {gcpService, notebook, notebookName} = formikBag.props;
  const {setStatus, setSubmitting} = formikBag;
  const request = await _buildRunNotebookRequest(values, formikBag);

  let status =
    `Uploading ${notebookName} to ${request.inputNotebookGcsPath}`;
  setStatus({msg: status});
  await gcpService.uploadNotebook(notebook.toString(),
    request.inputNotebookGcsPath);

  if (values.scheduleType !== SINGLE && values.schedule) {
    status = 'Submitting Job to Cloud Scheduler';
    setStatus({msg: status});
    // TODO: Obtain Cloud Function URL and Service Account from settings
    const job = await gcpService.scheduleNotebook(request,
      'https://us-central1-prodonjs-kubeflow-dev.cloudfunctions.net/submitScheduledNotebook',
      'prodonjs-kubeflow-dev@appspot.gserviceaccount.com',
      values.schedule
    );
    status = `Successfully created ${job.name}`;
  } else {
    status = 'Submitting Job to AI Platform';
    setStatus({msg: status});
    const job = await gcpService.runNotebook(request);
    status = `Successfully created ${job.jobId}`;
  }
  setStatus({msg: status});
  setSubmitting(false);
}

async function _buildRunNotebookRequest(values: SchedulerFormValues, formikBag: FormikBag<SchedulerFormProps, SchedulerFormValues>): Promise<RunNotebookRequest> {
  const {notebookName} = formikBag.props;
  const {jobId, region, scaleTier, masterType, imageUri} = values;

  // TODO: Obtain bucket from project settings stored during initialization
  const inputNotebookGcsPath = `gs://prodonjs-kubeflow-dev/notebooks/${notebookName}`;
  const outputNotebookGcsPath = inputNotebookGcsPath + '__out.ipynb';

  return {
    jobId,
    imageUri,
    inputNotebookGcsPath,
    masterType: scaleTier !== CUSTOM ? '' : masterType,
    outputNotebookGcsPath,
    scaleTier,
    region,
  };
}
