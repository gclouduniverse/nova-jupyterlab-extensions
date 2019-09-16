import * as React from 'react';
import { shallow } from 'enzyme';

import { ServiceEnabler } from './service_enabler';
import { GcpService, ProjectState } from '../../service/gcp';

describe('ServiceEnabler', () => {
  const mockOnStateChange = jest.fn();
  const mockDialogClose = jest.fn();
  const mockEnableServices = jest.fn();
  const projectState: ProjectState = {
    allServicesEnabled: false,
    hasCloudFunction: false,
    gcsBuckets: [],
    projectId: 'test-project',
    schedulerRegion: '',
    serviceStatuses: [
      {
        enabled: true,
        service: {
          name: 'Cloud Storage API',
          endpoint: 'storage-api.googleapis.com',
          documentation: 'https://cloud.google.com/storage/',
        },
      },
      {
        enabled: false,
        service: {
          name: 'Cloud Scheduler API',
          endpoint: 'cloudscheduler.googleapis.com',
          documentation: 'https://cloud.google.com/scheduler',
        },
      },
      {
        enabled: false,
        service: {
          name: 'AI Platform Training API',
          endpoint: 'ml.googleapis.com',
          documentation: 'https://cloud.google.com/ai-platform/',
        },
      },
      {
        enabled: false,
        service: {
          name: 'Cloud Functions API',
          endpoint: 'cloudfunctions.googleapis.com',
          documentation: 'https://cloud.google.com/functions/',
        },
      },
    ],
  };

  const mockGcpService = ({
    enableServices: mockEnableServices,
  } as undefined) as GcpService;
  const mockProps = {
    gcpService: mockGcpService,
    onDialogClose: mockDialogClose,
    onStateChange: mockOnStateChange,
    projectState,
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('Enables services', async () => {
    const createPromise = Promise.resolve([]);
    mockEnableServices.mockReturnValue(createPromise);

    const enabler = shallow(<ServiceEnabler {...mockProps} />);
    enabler.find('SubmitButton').simulate('click');

    expect(enabler.find('SubmitButton').prop('actionPending')).toBe(true);
    expect(enabler.find('Message').props()).toMatchObject({
      asActivity: true,
      asError: false,
      text: 'Enabling all necessary APIs. This may take a few minutes...',
    });

    await createPromise;
    expect(enabler.find('SubmitButton').prop('actionPending')).toBe(false);
    expect(enabler.find('Message').props()).toMatchObject({
      asActivity: false,
      asError: false,
      text: 'All services enabled',
    });
    expect(mockOnStateChange).toHaveBeenCalled();
  });

  it('Shows an error if services cannot be enabled', async () => {
    const createPromise = Promise.reject('error-occurred');
    mockEnableServices.mockReturnValue(createPromise);

    const enabler = shallow(<ServiceEnabler {...mockProps} />);
    enabler.find('SubmitButton').simulate('click');

    expect.assertions(3);
    try {
      await createPromise;
    } catch (_) {
      expect(enabler.find('SubmitButton').prop('actionPending')).toBe(false);
      expect(enabler.find('Message').props()).toMatchObject({
        asActivity: false,
        asError: true,
        text: 'Unable to enable necessary GCP APIs',
      });
      expect(mockOnStateChange).not.toHaveBeenCalled();
    }
  });
});
