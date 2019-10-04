/** Helpers for UI selections */
const GCR_PREFIX = 'gcr.io/deeplearning-platform-release';

/** Custom ScaleTier allows selection of AI Platform Machine type */
export const CUSTOM = 'CUSTOM';

/** Indicates a single Notebook run */
export const SINGLE = 'single';
/** Indiactes a recurring scheduled Notebook run */
export const RECURRING = 'recurring';

/** Interface for an <option> inside a <select> */
export interface Option {
  text: string;
  value: string | number;
  disabled?: boolean;
}

/** Returns an option whose value matches the given value. */
export function findOptionByValue<T extends Option>(
  options: T[],
  value: string | number | undefined
): T | undefined {
  if (value === undefined) return undefined;
  return options.find(option => option.value === value);
}

/**
 * Scale tier values for AI Platform Jobs
 * https://cloud.google.com/ml-engine/reference/rest/v1/projects.jobs#scaletier
 */
export const CONTAINER_IMAGES: Option[] = [
  { value: `${GCR_PREFIX}/base-cpu:latest`, text: 'Python' },
  {
    value: `${GCR_PREFIX}/tf-cpu.1-14:latest`,
    text: 'TensorFlow 1.14 (CPU only)',
  },
  { value: `${GCR_PREFIX}/tf-gpu.1-14:latest`, text: 'TensorFlow 1.14 (GPU)' },
  {
    value: `${GCR_PREFIX}/tf2-cpu.2-0:latest`,
    text: 'TensorFlow 2.0 (CPU only)',
  },
  { value: `${GCR_PREFIX}/tf2-gpu.2-0:latest`, text: 'TensorFlow 2.0 (GPU)' },
  {
    value: `${GCR_PREFIX}/pytorch-cpu.1-2:latest`,
    text: 'PyTorch 1.2 (CPU only)',
  },
  { value: `${GCR_PREFIX}/pytorch-gpu.1-2:latest`, text: 'PyTorch 1.2 (GPU)' },
  {
    value: `${GCR_PREFIX}/r-cpu.3-6:latest`,
    text: 'R 3.6 (with r-essentials)',
  },
];

/**
 * Scale tier values for AI Platform Jobs
 * https://cloud.google.com/ml-engine/reference/rest/v1/projects.jobs#scaletier
 */
export const SCALE_TIERS: Option[] = [
  { value: 'BASIC', text: 'Single worker instance' },
  {
    value: 'STANDARD_1',
    text: 'Many worker instances and a few parameter servers',
  },
  {
    value: 'PREMIUM_1',
    text: 'A large number of workers with many parameter servers',
  },
  { value: 'BASIC_GPU', text: 'A single worker instance with a GPU' },
  { value: 'BASIC_TPU', text: 'A single worker instance with a Cloud TPU' },
  { value: CUSTOM, text: 'Custom machine type configuration' },
];

/**
 * AI Platform Machine types.
 * https://cloud.google.com/ml-engine/docs/machine-types#compare-machine-types
 */
export const MASTER_TYPES: Option[] = [
  { value: 'standard', text: '4 CPUs, 15 GB RAM, No Accelerators' },
  { value: 'large_model', text: '8 CPUs, 52 GB RAM, No Accelerators' },
  { value: 'complex_model_s', text: '8 CPUs, 7.2 GB RAM, No Accelerators' },
  { value: 'complex_model_m', text: '16 CPUs, 14.4 GB RAM, No Accelerators' },
  { value: 'complex_model_l', text: '32 CPUs, 28.8 GB RAM, No Accelerators' },
  { value: 'standard_gpu', text: '8 CPUs, 30 GB RAM, 1 NVIDIA Tesla K80 GPU' },
  {
    value: 'complex_model_m_gpu',
    text: '4 CPUs, 15 GB RAM, 4 NVIDIA Tesla K80 GPUs',
  },
  {
    value: 'complex_model_l_gpu',
    text: '4 CPUs, 15 GB RAM, 8 NVIDIA Tesla K80 GPUs',
  },
  {
    value: 'standard_p100',
    text: '8 CPUs, 30 GB RAM, 1 NVIDIA Tesla P100 GPU',
  },
  {
    value: 'complex_model_m_p100',
    text: '4 CPUs, 15 GB RAM, 4 NVIDIA Tesla K80 GPUs',
  },
  {
    value: 'complex_model_l_gpu',
    text: '4 CPUs, 15 GB RAM, 8 NVIDIA Tesla K80 GPUs',
  },
  { value: 'cloud_tpu', text: '8 TPU cores' },
];

/**
 * Supported AI Platform regions.
 * https://cloud.google.com/ml-engine/docs/regions
 * TODO: It may be more sensible to invoke the projects.locations.list API
 * and filter for locations with TRAINING capability
 * https://cloud.google.com/ml-engine/reference/rest/v1/projects.locations/list
 */
export const REGIONS: Option[] = [
  {
    value: 'us-central1',
    text: 'us-central1 (Iowa)',
  },
  {
    value: 'us-east1',
    text: 'us-east1 (South Carolina)',
  },
  {
    value: 'us-west1',
    text: 'us-west1 (Oregon)',
  },
  {
    value: 'asia-east1',
    text: 'asia-east1 (Taiwan)',
  },
  {
    value: 'europe-west1',
    text: 'europe-west1 (Belgium)',
  },
  {
    value: 'europe-west4',
    text: 'europe-west4 (Netherlands)',
  },
  {
    value: 'asia-east1',
    text: 'asia-east1 (Taiwan)',
  },
  {
    value: 'asia-southeast1',
    text: 'asia-southeast1 (Singapore)',
  },
];

/**
 * Supported AppEngine locations, which dictate the endpoint for Cloud Scheduler
 * https://cloud.google.com/appengine/docs/locations
 * Because we deploy the Cloud Function to the same region, this is actually
 * an intersection of the above list and the one at
 * https://cloud.google.com/functions/docs/locations
 */
export const APPENGINE_REGIONS: Option[] = [
  {
    value: 'us-central1',
    text: 'us-central1 (Iowa)',
  },
  {
    value: 'us-east1',
    text: 'us-east1 (South Carolina)',
  },
  {
    value: 'us-east4',
    text: 'us-east4 (Northern Virginia)',
  },
  {
    value: 'asia-east2',
    text: 'asia-east2 (Hong Kong)',
  },
  {
    value: 'asia-northeast1',
    text: 'asia-northeast1 (Tokyo)',
  },
  {
    value: 'europe-west1',
    text: 'europe-west1 (Belgium)',
  },
  {
    value: 'europe-west2',
    text: 'europe-west2 (London)',
  },
];

/** Single execution or recurring schedule */
export const SCHEDULE_TYPES: Option[] = [
  { value: SINGLE, text: 'Single run' },
  { value: RECURRING, text: 'Recurring run' },
];
