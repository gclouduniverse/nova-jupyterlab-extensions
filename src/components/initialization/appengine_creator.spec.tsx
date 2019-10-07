import * as React from 'react';
import { shallow } from 'enzyme';

import { AppEngineCreator } from './appengine_creator';
import { GcpService } from '../../service/gcp';
import { APPENGINE_REGIONS } from '../../data';

describe('AppEngineCreator', () => {
  const mockOnStateChange = jest.fn();
  const mockDialogClose = jest.fn();
  const mockCreateAppEngineApp = jest.fn();
  const mockGcpService = ({
    createAppEngineApp: mockCreateAppEngineApp,
  } as undefined) as GcpService;
  const mockProps = {
    gcpService: mockGcpService,
    onDialogClose: mockDialogClose,
    onStateChange: mockOnStateChange,
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('Creates AppEngine app with selected region', async () => {
    const createPromise = Promise.resolve({
      id: 'test-app',
      locationId: 'us-east1',
    });
    mockCreateAppEngineApp.mockReturnValue(createPromise);

    const creator = shallow(<AppEngineCreator {...mockProps} />);
    creator
      .find('SelectInput')
      .simulate('change', { target: { value: APPENGINE_REGIONS[1].value } });
    creator.find('SubmitButton').simulate('click');

    expect(creator.find('SubmitButton').prop('actionPending')).toBe(true);
    expect(creator.find('Message').props()).toMatchObject({
      asActivity: true,
      asError: false,
      text: 'Please wait while we create an App Engine app in us-east1...',
    });

    await createPromise;
    expect(creator.find('SubmitButton').prop('actionPending')).toBe(false);
    expect(creator.find('Message').props()).toMatchObject({
      asActivity: false,
      asError: false,
      text: 'Successfully created App Engine app in us-east1',
    });
    expect(mockOnStateChange).toHaveBeenCalled();
  });

  it('Shows an error if AppEngine app cannot be created', async () => {
    const createPromise = Promise.reject('error-occurred');
    mockCreateAppEngineApp.mockReturnValue(createPromise);

    const creator = shallow(<AppEngineCreator {...mockProps} />);
    creator
      .find('SelectInput')
      .simulate('change', { target: { value: APPENGINE_REGIONS[1].value } });
    creator.find('SubmitButton').simulate('click');

    expect.assertions(3);
    try {
      await createPromise;
    } catch (_) {
      expect(creator.find('SubmitButton').prop('actionPending')).toBe(false);
      expect(creator.find('Message').props()).toMatchObject({
        asActivity: false,
        asError: true,
        text: 'error-occurred: Unable to create App Engine app in us-east1',
      });
      expect(mockOnStateChange).not.toHaveBeenCalled();
    }
  });
});
