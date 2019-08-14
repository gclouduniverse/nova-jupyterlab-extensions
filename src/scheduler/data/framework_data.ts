import {Option} from './option';

export interface Framework extends Option {
  name: string;
  /**
   * Prefix is used for looking up the framework type with metadata returned by
   * API.
   */
  prefix: string;
  tier: number;
  description: string;
  /**
   * Image's hardware dependency.
   *
   * At most one of the following fields may appear in the framework.
   * An empty string ('') means 'None' GPU type.
   */
  /** If defined, this will include the list GPU types */
  allowedGpus?: string[];
  /** If defined, this will exclude the list of GPU types */
  disallowedGpus?: string[];
  /* The user custom container url. */
  customContainer?: string;
}

/** Supported frameworks. */
export const FRAMEWORKS: Framework[] = [
  {
    name: 'Custom container',
    text: 'Custom container',
    prefix: 'Container',
    tier: 0,
    description: 'Custom container',
    value:
        'projects/deeplearning-platform-release/global/images/family/common-container',
  },
  {
    name: 'TensorFlow 1.14',
    text: 'TensorFlow 1.14 (with Intel® MKL-DNN/MKL and CUDA 10.0)',
    prefix: 'TensorFlow:1',
    tier: 2,
    description: 'TensorFlow 1.14 pre-installed with support for Keras',
    value:
        'projects/deeplearning-platform-release/global/images/family/tf-1-13-cu100-notebooks',
  },
  {
    name: 'TensorFlow 2.0 [EXPERIMENTAL]',
    text:
        'TensorFlow 2.0 (with Intel® MKL-DNN/MKL and CUDA 10.0) [EXPERIMENTAL]',
    prefix: 'TensorFlow:2',
    tier: 2,
    description: 'TensorFlow 2.0 pre-installed with support for Keras',
    value:
        'projects/deeplearning-platform-release/global/images/family/tf-2-0-cu100-experimental-notebooks',
  },
  {
    name: 'Pytorch 1.1',
    text: 'PyTorch 1.1 (with Intel® MKL-DNN/MKL and CUDA 10.0)',
    prefix: 'PyTorch',
    tier: 2,
    description: 'PyTorch 1.1 pre-installed',
    value:
        'projects/deeplearning-platform-release/global/images/family/pytorch-1-1-cu100-notebooks',
  },
  {
    name: 'RAPIDS XGboost [EXPERIMENTAL]',
    text:
        'RAPIDS XGboost (with Intel® MKL-DNN/MKL and CUDA 10.0) [EXPERIMENTAL]',
    prefix: 'RAPIDS',
    tier: 2,
    description: 'XGboost optimized for NVIDIA GPUs',
    value:
        'projects/deeplearning-platform-release/global/images/family/rapids-0-7-gpu-experimental-notebooks',
    disallowedGpus: ['', 'nvidia-tesla-k80'],
  },
  {
    name: 'R 3.6',
    text: 'R 3.6 (with r-essentials)',
    prefix: 'R:3',
    tier: 1,
    description: 'R 3.6 and key libraries pre-installed',
    value:
        'projects/deeplearning-platform-release/global/images/family/r-3-6-cpu-experimental-notebooks',
    allowedGpus: [''],
  },
  {
    name: 'Python',
    text: 'Intel® optimized Base (with Intel® MKL)',
    prefix: 'TODO',
    tier: 1,
    description:
        'Python 2 and 3 with Pandas, SciKit Learn and other key packages pre-installed',
    value:
        'projects/deeplearning-platform-release/global/images/family/common-cpu-notebooks',
    allowedGpus: [''],
  },
  {
    name: 'CUDA 10.1',
    text: 'Intel® optimized Base (with Intel® MKL and CUDA 10.1)',
    prefix: 'TODO',
    tier: 2,
    description: 'Optimized for NVIDIA GPUs',
    value:
        'projects/deeplearning-platform-release/global/images/family/common-cu101-notebooks',
  },
  {
    name: 'CUDA 10.0',
    text: 'Intel® optimized Base (with Intel® MKL and CUDA 10.0)',
    prefix: 'TODO',
    tier: 0,
    description: 'Optimized for NVIDIA GPUs',
    value:
        'projects/deeplearning-platform-release/global/images/family/common-cu100-notebooks',
  },
  {
    name: 'CUDA 9.2',
    text: 'Intel® optimized Base (with Intel® MKL and CUDA 9.2)',
    prefix: 'None',
    tier: 0,
    description: '',
    value:
        'projects/deeplearning-platform-release/global/images/family/common-cu92-notebooks',
  },
  {
    name: 'CUDA 9.1',
    text: 'Intel® optimized Base (with Intel® MKL and CUDA 9.1)',
    prefix: 'None',
    tier: 0,
    description: '',
    value:
        'projects/deeplearning-platform-release/global/images/family/common-cu91-notebooks',
  },
  {
    name: 'CUDA 9.0',
    text: 'Intel® optimized Base (with Intel® MKL and CUDA 9.0)',
    prefix: 'None',
    tier: 0,
    description: '',
    value:
        'projects/deeplearning-platform-release/global/images/family/common-cu90-notebooks',
  },
];
