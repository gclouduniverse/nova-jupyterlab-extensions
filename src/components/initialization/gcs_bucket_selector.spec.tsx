import * as React from 'react';
import { shallow } from 'enzyme';

import { GcsBucketSelector } from './gcs_bucket_selector';
import { GcpService } from '../../service/gcp';

describe('GcsBucketSelector', () => {
  const mockOnSelected = jest.fn();
  const mockDialogClose = jest.fn();
  const mockCreateBucket = jest.fn();
  const mockGcpService = ({
    createBucket: mockCreateBucket,
  } as undefined) as GcpService;
  const buckets: string[] = [];
  const mockProps = {
    buckets: buckets,
    gcpService: mockGcpService,
    onDialogClose: mockDialogClose,
    onSelected: mockOnSelected,
  };

  beforeEach(() => {
    jest.resetAllMocks();
    mockProps.buckets = [];
  });

  it('Selects an existing bucket', () => {
    mockProps.buckets.push('gs://bucket1');
    const selector = shallow(<GcsBucketSelector {...mockProps} />);
    expect(selector.exists('TextInput')).toBe(false);
    expect(selector.find('SubmitButton').prop('text')).toBe('Select');
    selector.find('SubmitButton').simulate('click');

    expect(mockOnSelected).toHaveBeenCalledWith('gs://bucket1');
  });

  it('Creates and selects a new Bucket', async () => {
    mockCreateBucket.mockResolvedValue({
      name: 'new-bucket',
    });

    const selector = shallow(<GcsBucketSelector {...mockProps} />);
    selector
      .find('SelectInput')
      .simulate('change', { target: { value: '__new__' } });
    selector
      .find('TextInput')
      .simulate('change', { target: { value: 'gs://new-bucket' } });

    expect(selector.find('SubmitButton').prop('text')).toBe('Create');
    selector.find('SubmitButton').simulate('click');

    expect(selector.find('SubmitButton').prop('actionPending')).toBe(true);
    expect(selector.find('Message').props()).toMatchObject({
      asActivity: true,
      asError: false,
      text: 'Creating Cloud Storage bucket gs://new-bucket...',
    });

    await new Promise(r => setTimeout(r));

    expect(selector.find('SubmitButton').prop('actionPending')).toBe(false);
    expect(selector.find('Message').props()).toMatchObject({
      asActivity: false,
      asError: false,
      text: 'Successfully created Cloud Storage bucket gs://new-bucket',
    });
    expect(mockCreateBucket).toHaveBeenCalledWith('new-bucket');
    expect(mockOnSelected).toHaveBeenCalledWith('gs://new-bucket');
  });

  it('Shows an error if Bucket cannot be created', async () => {
    const createPromise = Promise.reject('error-occurred');
    mockCreateBucket.mockReturnValue(createPromise);

    const selector = shallow(<GcsBucketSelector {...mockProps} />);
    selector
      .find('SelectInput')
      .simulate('change', { target: { value: '__new__' } });
    selector
      .find('TextInput')
      .simulate('change', { target: { value: 'gs://new-bucket' } });

    expect(selector.find('SubmitButton').prop('text')).toBe('Create');
    selector.find('SubmitButton').simulate('click');

    await new Promise(r => setTimeout(r));

    expect(selector.find('SubmitButton').prop('actionPending')).toBe(false);
    expect(selector.find('Message').props()).toMatchObject({
      asActivity: false,
      asError: true,
      text:
        'error-occurred: Unable to create Cloud Storage bucket gs://new-bucket',
    });
    expect(mockCreateBucket).toHaveBeenCalledWith('new-bucket');
    expect(mockOnSelected).not.toHaveBeenCalled();
  });

  it('Shows an error if Bucket name fails validation', async () => {
    // TODO: Possibly replace with Formik
    const selector = shallow(<GcsBucketSelector {...mockProps} />);
    selector
      .find('SelectInput')
      .simulate('change', { target: { value: '__new__' } });
    selector
      .find('TextInput')
      .simulate('change', { target: { value: 'new-bucket' } });

    expect(selector.find('SubmitButton').prop('text')).toBe('Create');
    selector.find('SubmitButton').simulate('click');

    await new Promise(r => setTimeout(r));

    expect(selector.find('SubmitButton').prop('actionPending')).toBe(false);
    expect(selector.find('Message').props()).toMatchObject({
      asActivity: false,
      asError: true,
      text: 'Please provide a valid bucket name starting with gs://',
    });
    expect(mockCreateBucket).not.toHaveBeenCalled();
    expect(mockOnSelected).not.toHaveBeenCalled();
  });
});
