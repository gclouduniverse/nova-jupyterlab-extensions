import * as React from 'react';
import { shallow } from 'enzyme';

import { CloudFunctionDeployer } from './cloud_function_deployer';
import { GcpService } from '../../service/gcp';

describe('CloudFunctionDeployer', () => {
  const mockOnCreated = jest.fn();
  const mockDialogClose = jest.fn();
  const mockCreateCloudFunction = jest.fn();
  const mockGcpService = ({
    createCloudFunction: mockCreateCloudFunction,
  } as undefined) as GcpService;
  const mockProps = {
    gcpService: mockGcpService,
    onDialogClose: mockDialogClose,
    onCreated: mockOnCreated,
    region: 'us-central1',
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('Creates CloudFunction', async () => {
    const createPromise = Promise.resolve({
      name: 'functions/details/us-central1/submitScheduledNotebook',
    });
    mockCreateCloudFunction.mockReturnValue(createPromise);

    const deployer = shallow(<CloudFunctionDeployer {...mockProps} />);
    deployer.find('SubmitButton').simulate('click');

    expect(deployer.find('SubmitButton').prop('actionPending')).toBe(true);
    expect(deployer.find('Message').props()).toMatchObject({
      asActivity: true,
      asError: false,
      text:
        'Deploying Cloud Function in us-central1. This may take a few minutes...',
    });

    await createPromise;
    expect(deployer.find('SubmitButton').prop('actionPending')).toBe(false);
    expect(deployer.find('Message').props()).toMatchObject({
      asActivity: false,
      asError: false,
      text: 'Successfully created Cloud Function in us-central1',
    });
    expect(mockOnCreated).toHaveBeenCalled();
  });

  it('Shows an error if AppEngine app cannot be created', async () => {
    const createPromise = Promise.reject('error-occurred');
    mockCreateCloudFunction.mockReturnValue(createPromise);

    const deployer = shallow(<CloudFunctionDeployer {...mockProps} />);
    deployer.find('SubmitButton').simulate('click');

    expect.assertions(3);
    try {
      await createPromise;
    } catch (_) {
      expect(deployer.find('SubmitButton').prop('actionPending')).toBe(false);
      expect(deployer.find('Message').props()).toMatchObject({
        asActivity: false,
        asError: true,
        text: 'Unable to create Cloud Function in us-central1',
      });
      expect(mockOnCreated).not.toHaveBeenCalled();
    }
  });
});
