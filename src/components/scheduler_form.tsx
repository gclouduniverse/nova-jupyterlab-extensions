import { INotebookModel } from '@jupyterlab/notebook';
import { FormikBag, FormikProps, withFormik } from 'formik';
import * as React from 'react';

import { RunNotebookRequest } from '../service/gcp';
import { css } from '../styles';
import { GcpSettings, OnDialogClose, PropsWithGcpService } from './dialog';
import { LearnMoreLink } from './shared/learn_more_link';
import { SchedulerDescription } from './shared/scheduler_description';
import { SelectInput } from './shared/select_input';
import { SubmitButton } from './shared/submit_button';
import { TextInput } from './shared/text_input';
import {
  CONTAINER_IMAGES,
  CUSTOM,
  MASTER_TYPES,
  REGIONS,
  SCALE_TIERS,
  SCHEDULE_TYPES,
  SINGLE,
} from '../data';

interface Props extends PropsWithGcpService {
  gcpSettings: GcpSettings;
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
}

type SchedulerFormProps = Props & FormikProps<SchedulerFormValues>;

const SCHEDULE_LINK =
  'https://cloud.google.com/scheduler/docs/configuring/cron-job-schedules';
const SCALE_TIER_LINK =
  'https://cloud.google.com/ml-engine/docs/machine-types#scale_tiers';

class InnerSchedulerForm extends React.Component<SchedulerFormProps, {}> {
  constructor(props: SchedulerFormProps) {
    super(props);

    this._onScaleTierChanged = this._onScaleTierChanged.bind(this);
  }

  render() {
    const {
      values,
      submitForm,
      handleChange,
      isSubmitting,
      status,
    } = this.props;
    return (
      <form>
        <SchedulerDescription />
        <p className={css.bold}>Notebook: {this.props.notebookName}</p>
        <TextInput
          label="Run name"
          name="jobId"
          value={values.jobId}
          onChange={handleChange}
        />
        <SelectInput
          label="Region"
          name="region"
          value={values.region}
          options={REGIONS}
          onChange={handleChange}
        />
        <SelectInput
          label="Scale tier"
          name="scaleTier"
          value={values.scaleTier}
          options={SCALE_TIERS}
          onChange={this._onScaleTierChanged}
        />
        <p className={css.noTopMargin}>
          A scale tier is a predefined cluster specification.
          <LearnMoreLink href={SCALE_TIER_LINK} />
        </p>
        {values.scaleTier === CUSTOM && (
          <SelectInput
            label="Machine type"
            name="masterType"
            value={values.masterType}
            options={MASTER_TYPES}
            onChange={handleChange}
          />
        )}
        <SelectInput
          label="Container"
          name="imageUri"
          value={values.imageUri}
          options={CONTAINER_IMAGES}
          onChange={handleChange}
        />
        <SelectInput
          label="Type"
          name="scheduleType"
          value={values.scheduleType}
          options={SCHEDULE_TYPES}
          onChange={handleChange}
        />
        {values.scheduleType !== SINGLE && (
          <div>
            <TextInput
              label="Frequency"
              name="schedule"
              value={values.schedule}
              onChange={handleChange}
            />
            <p className={css.noTopMargin}>
              Schedule is specified using unix-cron format. You can define a
              schedule so that your job runs multiple times a day, or runs on
              specific days and months.
              <LearnMoreLink href={SCHEDULE_LINK} />
            </p>
          </div>
        )}
        <div className={css.actionBar}>
          <button
            className={css.button}
            onClick={this.props.onDialogClose}
            type="button"
          >
            Cancel
          </button>
          <SubmitButton
            actionPending={isSubmitting}
            onClick={submitForm}
            text="Submit"
          />
        </div>
        {status && <p>{status}</p>}
      </form>
    );
  }

  private _onScaleTierChanged(e: React.ChangeEvent<HTMLSelectElement>) {
    const { handleChange, setFieldValue } = this.props;
    setFieldValue(
      'masterType',
      e.target.value === CUSTOM ? MASTER_TYPES[0].value : '',
      false
    );
    handleChange(e);
  }
}

/** Handles the form Submission to AI Platform */
async function submit(
  values: SchedulerFormValues,
  formikBag: FormikBag<Props, SchedulerFormValues>
) {
  const {
    jobId,
    imageUri,
    masterType,
    scaleTier,
    scheduleType,
    schedule,
    region,
  } = values;
  const { gcpService, gcpSettings, notebook, notebookName } = formikBag.props;
  const { setStatus, setSubmitting } = formikBag;

  const inputNotebookGcsPath = `${gcpSettings.gcsBucket}/${notebookName}`;
  const outputNotebookGcsPath = inputNotebookGcsPath + '__out.ipynb';
  const request: RunNotebookRequest = {
    jobId,
    imageUri,
    inputNotebookGcsPath,
    masterType,
    outputNotebookGcsPath,
    scaleTier,
    region,
  };

  let status = `Uploading ${notebookName} to ${request.inputNotebookGcsPath}`;
  setStatus(status);
  await gcpService.uploadNotebook(
    notebook.toString(),
    request.inputNotebookGcsPath
  );

  if (scheduleType !== SINGLE && schedule) {
    status = 'Submitting Job to Cloud Scheduler';
    setStatus(status);
    const job = await gcpService.scheduleNotebook(
      request,
      gcpSettings.schedulerRegion,
      gcpSettings.serviceAccount,
      schedule
    );
    status = `Successfully created ${job.name}`;
  } else {
    status = 'Submitting Job to AI Platform';
    setStatus(status);
    const job = await gcpService.runNotebook(request);
    status = `Successfully created ${job.jobId}`;
  }
  setStatus(status);
  setSubmitting(false);
}

/** Form Component to submit Scheduled Notebooks */
export const SchedulerForm = withFormik<Props, SchedulerFormValues>({
  mapPropsToValues: () => ({
    jobId: '',
    imageUri: String(CONTAINER_IMAGES[0].value),
    region: String(REGIONS[0].value),
    scaleTier: String(SCALE_TIERS[0].value),
    masterType: '',
    scheduleType: SINGLE,
    schedule: '',
  }),
  handleSubmit: submit,
})(InnerSchedulerForm);
