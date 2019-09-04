import {INotebookModel} from '@jupyterlab/notebook';
import {mount, ReactWrapper} from 'enzyme';
import * as React from 'react';

import {CUSTOM, RECURRING, CONTAINER_IMAGES} from '../data';
import {GcpService, RunNotebookRequest} from '../service/gcp';
import {SchedulerForm} from './scheduler_form';

// Simulates a form input change
function simulateFieldChange(wrapper: ReactWrapper,
  selector: string, name: string, value: string) {
  wrapper.find(selector)
    .simulate('change', {
      persist: () => {},
      target: {name, value}
    });
}

// Immediate promise that can be awaited
function immediatePromise(): Promise<void> {
  return new Promise((r) => setTimeout(r));
}

describe('SchedulerForm', () => {
  const notebookName = 'Test Notebook.ipynb';
  const notebookContents = '{"notebook": "test"}';

  const mockUploadNotebook = jest.fn();
  const mockRunNotebook = jest.fn();
  const mockScheduleNotebook = jest.fn();
  const mockNotebookContents = jest.fn();
  const mockDialogClose = jest.fn();
  const mockGcpService = {
    uploadNotebook: mockUploadNotebook,
    runNotebook: mockRunNotebook,
    scheduleNotebook: mockScheduleNotebook
  } as undefined as GcpService;
  const mockNotebook = {
    toString: mockNotebookContents
  } as unknown as INotebookModel;

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
  });

  it('Toggles Machine type visibility based on Scale tier', async () => {
    const schedulerForm = mount(<SchedulerForm {...mockProps} />);
    expect(schedulerForm.find('select[name="masterType"]')).toHaveLength(0);

    simulateFieldChange(schedulerForm, 'select[name="scaleTier"]',
      'scaleTier', CUSTOM);

    expect(schedulerForm.find('select[name="masterType"]')).toHaveLength(1);
  });

  it('Toggles Schedule visibility based on Frequency', async () => {

    const schedulerForm = mount(<SchedulerForm {...mockProps} />);
    expect(schedulerForm.find('input[name="schedule"]')).toHaveLength(0);

    simulateFieldChange(schedulerForm, 'select[name="scheduleType"]',
      'scheduleType', RECURRING);

    expect(schedulerForm.find('input[name="schedule"]')).toHaveLength(1);
  });


  it('Submits an immediate job to AI Platform', async () => {
    const gcsPath = 'gs://test-project/notebooks/Test Notebook.ipynb';
    const uploadNotebookPromise = Promise.resolve();
    const runNotebookPromise = Promise.resolve({jobId: 'aiplatform_job_1'});

    mockNotebookContents.mockReturnValue(notebookContents);
    mockUploadNotebook.mockReturnValue(uploadNotebookPromise);
    mockRunNotebook.mockReturnValue(runNotebookPromise);

    const schedulerForm = mount(<SchedulerForm {...mockProps} />);

    simulateFieldChange(schedulerForm, 'input[name="jobId"]',
      'jobId', 'test_immediate_job');

    // Submit the form and wait for an immediate promise to flush other promises
    schedulerForm.find('SubmitButton button').simulate('click');
    await immediatePromise();

    schedulerForm.update();

    expect(schedulerForm
      .contains(<p>Successfully created aiplatform_job_1</p>)).toBe(true);
    expect(mockGcpService.uploadNotebook)
      .toHaveBeenCalledWith(notebookContents, gcsPath);
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
    const gcsPath = 'gs://test-project/notebooks/Test Notebook.ipynb';
    const uploadNotebookPromise = Promise.resolve();
    const scheduleNotebookPromise = Promise.resolve(
      {name: 'cloudscheduler_job_1'});

    mockNotebookContents.mockReturnValue(notebookContents);
    mockUploadNotebook.mockReturnValue(uploadNotebookPromise);
    mockScheduleNotebook.mockReturnValue(scheduleNotebookPromise);

    const schedulerForm = mount(<SchedulerForm {...mockProps} />);
    simulateFieldChange(schedulerForm, 'input[name="jobId"]',
      'jobId', 'test_scheduled_job');
    simulateFieldChange(schedulerForm, 'select[name="region"]',
      'region', 'us-east1');
    simulateFieldChange(schedulerForm, 'select[name="scaleTier"]',
      'scaleTier', CUSTOM);
    simulateFieldChange(schedulerForm, 'select[name="masterType"]',
      'masterType', 'complex_model_m_gpu');
    simulateFieldChange(schedulerForm, 'select[name="imageUri"]',
      'imageUri', String(CONTAINER_IMAGES[2].value));
    simulateFieldChange(schedulerForm, 'select[name="scheduleType"]',
      'scheduleType', RECURRING);
    simulateFieldChange(schedulerForm, 'input[name="schedule"]',
      'schedule', '0 0 * * *');
    // Submit the form and wait for an immediate promise to flush other promises
    schedulerForm.find('SubmitButton button').simulate('click');
    await immediatePromise();

    schedulerForm.update();

    expect(schedulerForm
      .contains(<p>Successfully created cloudscheduler_job_1</p>)).toBe(true);
    expect(mockGcpService.uploadNotebook)
      .toHaveBeenCalledWith(notebookContents, gcsPath);
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
      'test-project@appspot.gserviceaccount.com', '0 0 * * *');
  });
});
