import * as React from 'react';
import {shallow} from 'enzyme';

import {GcpService, RunNotebookRequest} from '../service/gcp';
import {MainProps} from './main';
import {SchedulerForm} from './scheduler_form';
import {CUSTOM, CONTAINER_IMAGES} from '../data';
import {INotebookModel} from '@jupyterlab/notebook';

const CHANGE = 'change';

describe('SchedulerForm', () => {
  const notebookName = 'Test Notebook.ipynb';
  const notebookContents = '{"notebook": "test"}';
  const gcsPath = `gs://prodonjs-kubeflow-dev/notebooks/${notebookName}`;

  const mockUploadNotebook = jest.fn();
  const mockRunNotebook = jest.fn();
  const mockScheduleNotebook = jest.fn();
  const mockGcpService = {
    uploadNotebook: mockUploadNotebook,
    runNotebook: mockRunNotebook,
    scheduleNotebook: mockScheduleNotebook
  } as undefined as GcpService;
  const mockNotebookContents = jest.fn();
  const mockProps: MainProps = {
    gcpService: mockGcpService,
    notebook: {
      toString: mockNotebookContents
    } as unknown as INotebookModel,
    notebookName,
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('Toggles Machine type visibility based on Scale tier', async () => {
    const schedulerForm = shallow(<SchedulerForm {...mockProps} />);
    expect(schedulerForm).toMatchSnapshot('Without MachineTypes');
    schedulerForm.find('SelectInput[label="Scale tier"]')
      .simulate(CHANGE, CUSTOM);

    expect(schedulerForm).toMatchSnapshot('With MachineTypes');
  });

  it('Toggles Schedule visibility based on Frequency', async () => {
    const schedulerForm = shallow(<SchedulerForm {...mockProps} />);
    expect(schedulerForm).toMatchSnapshot('Without Schedule');

    schedulerForm.find('SelectInput[label="Type"]')
      .simulate(CHANGE, 'recurring');
    expect(schedulerForm).toMatchSnapshot('With Schedule');
  });

  it('Submits an immediate job to AI Platform', async () => {
    const uploadNotebookPromise = Promise.resolve();
    const runNotebookPromise = Promise.resolve({jobId: 'aiplatform_job_1'});

    mockNotebookContents.mockReturnValue(notebookContents);
    mockUploadNotebook.mockReturnValue(uploadNotebookPromise);
    mockRunNotebook.mockReturnValue(runNotebookPromise);

    const schedulerForm = shallow(<SchedulerForm {...mockProps} />);
    schedulerForm.find('TextInput[label="Run name"]')
      .simulate(CHANGE, 'test_immediate_job');
    schedulerForm.find('SubmitButton').simulate('click');
    expect(schedulerForm
      .contains(<p>Uploading {notebookName} to {gcsPath}</p>)).toBe(true);

    await uploadNotebookPromise;

    expect(schedulerForm
      .contains(<p>Submitting Job to AI Platform</p>)).toBe(true);
    await runNotebookPromise;

    expect(schedulerForm
      .contains(<p>Successfully created aiplatform_job_1</p>)).toBe(true);
    expect(mockGcpService.uploadNotebook)
      .toHaveBeenCalledWith(notebookContents, gcsPath);
    const aiPlatformRequest: RunNotebookRequest = {
      jobId: 'test_immediate_job',
      imageUri: 'gcr.io/deeplearning-platform-release/base-cpu:latest',
      inputNotebookGcsPath: gcsPath,
      masterType: undefined,
      outputNotebookGcsPath: `${gcsPath}__out.ipynb`,
      scaleTier: 'BASIC',
      region: 'us-central1',
    };
    expect(mockGcpService.runNotebook).toHaveBeenCalledWith(aiPlatformRequest);
  });

  it('Submits a scheduled job to Cloud Scheduler', async () => {
    const uploadNotebookPromise = Promise.resolve();
    const scheduleNotebookPromise = Promise.resolve(
      {name: 'cloudscheduler_job_1'});

    mockNotebookContents.mockReturnValue(notebookContents);
    mockUploadNotebook.mockReturnValue(uploadNotebookPromise);
    mockScheduleNotebook.mockReturnValue(scheduleNotebookPromise);

    const schedulerForm = shallow(<SchedulerForm {...mockProps} />);
    schedulerForm.find('TextInput[label="Run name"]')
      .simulate(CHANGE, 'test_scheduled_job');
    schedulerForm.find('SelectInput[label="Region"]')
      .simulate(CHANGE, 'us-east1');
    schedulerForm.find('SelectInput[label="Scale tier"]')
      .simulate(CHANGE, CUSTOM);
    schedulerForm.find('SelectInput[label="Machine type"]')
      .simulate(CHANGE, 'complex_model_m_gpu');
    schedulerForm.find('SelectInput[label="Container"]')
      .simulate(CHANGE, CONTAINER_IMAGES[2].value);
    schedulerForm.find('SelectInput[label="Type"]')
      .simulate(CHANGE, 'recurring');
    schedulerForm.find('TextInput[label="Frequency"]')
      .simulate(CHANGE, '0 0 * * *');
    schedulerForm.find('SubmitButton').simulate('click');

    await uploadNotebookPromise;
    await scheduleNotebookPromise;

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
      'https://us-central1-prodonjs-kubeflow-dev.cloudfunctions.net/submitScheduledNotebook',
      'prodonjs-kubeflow-dev@appspot.gserviceaccount.com', '0 0 * * *');
  });
});
