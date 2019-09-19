import { INotebookModel } from '@jupyterlab/notebook';
import { mount, ReactWrapper } from 'enzyme';
import * as React from 'react';

import { CUSTOM, RECURRING, CONTAINER_IMAGES } from '../data';
import { GcpService, RunNotebookRequest } from '../service/gcp';
import { SchedulerForm } from './scheduler_form';
import { Message } from './shared/message';

// Simulates a form input change
function simulateFieldChange(
  wrapper: ReactWrapper,
  selector: string,
  name: string,
  value: string
) {
  wrapper.find(selector).simulate('change', {
    persist: () => {},
    target: { name, value },
  });
}

// Immediate promise that can be awaited
function immediatePromise(): Promise<void> {
  return new Promise(r => setTimeout(r));
}

// Function to resolve when triggered to allow testing multiple async promises
function triggeredResolver(
  resolveValue?: any
): { resolve: () => void; promise: Promise<any> } {
  let done = false;
  const promise = new Promise(r => {
    const runner = async () => {
      while (!done) {
        await immediatePromise();
      }
      r(resolveValue);
    };
    runner();
  });
  const resolve = () => {
    done = true;
  };
  return { resolve, promise };
}

describe('SchedulerForm', () => {
  const notebookName = 'Test Notebook.ipynb';
  const notebookContents = '{"notebook": "test"}';
  const gcsPath = 'gs://test-project/notebooks/Test Notebook.ipynb';

  const mockUploadNotebook = jest.fn();
  const mockRunNotebook = jest.fn();
  const mockScheduleNotebook = jest.fn();
  const mockNotebookContents = jest.fn();
  const mockDialogClose = jest.fn();
  const mockGetImageUri = jest.fn();
  const mockGcpService = ({
    uploadNotebook: mockUploadNotebook,
    runNotebook: mockRunNotebook,
    scheduleNotebook: mockScheduleNotebook,
    getImageUri: mockGetImageUri,
  } as unknown) as GcpService;
  const mockNotebook = ({
    toString: mockNotebookContents,
  } as unknown) as INotebookModel;

  const mockProps = {
    gcpService: mockGcpService,
    gcpSettings: {
      projectId: 'test-project',
      gcsBucket: 'gs://test-project/notebooks',
      schedulerRegion: 'us-east1',
      serviceAccount: 'test-project@appspot.gserviceaccount.com',
    },
    notebook: mockNotebook,
    notebookName,
    onDialogClose: mockDialogClose,
  };

  beforeEach(() => {
    jest.resetAllMocks();
    mockGetImageUri.mockResolvedValue('');
  });

  it('Toggles Machine type visibility based on Scale tier', async () => {
    const schedulerForm = mount(<SchedulerForm {...mockProps} />);
    expect(schedulerForm.find('select[name="masterType"]')).toHaveLength(0);

    simulateFieldChange(
      schedulerForm,
      'select[name="scaleTier"]',
      'scaleTier',
      CUSTOM
    );

    expect(schedulerForm.find('select[name="masterType"]')).toHaveLength(1);
  });

  it('Toggles Schedule visibility based on Frequency', async () => {
    const schedulerForm = mount(<SchedulerForm {...mockProps} />);
    expect(schedulerForm.find('input[name="schedule"]')).toHaveLength(0);

    simulateFieldChange(
      schedulerForm,
      'select[name="scheduleType"]',
      'scheduleType',
      RECURRING
    );

    expect(schedulerForm.find('input[name="schedule"]')).toHaveLength(1);
  });

  it('Should show error message if run name is empty', async () => {
    const schedulerForm = mount(<SchedulerForm {...mockProps} />);
    schedulerForm.find('SubmitButton button').simulate('click');
    await immediatePromise();
    expect(schedulerForm.html()).toContain('Run name is required');
  });

  it('Should prepopulate imageUri if it match options in form', async () => {
    mockGetImageUri.mockResolvedValue(
      'gcr.io/deeplearning-platform-release/tf-gpu.1-14:m35'
    );
    const schedulerForm = mount(<SchedulerForm {...mockProps} />);

    await immediatePromise();
    schedulerForm.update();

    expect(schedulerForm.find('select[name="imageUri"]').props().value).toBe(
      'gcr.io/deeplearning-platform-release/tf-gpu.1-14:latest'
    );
  });

  it(`Should show error message if run name contains character other than letter
      , number, and underscore`, async () => {
    const schedulerForm = mount(<SchedulerForm {...mockProps} />);
    simulateFieldChange(schedulerForm, 'input[name="jobId"]', 'jobId', '!');
    await immediatePromise();
    expect(schedulerForm.html()).toContain(
      'Run name can only contain letters, numbers, or underscores.'
    );

    simulateFieldChange(schedulerForm, 'input[name="jobId"]', 'jobId', '  ');
    await immediatePromise();
    expect(schedulerForm.html()).toContain(
      'Run name can only contain letters, numbers, or underscores.'
    );
  });

  it('Should show error message if frequency is empty', async () => {
    const schedulerForm = mount(<SchedulerForm {...mockProps} />);
    simulateFieldChange(
      schedulerForm,
      'input[name="jobId"]',
      'jobId',
      'test_scheduled_job'
    );
    simulateFieldChange(
      schedulerForm,
      'select[name="scheduleType"]',
      'scheduleType',
      RECURRING
    );

    schedulerForm.find('SubmitButton button').simulate('click');
    await immediatePromise();
    expect(schedulerForm.html()).toContain('Frequency is required');
  });

  it('Submits an immediate job to AI Platform', async () => {
    const uploadNotebookPromise = triggeredResolver();
    const runNotebookPromise = triggeredResolver({ jobId: 'aiplatform_job_1' });

    mockNotebookContents.mockReturnValue(notebookContents);
    mockUploadNotebook.mockReturnValue(uploadNotebookPromise.promise);
    mockRunNotebook.mockReturnValue(runNotebookPromise.promise);

    const schedulerForm = mount(<SchedulerForm {...mockProps} />);

    simulateFieldChange(
      schedulerForm,
      'input[name="jobId"]',
      'jobId',
      'test_immediate_job'
    );

    // Submit the form and wait for an immediate promise to flush other promises
    schedulerForm.find('SubmitButton button').simulate('click');
    await immediatePromise();
    schedulerForm.update();
    expect(
      schedulerForm.contains(
        <Message
          asActivity={true}
          asError={false}
          text={
            'Uploading Test Notebook.ipynb to gs://test-project/notebooks/Test Notebook.ipynb'
          }
        />
      )
    ).toBe(true);

    uploadNotebookPromise.resolve();
    await uploadNotebookPromise.promise;
    schedulerForm.update();
    expect(
      schedulerForm.contains(
        <Message
          asError={false}
          asActivity={true}
          text={'Submitting Job to AI Platform'}
        />
      )
    ).toBe(true);

    runNotebookPromise.resolve();
    await runNotebookPromise.promise;
    schedulerForm.update();
    expect(
      schedulerForm.contains(
        <Message
          asError={false}
          asActivity={false}
          text={'Successfully created aiplatform_job_1'}
        />
      )
    ).toBe(true);

    expect(mockGcpService.uploadNotebook).toHaveBeenCalledWith(
      notebookContents,
      gcsPath
    );
    const aiPlatformRequest: RunNotebookRequest = {
      jobId: 'test_immediate_job',
      imageUri: 'gcr.io/deeplearning-platform-release/base-cpu:latest',
      inputNotebookGcsPath: gcsPath,
      masterType: '',
      outputNotebookGcsPath: `${gcsPath}__out.ipynb`,
      scaleTier: 'BASIC',
      region: 'us-central1',
    };
    expect(mockGcpService.runNotebook).toHaveBeenCalledWith(aiPlatformRequest);
  });

  it('Submits a scheduled job to Cloud Scheduler', async () => {
    const uploadNotebookPromise = triggeredResolver();
    const scheduleNotebookPromise = triggeredResolver({
      name: 'cloudscheduler_job_1',
    });

    mockNotebookContents.mockReturnValue(notebookContents);
    mockUploadNotebook.mockReturnValue(uploadNotebookPromise.promise);
    mockScheduleNotebook.mockReturnValue(scheduleNotebookPromise.promise);

    const schedulerForm = mount(<SchedulerForm {...mockProps} />);
    simulateFieldChange(
      schedulerForm,
      'input[name="jobId"]',
      'jobId',
      'test_scheduled_job'
    );
    simulateFieldChange(
      schedulerForm,
      'select[name="region"]',
      'region',
      'us-east1'
    );
    simulateFieldChange(
      schedulerForm,
      'select[name="scaleTier"]',
      'scaleTier',
      CUSTOM
    );
    simulateFieldChange(
      schedulerForm,
      'select[name="masterType"]',
      'masterType',
      'complex_model_m_gpu'
    );
    simulateFieldChange(
      schedulerForm,
      'select[name="imageUri"]',
      'imageUri',
      String(CONTAINER_IMAGES[2].value)
    );
    simulateFieldChange(
      schedulerForm,
      'select[name="scheduleType"]',
      'scheduleType',
      RECURRING
    );
    simulateFieldChange(
      schedulerForm,
      'input[name="schedule"]',
      'schedule',
      '0 0 * * *'
    );
    // Submit the form and wait for an immediate promise to flush other promises
    schedulerForm.find('SubmitButton button').simulate('click');
    await immediatePromise();
    uploadNotebookPromise.resolve();
    await uploadNotebookPromise.promise;
    schedulerForm.update();
    expect(
      schedulerForm.contains(
        <Message
          asError={false}
          asActivity={true}
          text={'Submitting Job to Cloud Scheduler'}
        />
      )
    ).toBe(true);

    scheduleNotebookPromise.resolve();
    await scheduleNotebookPromise.promise;
    schedulerForm.update();
    expect(
      schedulerForm.contains(
        <Message
          asError={false}
          asActivity={false}
          text={'Successfully created cloudscheduler_job_1'}
        />
      )
    ).toBe(true);
    expect(mockGcpService.uploadNotebook).toHaveBeenCalledWith(
      notebookContents,
      gcsPath
    );
    const aiPlatformRequest: RunNotebookRequest = {
      jobId: 'test_scheduled_job',
      imageUri: 'gcr.io/deeplearning-platform-release/tf-gpu.1-14:latest',
      inputNotebookGcsPath: gcsPath,
      masterType: 'complex_model_m_gpu',
      outputNotebookGcsPath: `${gcsPath}__out.ipynb`,
      scaleTier: 'CUSTOM',
      region: 'us-east1',
    };
    expect(mockGcpService.scheduleNotebook).toHaveBeenCalledWith(
      aiPlatformRequest,
      'us-east1',
      '0 0 * * *'
    );
  });

  it('Fails to upload Notebook to GCS', async () => {
    mockNotebookContents.mockReturnValue(notebookContents);
    mockUploadNotebook.mockRejectedValue('Unable to upload');

    const schedulerForm = mount(<SchedulerForm {...mockProps} />);

    simulateFieldChange(
      schedulerForm,
      'input[name="jobId"]',
      'jobId',
      'test_failed_upload'
    );

    // Submit the form and wait for an immediate promise to flush other promises
    schedulerForm.find('SubmitButton button').simulate('click');
    await immediatePromise();
    schedulerForm.update();
    expect(
      schedulerForm.contains(
        <Message
          asActivity={false}
          asError={true}
          text={
            'Unable to upload Test Notebook.ipynb to gs://test-project/notebooks/Test Notebook.ipynb'
          }
        />
      )
    ).toBe(true);

    expect(mockGcpService.uploadNotebook).toHaveBeenCalledWith(
      notebookContents,
      gcsPath
    );
    expect(mockGcpService.runNotebook).not.toHaveBeenCalled();
  });

  it('Fails to submit job', async () => {
    mockNotebookContents.mockReturnValue(notebookContents);
    mockUploadNotebook.mockResolvedValue(true);
    mockRunNotebook.mockRejectedValue('Unable to run Notebook');

    const schedulerForm = mount(<SchedulerForm {...mockProps} />);

    simulateFieldChange(
      schedulerForm,
      'input[name="jobId"]',
      'jobId',
      'test_failed_job_submission'
    );

    // Submit the form and wait for an immediate promise to flush other promises
    schedulerForm.find('SubmitButton button').simulate('click');
    await immediatePromise();
    schedulerForm.update();
    expect(
      schedulerForm.contains(
        <Message
          asActivity={false}
          asError={true}
          text={'Unable to submit job'}
        />
      )
    ).toBe(true);

    expect(mockGcpService.uploadNotebook).toHaveBeenCalledWith(
      notebookContents,
      gcsPath
    );
    const aiPlatformRequest: RunNotebookRequest = {
      jobId: 'test_failed_job_submission',
      imageUri: 'gcr.io/deeplearning-platform-release/base-cpu:latest',
      inputNotebookGcsPath: gcsPath,
      masterType: '',
      outputNotebookGcsPath: `${gcsPath}__out.ipynb`,
      scaleTier: 'BASIC',
      region: 'us-central1',
    };
    expect(mockGcpService.runNotebook).toHaveBeenCalledWith(aiPlatformRequest);
  });
});
