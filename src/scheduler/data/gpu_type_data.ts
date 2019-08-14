// import {Framework} from './framework_data';
import {Framework} from './framework_data';
import {MachineType} from './machine_type_data';
import {Option} from './option';

/** Interface used in UI to represent GPU type. */
export interface GpuType extends Option {}

/** None gpu type. */
const NONE_GPU_TYPE: GpuType = {
  value: '',
  text: 'None',
};

type DeprecationStatusState = 'ACTIVE'|'DELETED'|'DEPRECATED'|'OBSOLETE';

interface DeprecationStatus {
  deleted?: string;
  deprecated?: string;
  obsolete?: string;
  replacement?: string;
  state?: DeprecationStatusState;
}

interface AcceleratorType {
  creationTimestamp?: string;
  deprecated?: DeprecationStatus;
  description?: string;
  id?: string;
  kind?: string;
  maximumCardsPerInstance?: number;
  name?: string;
  selfLink?: string;
  zone?: string;
}

/** Interface used in UI to represent a GPU's type, counts, and price. */
export interface GpuData {
  type: GpuType;
  counts: Option[];
}

/** A CPU and memory configuration. */
interface CpuMemoryConfig {
  cpuCount: number;
  memoryGb: number;
}

/**
 * Hardware constraint.
 * The key is GPU card type.
 * The values are the maxium supported CPU memory configuration for each tier of
 * gpuCount (i.e, 1, 2, 4, 8, ...)
 * Refer to https://cloud.google.com/compute/docs/gpus/
 */
const HARDWARE_CONSTRAINT: {[key: string]: CpuMemoryConfig[]} = {
  'nvidia-tesla-v100': [
    {cpuCount: 12, memoryGb: 78},
    {cpuCount: 24, memoryGb: 156},
    {cpuCount: 48, memoryGb: 312},
    {cpuCount: 96, memoryGb: 624},
  ],
  'nvidia-tesla-p100': [
    {cpuCount: 16, memoryGb: 104},
    {cpuCount: 32, memoryGb: 208},
    {cpuCount: 64, memoryGb: 208},
  ],
  'nvidia-tesla-p4': [
    {cpuCount: 24, memoryGb: 156},
    {cpuCount: 48, memoryGb: 312},
    {cpuCount: 96, memoryGb: 624},
  ],
  'nvidia-tesla-k80': [
    {cpuCount: 8, memoryGb: 52},
    {cpuCount: 16, memoryGb: 104},
    {cpuCount: 32, memoryGb: 208},
    {cpuCount: 64, memoryGb: 208},
  ],
  'nvidia-tesla-p4-vws': [
    {cpuCount: 16, memoryGb: 192},
    {cpuCount: 48, memoryGb: 312},
    {cpuCount: 96, memoryGb: 624},
  ],
  'nvidia-tesla-p100-vws': [
    {cpuCount: 16, memoryGb: 104},
    {cpuCount: 32, memoryGb: 208},
    {cpuCount: 64, memoryGb: 208},
  ],
  'nvidia-tesla-t4': [
    {cpuCount: 24, memoryGb: 156},
    {cpuCount: 48, memoryGb: 312},
    {cpuCount: 96, memoryGb: 624},
  ],
  'nvidia-tesla-t4-vws': [
    {cpuCount: 24, memoryGb: 156},
    {cpuCount: 48, memoryGb: 312},
    {cpuCount: 96, memoryGb: 624},
  ],
};

// /** Returns gpu data for the given machine and gpu configurations. */
function getGpuData(machineType: MachineType, gpuType: GpuType): GpuData {
  const gpuData: GpuData = {
    type: gpuType,
    counts: [],
  };
  if (HARDWARE_CONSTRAINT[gpuType.value]) {
    const cpuMemoryConfigs = HARDWARE_CONSTRAINT[gpuType.value];
    for (let i = 0, count = 1; i < cpuMemoryConfigs.length; ++i, count *= 2) {
      if (machineType.cpuCount <= cpuMemoryConfigs[i].cpuCount &&
          machineType.memoryMb <= cpuMemoryConfigs[i].memoryGb * 1024) {
        gpuData.counts.push({text: `${count}`, value: count});
      }
    }
  }
  return gpuData;
}

/** Returns a list of gpu data for the given machine and gpu types. */
export function getGpuDataList(
    machineType: MachineType, gpuTypes: GpuType[],
    framework?: Framework): GpuData[] {
  const gpuDataList: GpuData[] = [];
  for (const gpuType of gpuTypes) {
    if (framework && framework.allowedGpus &&
        !framework.allowedGpus.includes(gpuType.value as string)) {
      continue;
    }
    if (framework && framework.disallowedGpus &&
        framework.disallowedGpus.includes(gpuType.value as string)) {
      continue;
    }
    const data = getGpuData(machineType, gpuType);
    if (data.counts.length || !data.type.value) {
      gpuDataList.push(data);
    }
  }
  return gpuDataList;
}

export function getGpuTypeOptions(
    machineType: string, zone: string): GpuType[] {
  const items: {[key: string]: any} = GPU_TYPE.items;
  const targetZone = 'zones/' + zone;

  if (!(items[targetZone] && items[targetZone]['acceleratorTypes'])) {
    return [];
  }

  // TODO filter gpu type based on framework
  return [NONE_GPU_TYPE].concat(items[targetZone]['acceleratorTypes'].map(
      (accelerator: AcceleratorType) => {
        const gpuType: GpuType = {
          text: accelerator.description,
          value: accelerator.name,
        };
        return gpuType;
      }));
}

const GPU_TYPE = {
  'id': 'projects/weiting-dev/aggregated/acceleratorTypes',
  'items':
      {
        'zones/us-central1-a': {
          'acceleratorTypes': [
            {
              'id': '10002',
              'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
              'name': 'nvidia-tesla-k80',
              'description': 'NVIDIA Tesla K80',
              'zone':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-a',
              'selfLink':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-a/acceleratorTypes/nvidia-tesla-k80',
              'maximumCardsPerInstance': 8,
              'kind': 'compute#acceleratorType'
            },
            {
              'id': '10010',
              'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
              'name': 'nvidia-tesla-p4',
              'description': 'NVIDIA Tesla P4',
              'zone':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-a',
              'selfLink':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-a/acceleratorTypes/nvidia-tesla-p4',
              'maximumCardsPerInstance': 4,
              'kind': 'compute#acceleratorType'
            },
            {
              'id': '10012',
              'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
              'name': 'nvidia-tesla-p4-vws',
              'description': 'NVIDIA Tesla P4 Virtual Workstation',
              'zone':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-a',
              'selfLink':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-a/acceleratorTypes/nvidia-tesla-p4-vws',
              'maximumCardsPerInstance': 4,
              'kind': 'compute#acceleratorType'
            },
            {
              'id': '10019',
              'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
              'name': 'nvidia-tesla-t4',
              'description': 'NVIDIA Tesla T4',
              'zone':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-a',
              'selfLink':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-a/acceleratorTypes/nvidia-tesla-t4',
              'maximumCardsPerInstance': 4,
              'kind': 'compute#acceleratorType'
            },
            {
              'id': '10020',
              'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
              'name': 'nvidia-tesla-t4-vws',
              'description': 'NVIDIA Tesla T4 Virtual Workstation',
              'zone':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-a',
              'selfLink':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-a/acceleratorTypes/nvidia-tesla-t4-vws',
              'maximumCardsPerInstance': 4,
              'kind': 'compute#acceleratorType'
            },
            {
              'id': '10008',
              'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
              'name': 'nvidia-tesla-v100',
              'description': 'NVIDIA Tesla V100',
              'zone':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-a',
              'selfLink':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-a/acceleratorTypes/nvidia-tesla-v100',
              'maximumCardsPerInstance': 8,
              'kind': 'compute#acceleratorType'
            }
          ]
        },
        'zones/us-central1-b': {
          'acceleratorTypes': [
            {
              'id': '10019',
              'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
              'name': 'nvidia-tesla-t4',
              'description': 'NVIDIA Tesla T4',
              'zone':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-b',
              'selfLink':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-b/acceleratorTypes/nvidia-tesla-t4',
              'maximumCardsPerInstance': 4,
              'kind': 'compute#acceleratorType'
            },
            {
              'id': '10020',
              'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
              'name': 'nvidia-tesla-t4-vws',
              'description': 'NVIDIA Tesla T4 Virtual Workstation',
              'zone':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-b',
              'selfLink':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-b/acceleratorTypes/nvidia-tesla-t4-vws',
              'maximumCardsPerInstance': 4,
              'kind': 'compute#acceleratorType'
            },
            {
              'id': '10008',
              'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
              'name': 'nvidia-tesla-v100',
              'description': 'NVIDIA Tesla V100',
              'zone':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-b',
              'selfLink':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-b/acceleratorTypes/nvidia-tesla-v100',
              'maximumCardsPerInstance': 8,
              'kind': 'compute#acceleratorType'
            }
          ]
        },
        'zones/us-central1-c': {
          'acceleratorTypes': [
            {
              'id': '10002',
              'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
              'name': 'nvidia-tesla-k80',
              'description': 'NVIDIA Tesla K80',
              'zone':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-c',
              'selfLink':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-c/acceleratorTypes/nvidia-tesla-k80',
              'maximumCardsPerInstance': 8,
              'kind': 'compute#acceleratorType'
            },
            {
              'id': '10004',
              'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
              'name': 'nvidia-tesla-p100',
              'description': 'NVIDIA Tesla P100',
              'zone':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-c',
              'selfLink':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-c/acceleratorTypes/nvidia-tesla-p100',
              'maximumCardsPerInstance': 4,
              'kind': 'compute#acceleratorType'
            },
            {
              'id': '10007',
              'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
              'name': 'nvidia-tesla-p100-vws',
              'description': 'NVIDIA Tesla P100 Virtual Workstation',
              'zone':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-c',
              'selfLink':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-c/acceleratorTypes/nvidia-tesla-p100-vws',
              'maximumCardsPerInstance': 4,
              'kind': 'compute#acceleratorType'
            },
            {
              'id': '10010',
              'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
              'name': 'nvidia-tesla-p4',
              'description': 'NVIDIA Tesla P4',
              'zone':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-c',
              'selfLink':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-c/acceleratorTypes/nvidia-tesla-p4',
              'maximumCardsPerInstance': 4,
              'kind': 'compute#acceleratorType'
            },
            {
              'id': '10012',
              'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
              'name': 'nvidia-tesla-p4-vws',
              'description': 'NVIDIA Tesla P4 Virtual Workstation',
              'zone':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-c',
              'selfLink':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-c/acceleratorTypes/nvidia-tesla-p4-vws',
              'maximumCardsPerInstance': 4,
              'kind': 'compute#acceleratorType'
            },
            {
              'id': '10008',
              'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
              'name': 'nvidia-tesla-v100',
              'description': 'NVIDIA Tesla V100',
              'zone':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-c',
              'selfLink':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-c/acceleratorTypes/nvidia-tesla-v100',
              'maximumCardsPerInstance': 8,
              'kind': 'compute#acceleratorType'
            }
          ]
        },
        'zones/us-central1-f': {
          'acceleratorTypes': [
            {
              'id': '10004',
              'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
              'name': 'nvidia-tesla-p100',
              'description': 'NVIDIA Tesla P100',
              'zone':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-f',
              'selfLink':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-f/acceleratorTypes/nvidia-tesla-p100',
              'maximumCardsPerInstance': 4,
              'kind': 'compute#acceleratorType'
            },
            {
              'id': '10007',
              'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
              'name': 'nvidia-tesla-p100-vws',
              'description': 'NVIDIA Tesla P100 Virtual Workstation',
              'zone':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-f',
              'selfLink':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-f/acceleratorTypes/nvidia-tesla-p100-vws',
              'maximumCardsPerInstance': 4,
              'kind': 'compute#acceleratorType'
            },
            {
              'id': '10008',
              'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
              'name': 'nvidia-tesla-v100',
              'description': 'NVIDIA Tesla V100',
              'zone':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-f',
              'selfLink':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-f/acceleratorTypes/nvidia-tesla-v100',
              'maximumCardsPerInstance': 8,
              'kind': 'compute#acceleratorType'
            }
          ]
        },
        'zones/europe-west1-b': {
          'acceleratorTypes': [
            {
              'id': '10002',
              'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
              'name': 'nvidia-tesla-k80',
              'description': 'NVIDIA Tesla K80',
              'zone':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west1-b',
              'selfLink':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west1-b/acceleratorTypes/nvidia-tesla-k80',
              'maximumCardsPerInstance': 8,
              'kind': 'compute#acceleratorType'
            },
            {
              'id': '10004',
              'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
              'name': 'nvidia-tesla-p100',
              'description': 'NVIDIA Tesla P100',
              'zone':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west1-b',
              'selfLink':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west1-b/acceleratorTypes/nvidia-tesla-p100',
              'maximumCardsPerInstance': 4,
              'kind': 'compute#acceleratorType'
            },
            {
              'id': '10007',
              'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
              'name': 'nvidia-tesla-p100-vws',
              'description': 'NVIDIA Tesla P100 Virtual Workstation',
              'zone':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west1-b',
              'selfLink':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west1-b/acceleratorTypes/nvidia-tesla-p100-vws',
              'maximumCardsPerInstance': 4,
              'kind': 'compute#acceleratorType'
            }
          ]
        },
        'zones/europe-west1-c': {
          'warning': {
            'code': 'NO_RESULTS_ON_PAGE',
            'message':
                'There are no results for scope \'zones/europe-west1-c\' on this page.',
            'data': [{'key': 'scope', 'value': 'zones/europe-west1-c'}]
          }
        },
        'zones/europe-west1-d': {
          'acceleratorTypes': [
            {
              'id': '10002',
              'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
              'name': 'nvidia-tesla-k80',
              'description': 'NVIDIA Tesla K80',
              'zone':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west1-d',
              'selfLink':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west1-d/acceleratorTypes/nvidia-tesla-k80',
              'maximumCardsPerInstance': 8,
              'kind': 'compute#acceleratorType'
            },
            {
              'id': '10004',
              'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
              'name': 'nvidia-tesla-p100',
              'description': 'NVIDIA Tesla P100',
              'zone':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west1-d',
              'selfLink':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west1-d/acceleratorTypes/nvidia-tesla-p100',
              'maximumCardsPerInstance': 4,
              'kind': 'compute#acceleratorType'
            },
            {
              'id': '10007',
              'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
              'name': 'nvidia-tesla-p100-vws',
              'description': 'NVIDIA Tesla P100 Virtual Workstation',
              'zone':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west1-d',
              'selfLink':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west1-d/acceleratorTypes/nvidia-tesla-p100-vws',
              'maximumCardsPerInstance': 4,
              'kind': 'compute#acceleratorType'
            }
          ]
        },
        'zones/us-west1-a': {
          'acceleratorTypes': [
            {
              'id': '10004',
              'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
              'name': 'nvidia-tesla-p100',
              'description': 'NVIDIA Tesla P100',
              'zone':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west1-a',
              'selfLink':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west1-a/acceleratorTypes/nvidia-tesla-p100',
              'maximumCardsPerInstance': 4,
              'kind': 'compute#acceleratorType'
            },
            {
              'id': '10007',
              'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
              'name': 'nvidia-tesla-p100-vws',
              'description': 'NVIDIA Tesla P100 Virtual Workstation',
              'zone':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west1-a',
              'selfLink':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west1-a/acceleratorTypes/nvidia-tesla-p100-vws',
              'maximumCardsPerInstance': 4,
              'kind': 'compute#acceleratorType'
            },
            {
              'id': '10019',
              'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
              'name': 'nvidia-tesla-t4',
              'description': 'NVIDIA Tesla T4',
              'zone':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west1-a',
              'selfLink':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west1-a/acceleratorTypes/nvidia-tesla-t4',
              'maximumCardsPerInstance': 4,
              'kind': 'compute#acceleratorType'
            },
            {
              'id': '10020',
              'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
              'name': 'nvidia-tesla-t4-vws',
              'description': 'NVIDIA Tesla T4 Virtual Workstation',
              'zone':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west1-a',
              'selfLink':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west1-a/acceleratorTypes/nvidia-tesla-t4-vws',
              'maximumCardsPerInstance': 4,
              'kind': 'compute#acceleratorType'
            },
            {
              'id': '10008',
              'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
              'name': 'nvidia-tesla-v100',
              'description': 'NVIDIA Tesla V100',
              'zone':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west1-a',
              'selfLink':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west1-a/acceleratorTypes/nvidia-tesla-v100',
              'maximumCardsPerInstance': 8,
              'kind': 'compute#acceleratorType'
            }
          ]
        },
        'zones/us-west1-b':
            {
              'acceleratorTypes':
                  [
                    {
                      'id': '10002',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'nvidia-tesla-k80',
                      'description': 'NVIDIA Tesla K80',
                      'zone':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west1-b',
                      'selfLink': 'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west1-b/acceleratorTypes/nvidia-tesla-k80',
                      'maximumCardsPerInstance': 8,
                      'kind': 'compute#acceleratorType'
                    },
                    {
                      'id': '10004',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'nvidia-tesla-p100',
                      'description': 'NVIDIA Tesla P100',
                      'zone':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west1-b',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west1-b/acceleratorTypes/nvidia-tesla-p100',
                      'maximumCardsPerInstance': 4,
                      'kind': 'compute#acceleratorType'
                    },
                    {
                      'id': '10007',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'nvidia-tesla-p100-vws',
                      'description': 'NVIDIA Tesla P100 Virtual Workstation',
                      'zone':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west1-b',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west1-b/acceleratorTypes/nvidia-tesla-p100-vws',
                      'maximumCardsPerInstance': 4,
                      'kind': 'compute#acceleratorType'
                    },
                    {
                      'id': '10019',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'nvidia-tesla-t4',
                      'description': 'NVIDIA Tesla T4',
                      'zone':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west1-b',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west1-b/acceleratorTypes/nvidia-tesla-t4',
                      'maximumCardsPerInstance': 4,
                      'kind': 'compute#acceleratorType'
                    },
                    {
                      'id': '10020',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'nvidia-tesla-t4-vws',
                      'description': 'NVIDIA Tesla T4 Virtual Workstation',
                      'zone':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west1-b',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west1-b/acceleratorTypes/nvidia-tesla-t4-vws',
                      'maximumCardsPerInstance': 4,
                      'kind': 'compute#acceleratorType'
                    },
                    {
                      'id': '10008',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'nvidia-tesla-v100',
                      'description': 'NVIDIA Tesla V100',
                      'zone':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west1-b',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west1-b/acceleratorTypes/nvidia-tesla-v100',
                      'maximumCardsPerInstance': 8,
                      'kind': 'compute#acceleratorType'
                    }
                  ]
            },
        'zones/us-west1-c': {
          'warning': {
            'code': 'NO_RESULTS_ON_PAGE',
            'message':
                'There are no results for scope \'zones/us-west1-c\' on this page.',
            'data': [{'key': 'scope', 'value': 'zones/us-west1-c'}]
          }
        },
        'zones/asia-east1-a': {
          'acceleratorTypes': [
            {
              'id': '10002',
              'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
              'name': 'nvidia-tesla-k80',
              'description': 'NVIDIA Tesla K80',
              'zone':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/asia-east1-a',
              'selfLink':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/asia-east1-a/acceleratorTypes/nvidia-tesla-k80',
              'maximumCardsPerInstance': 8,
              'kind': 'compute#acceleratorType'
            },
            {
              'id': '10004',
              'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
              'name': 'nvidia-tesla-p100',
              'description': 'NVIDIA Tesla P100',
              'zone':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/asia-east1-a',
              'selfLink':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/asia-east1-a/acceleratorTypes/nvidia-tesla-p100',
              'maximumCardsPerInstance': 4,
              'kind': 'compute#acceleratorType'
            },
            {
              'id': '10007',
              'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
              'name': 'nvidia-tesla-p100-vws',
              'description': 'NVIDIA Tesla P100 Virtual Workstation',
              'zone':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/asia-east1-a',
              'selfLink':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/asia-east1-a/acceleratorTypes/nvidia-tesla-p100-vws',
              'maximumCardsPerInstance': 4,
              'kind': 'compute#acceleratorType'
            }
          ]
        },
        'zones/asia-east1-b': {
          'acceleratorTypes': [{
            'id': '10002',
            'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
            'name': 'nvidia-tesla-k80',
            'description': 'NVIDIA Tesla K80',
            'zone':
                'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/asia-east1-b',
            'selfLink':
                'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/asia-east1-b/acceleratorTypes/nvidia-tesla-k80',
            'maximumCardsPerInstance': 8,
            'kind': 'compute#acceleratorType'
          }]
        },
        'zones/asia-east1-c': {
          'acceleratorTypes': [
            {
              'id': '10004',
              'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
              'name': 'nvidia-tesla-p100',
              'description': 'NVIDIA Tesla P100',
              'zone':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/asia-east1-c',
              'selfLink':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/asia-east1-c/acceleratorTypes/nvidia-tesla-p100',
              'maximumCardsPerInstance': 4,
              'kind': 'compute#acceleratorType'
            },
            {
              'id': '10007',
              'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
              'name': 'nvidia-tesla-p100-vws',
              'description': 'NVIDIA Tesla P100 Virtual Workstation',
              'zone':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/asia-east1-c',
              'selfLink':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/asia-east1-c/acceleratorTypes/nvidia-tesla-p100-vws',
              'maximumCardsPerInstance': 4,
              'kind': 'compute#acceleratorType'
            },
            {
              'id': '10008',
              'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
              'name': 'nvidia-tesla-v100',
              'description': 'NVIDIA Tesla V100',
              'zone':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/asia-east1-c',
              'selfLink':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/asia-east1-c/acceleratorTypes/nvidia-tesla-v100',
              'maximumCardsPerInstance': 8,
              'kind': 'compute#acceleratorType'
            }
          ]
        },
        'zones/us-east1-b': {
          'acceleratorTypes': [
            {
              'id': '10004',
              'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
              'name': 'nvidia-tesla-p100',
              'description': 'NVIDIA Tesla P100',
              'zone':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-east1-b',
              'selfLink':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-east1-b/acceleratorTypes/nvidia-tesla-p100',
              'maximumCardsPerInstance': 4,
              'kind': 'compute#acceleratorType'
            },
            {
              'id': '10007',
              'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
              'name': 'nvidia-tesla-p100-vws',
              'description': 'NVIDIA Tesla P100 Virtual Workstation',
              'zone':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-east1-b',
              'selfLink':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-east1-b/acceleratorTypes/nvidia-tesla-p100-vws',
              'maximumCardsPerInstance': 4,
              'kind': 'compute#acceleratorType'
            }
          ]
        },
        'zones/us-east1-c': {
          'acceleratorTypes': [
            {
              'id': '10002',
              'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
              'name': 'nvidia-tesla-k80',
              'description': 'NVIDIA Tesla K80',
              'zone':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-east1-c',
              'selfLink':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-east1-c/acceleratorTypes/nvidia-tesla-k80',
              'maximumCardsPerInstance': 8,
              'kind': 'compute#acceleratorType'
            },
            {
              'id': '10004',
              'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
              'name': 'nvidia-tesla-p100',
              'description': 'NVIDIA Tesla P100',
              'zone':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-east1-c',
              'selfLink':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-east1-c/acceleratorTypes/nvidia-tesla-p100',
              'maximumCardsPerInstance': 4,
              'kind': 'compute#acceleratorType'
            },
            {
              'id': '10007',
              'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
              'name': 'nvidia-tesla-p100-vws',
              'description': 'NVIDIA Tesla P100 Virtual Workstation',
              'zone':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-east1-c',
              'selfLink':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-east1-c/acceleratorTypes/nvidia-tesla-p100-vws',
              'maximumCardsPerInstance': 4,
              'kind': 'compute#acceleratorType'
            },
            {
              'id': '10019',
              'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
              'name': 'nvidia-tesla-t4',
              'description': 'NVIDIA Tesla T4',
              'zone':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-east1-c',
              'selfLink':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-east1-c/acceleratorTypes/nvidia-tesla-t4',
              'maximumCardsPerInstance': 4,
              'kind': 'compute#acceleratorType'
            },
            {
              'id': '10020',
              'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
              'name': 'nvidia-tesla-t4-vws',
              'description': 'NVIDIA Tesla T4 Virtual Workstation',
              'zone':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-east1-c',
              'selfLink':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-east1-c/acceleratorTypes/nvidia-tesla-t4-vws',
              'maximumCardsPerInstance': 4,
              'kind': 'compute#acceleratorType'
            }
          ]
        },
        'zones/us-east1-d': {
          'acceleratorTypes': [
            {
              'id': '10002',
              'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
              'name': 'nvidia-tesla-k80',
              'description': 'NVIDIA Tesla K80',
              'zone':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-east1-d',
              'selfLink':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-east1-d/acceleratorTypes/nvidia-tesla-k80',
              'maximumCardsPerInstance': 8,
              'kind': 'compute#acceleratorType'
            },
            {
              'id': '10019',
              'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
              'name': 'nvidia-tesla-t4',
              'description': 'NVIDIA Tesla T4',
              'zone':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-east1-d',
              'selfLink':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-east1-d/acceleratorTypes/nvidia-tesla-t4',
              'maximumCardsPerInstance': 4,
              'kind': 'compute#acceleratorType'
            },
            {
              'id': '10020',
              'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
              'name': 'nvidia-tesla-t4-vws',
              'description': 'NVIDIA Tesla T4 Virtual Workstation',
              'zone':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-east1-d',
              'selfLink':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-east1-d/acceleratorTypes/nvidia-tesla-t4-vws',
              'maximumCardsPerInstance': 4,
              'kind': 'compute#acceleratorType'
            }
          ]
        },
        'zones/asia-northeast1-a': {
          'acceleratorTypes': [
            {
              'id': '10019',
              'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
              'name': 'nvidia-tesla-t4',
              'description': 'NVIDIA Tesla T4',
              'zone':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/asia-northeast1-a',
              'selfLink':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/asia-northeast1-a/acceleratorTypes/nvidia-tesla-t4',
              'maximumCardsPerInstance': 4,
              'kind': 'compute#acceleratorType'
            },
            {
              'id': '10020',
              'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
              'name': 'nvidia-tesla-t4-vws',
              'description': 'NVIDIA Tesla T4 Virtual Workstation',
              'zone':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/asia-northeast1-a',
              'selfLink':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/asia-northeast1-a/acceleratorTypes/nvidia-tesla-t4-vws',
              'maximumCardsPerInstance': 4,
              'kind': 'compute#acceleratorType'
            }
          ]
        },
        'zones/asia-northeast1-b': {
          'warning': {
            'code': 'NO_RESULTS_ON_PAGE',
            'message':
                'There are no results for scope \'zones/asia-northeast1-b\' on this page.',
            'data': [{'key': 'scope', 'value': 'zones/asia-northeast1-b'}]
          }
        },
        'zones/asia-northeast1-c': {
          'warning': {
            'code': 'NO_RESULTS_ON_PAGE',
            'message':
                'There are no results for scope \'zones/asia-northeast1-c\' on this page.',
            'data': [{'key': 'scope', 'value': 'zones/asia-northeast1-c'}]
          }
        },
        'zones/asia-southeast1-a': {
          'warning': {
            'code': 'NO_RESULTS_ON_PAGE',
            'message':
                'There are no results for scope \'zones/asia-southeast1-a\' on this page.',
            'data': [{'key': 'scope', 'value': 'zones/asia-southeast1-a'}]
          }
        },
        'zones/asia-southeast1-b':
            {
              'acceleratorTypes': [
                {
                  'id': '10010',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'nvidia-tesla-p4',
                  'description': 'NVIDIA Tesla P4',
                  'zone':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/asia-southeast1-b',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/asia-southeast1-b/acceleratorTypes/nvidia-tesla-p4',
                  'maximumCardsPerInstance': 4,
                  'kind': 'compute#acceleratorType'
                },
                {
                  'id': '10012',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'nvidia-tesla-p4-vws',
                  'description': 'NVIDIA Tesla P4 Virtual Workstation',
                  'zone':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/asia-southeast1-b',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/asia-southeast1-b/acceleratorTypes/nvidia-tesla-p4-vws',
                  'maximumCardsPerInstance': 4,
                  'kind': 'compute#acceleratorType'
                },
                {
                  'id': '10019',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'nvidia-tesla-t4',
                  'description': 'NVIDIA Tesla T4',
                  'zone':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/asia-southeast1-b',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/asia-southeast1-b/acceleratorTypes/nvidia-tesla-t4',
                  'maximumCardsPerInstance': 4,
                  'kind': 'compute#acceleratorType'
                },
                {
                  'id': '10020',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'nvidia-tesla-t4-vws',
                  'description': 'NVIDIA Tesla T4 Virtual Workstation',
                  'zone':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/asia-southeast1-b',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/asia-southeast1-b/acceleratorTypes/nvidia-tesla-t4-vws',
                  'maximumCardsPerInstance': 4,
                  'kind': 'compute#acceleratorType'
                }
              ]
            },
        'zones/asia-southeast1-c': {
          'acceleratorTypes': [
            {
              'id': '10010',
              'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
              'name': 'nvidia-tesla-p4',
              'description': 'NVIDIA Tesla P4',
              'zone':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/asia-southeast1-c',
              'selfLink':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/asia-southeast1-c/acceleratorTypes/nvidia-tesla-p4',
              'maximumCardsPerInstance': 4,
              'kind': 'compute#acceleratorType'
            },
            {
              'id': '10012',
              'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
              'name': 'nvidia-tesla-p4-vws',
              'description': 'NVIDIA Tesla P4 Virtual Workstation',
              'zone':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/asia-southeast1-c',
              'selfLink':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/asia-southeast1-c/acceleratorTypes/nvidia-tesla-p4-vws',
              'maximumCardsPerInstance': 4,
              'kind': 'compute#acceleratorType'
            }
          ]
        },
        'zones/us-east4-a': {
          'acceleratorTypes': [
            {
              'id': '10010',
              'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
              'name': 'nvidia-tesla-p4',
              'description': 'NVIDIA Tesla P4',
              'zone':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-east4-a',
              'selfLink':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-east4-a/acceleratorTypes/nvidia-tesla-p4',
              'maximumCardsPerInstance': 4,
              'kind': 'compute#acceleratorType'
            },
            {
              'id': '10012',
              'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
              'name': 'nvidia-tesla-p4-vws',
              'description': 'NVIDIA Tesla P4 Virtual Workstation',
              'zone':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-east4-a',
              'selfLink':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-east4-a/acceleratorTypes/nvidia-tesla-p4-vws',
              'maximumCardsPerInstance': 4,
              'kind': 'compute#acceleratorType'
            }
          ]
        },
        'zones/us-east4-b': {
          'acceleratorTypes': [
            {
              'id': '10010',
              'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
              'name': 'nvidia-tesla-p4',
              'description': 'NVIDIA Tesla P4',
              'zone':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-east4-b',
              'selfLink':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-east4-b/acceleratorTypes/nvidia-tesla-p4',
              'maximumCardsPerInstance': 4,
              'kind': 'compute#acceleratorType'
            },
            {
              'id': '10012',
              'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
              'name': 'nvidia-tesla-p4-vws',
              'description': 'NVIDIA Tesla P4 Virtual Workstation',
              'zone':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-east4-b',
              'selfLink':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-east4-b/acceleratorTypes/nvidia-tesla-p4-vws',
              'maximumCardsPerInstance': 4,
              'kind': 'compute#acceleratorType'
            }
          ]
        },
        'zones/us-east4-c': {
          'acceleratorTypes': [
            {
              'id': '10010',
              'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
              'name': 'nvidia-tesla-p4',
              'description': 'NVIDIA Tesla P4',
              'zone':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-east4-c',
              'selfLink':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-east4-c/acceleratorTypes/nvidia-tesla-p4',
              'maximumCardsPerInstance': 4,
              'kind': 'compute#acceleratorType'
            },
            {
              'id': '10012',
              'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
              'name': 'nvidia-tesla-p4-vws',
              'description': 'NVIDIA Tesla P4 Virtual Workstation',
              'zone':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-east4-c',
              'selfLink':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-east4-c/acceleratorTypes/nvidia-tesla-p4-vws',
              'maximumCardsPerInstance': 4,
              'kind': 'compute#acceleratorType'
            }
          ]
        },
        'zones/australia-southeast1-c': {
          'acceleratorTypes': [
            {
              'id': '10004',
              'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
              'name': 'nvidia-tesla-p100',
              'description': 'NVIDIA Tesla P100',
              'zone':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/australia-southeast1-c',
              'selfLink':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/australia-southeast1-c/acceleratorTypes/nvidia-tesla-p100',
              'maximumCardsPerInstance': 4,
              'kind': 'compute#acceleratorType'
            },
            {
              'id': '10007',
              'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
              'name': 'nvidia-tesla-p100-vws',
              'description': 'NVIDIA Tesla P100 Virtual Workstation',
              'zone':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/australia-southeast1-c',
              'selfLink':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/australia-southeast1-c/acceleratorTypes/nvidia-tesla-p100-vws',
              'maximumCardsPerInstance': 4,
              'kind': 'compute#acceleratorType'
            }
          ]
        },
        'zones/australia-southeast1-a': {
          'acceleratorTypes': [
            {
              'id': '10010',
              'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
              'name': 'nvidia-tesla-p4',
              'description': 'NVIDIA Tesla P4',
              'zone':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/australia-southeast1-a',
              'selfLink':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/australia-southeast1-a/acceleratorTypes/nvidia-tesla-p4',
              'maximumCardsPerInstance': 4,
              'kind': 'compute#acceleratorType'
            },
            {
              'id': '10012',
              'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
              'name': 'nvidia-tesla-p4-vws',
              'description': 'NVIDIA Tesla P4 Virtual Workstation',
              'zone':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/australia-southeast1-a',
              'selfLink':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/australia-southeast1-a/acceleratorTypes/nvidia-tesla-p4-vws',
              'maximumCardsPerInstance': 4,
              'kind': 'compute#acceleratorType'
            }
          ]
        },
        'zones/australia-southeast1-b': {
          'acceleratorTypes': [
            {
              'id': '10010',
              'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
              'name': 'nvidia-tesla-p4',
              'description': 'NVIDIA Tesla P4',
              'zone':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/australia-southeast1-b',
              'selfLink':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/australia-southeast1-b/acceleratorTypes/nvidia-tesla-p4',
              'maximumCardsPerInstance': 4,
              'kind': 'compute#acceleratorType'
            },
            {
              'id': '10012',
              'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
              'name': 'nvidia-tesla-p4-vws',
              'description': 'NVIDIA Tesla P4 Virtual Workstation',
              'zone':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/australia-southeast1-b',
              'selfLink':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/australia-southeast1-b/acceleratorTypes/nvidia-tesla-p4-vws',
              'maximumCardsPerInstance': 4,
              'kind': 'compute#acceleratorType'
            }
          ]
        },
        'zones/europe-west2-a': {
          'warning': {
            'code': 'NO_RESULTS_ON_PAGE',
            'message':
                'There are no results for scope \'zones/europe-west2-a\' on this page.',
            'data': [{'key': 'scope', 'value': 'zones/europe-west2-a'}]
          }
        },
        'zones/europe-west2-b': {
          'warning': {
            'code': 'NO_RESULTS_ON_PAGE',
            'message':
                'There are no results for scope \'zones/europe-west2-b\' on this page.',
            'data': [{'key': 'scope', 'value': 'zones/europe-west2-b'}]
          }
        },
        'zones/europe-west2-c': {
          'warning': {
            'code': 'NO_RESULTS_ON_PAGE',
            'message':
                'There are no results for scope \'zones/europe-west2-c\' on this page.',
            'data': [{'key': 'scope', 'value': 'zones/europe-west2-c'}]
          }
        },
        'zones/europe-west3-c': {
          'warning': {
            'code': 'NO_RESULTS_ON_PAGE',
            'message':
                'There are no results for scope \'zones/europe-west3-c\' on this page.',
            'data': [{'key': 'scope', 'value': 'zones/europe-west3-c'}]
          }
        },
        'zones/europe-west3-a': {
          'warning': {
            'code': 'NO_RESULTS_ON_PAGE',
            'message':
                'There are no results for scope \'zones/europe-west3-a\' on this page.',
            'data': [{'key': 'scope', 'value': 'zones/europe-west3-a'}]
          }
        },
        'zones/europe-west3-b': {
          'warning': {
            'code': 'NO_RESULTS_ON_PAGE',
            'message':
                'There are no results for scope \'zones/europe-west3-b\' on this page.',
            'data': [{'key': 'scope', 'value': 'zones/europe-west3-b'}]
          }
        },
        'zones/southamerica-east1-a': {
          'warning': {
            'code': 'NO_RESULTS_ON_PAGE',
            'message':
                'There are no results for scope \'zones/southamerica-east1-a\' on this page.',
            'data': [{'key': 'scope', 'value': 'zones/southamerica-east1-a'}]
          }
        },
        'zones/southamerica-east1-b': {
          'warning': {
            'code': 'NO_RESULTS_ON_PAGE',
            'message':
                'There are no results for scope \'zones/southamerica-east1-b\' on this page.',
            'data': [{'key': 'scope', 'value': 'zones/southamerica-east1-b'}]
          }
        },
        'zones/southamerica-east1-c': {
          'acceleratorTypes': [
            {
              'id': '10019',
              'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
              'name': 'nvidia-tesla-t4',
              'description': 'NVIDIA Tesla T4',
              'zone':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/southamerica-east1-c',
              'selfLink':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/southamerica-east1-c/acceleratorTypes/nvidia-tesla-t4',
              'maximumCardsPerInstance': 4,
              'kind': 'compute#acceleratorType'
            },
            {
              'id': '10020',
              'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
              'name': 'nvidia-tesla-t4-vws',
              'description': 'NVIDIA Tesla T4 Virtual Workstation',
              'zone':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/southamerica-east1-c',
              'selfLink':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/southamerica-east1-c/acceleratorTypes/nvidia-tesla-t4-vws',
              'maximumCardsPerInstance': 4,
              'kind': 'compute#acceleratorType'
            }
          ]
        },
        'zones/asia-south1-b': {
          'acceleratorTypes': [
            {
              'id': '10019',
              'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
              'name': 'nvidia-tesla-t4',
              'description': 'NVIDIA Tesla T4',
              'zone':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/asia-south1-b',
              'selfLink':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/asia-south1-b/acceleratorTypes/nvidia-tesla-t4',
              'maximumCardsPerInstance': 4,
              'kind': 'compute#acceleratorType'
            },
            {
              'id': '10020',
              'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
              'name': 'nvidia-tesla-t4-vws',
              'description': 'NVIDIA Tesla T4 Virtual Workstation',
              'zone':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/asia-south1-b',
              'selfLink':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/asia-south1-b/acceleratorTypes/nvidia-tesla-t4-vws',
              'maximumCardsPerInstance': 4,
              'kind': 'compute#acceleratorType'
            }
          ]
        },
        'zones/asia-south1-a': {
          'warning': {
            'code': 'NO_RESULTS_ON_PAGE',
            'message':
                'There are no results for scope \'zones/asia-south1-a\' on this page.',
            'data': [{'key': 'scope', 'value': 'zones/asia-south1-a'}]
          }
        },
        'zones/asia-south1-c': {
          'warning': {
            'code': 'NO_RESULTS_ON_PAGE',
            'message':
                'There are no results for scope \'zones/asia-south1-c\' on this page.',
            'data': [{'key': 'scope', 'value': 'zones/asia-south1-c'}]
          }
        },
        'zones/northamerica-northeast1-a': {
          'acceleratorTypes': [
            {
              'id': '10010',
              'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
              'name': 'nvidia-tesla-p4',
              'description': 'NVIDIA Tesla P4',
              'zone':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/northamerica-northeast1-a',
              'selfLink':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/northamerica-northeast1-a/acceleratorTypes/nvidia-tesla-p4',
              'maximumCardsPerInstance': 4,
              'kind': 'compute#acceleratorType'
            },
            {
              'id': '10012',
              'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
              'name': 'nvidia-tesla-p4-vws',
              'description': 'NVIDIA Tesla P4 Virtual Workstation',
              'zone':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/northamerica-northeast1-a',
              'selfLink':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/northamerica-northeast1-a/acceleratorTypes/nvidia-tesla-p4-vws',
              'maximumCardsPerInstance': 4,
              'kind': 'compute#acceleratorType'
            }
          ]
        },
        'zones/northamerica-northeast1-b': {
          'acceleratorTypes': [
            {
              'id': '10010',
              'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
              'name': 'nvidia-tesla-p4',
              'description': 'NVIDIA Tesla P4',
              'zone':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/northamerica-northeast1-b',
              'selfLink':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/northamerica-northeast1-b/acceleratorTypes/nvidia-tesla-p4',
              'maximumCardsPerInstance': 4,
              'kind': 'compute#acceleratorType'
            },
            {
              'id': '10012',
              'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
              'name': 'nvidia-tesla-p4-vws',
              'description': 'NVIDIA Tesla P4 Virtual Workstation',
              'zone':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/northamerica-northeast1-b',
              'selfLink':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/northamerica-northeast1-b/acceleratorTypes/nvidia-tesla-p4-vws',
              'maximumCardsPerInstance': 4,
              'kind': 'compute#acceleratorType'
            }
          ]
        },
        'zones/northamerica-northeast1-c': {
          'acceleratorTypes': [
            {
              'id': '10010',
              'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
              'name': 'nvidia-tesla-p4',
              'description': 'NVIDIA Tesla P4',
              'zone':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/northamerica-northeast1-c',
              'selfLink':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/northamerica-northeast1-c/acceleratorTypes/nvidia-tesla-p4',
              'maximumCardsPerInstance': 4,
              'kind': 'compute#acceleratorType'
            },
            {
              'id': '10012',
              'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
              'name': 'nvidia-tesla-p4-vws',
              'description': 'NVIDIA Tesla P4 Virtual Workstation',
              'zone':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/northamerica-northeast1-c',
              'selfLink':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/northamerica-northeast1-c/acceleratorTypes/nvidia-tesla-p4-vws',
              'maximumCardsPerInstance': 4,
              'kind': 'compute#acceleratorType'
            }
          ]
        },
        'zones/europe-west4-c':
            {
              'acceleratorTypes':
                  [
                    {
                      'id': '10010',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'nvidia-tesla-p4',
                      'description': 'NVIDIA Tesla P4',
                      'zone': 'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west4-c',
                      'selfLink': 'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west4-c/acceleratorTypes/nvidia-tesla-p4',
                      'maximumCardsPerInstance': 4,
                      'kind': 'compute#acceleratorType'
                    },
                    {
                      'id': '10012',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'nvidia-tesla-p4-vws',
                      'description': 'NVIDIA Tesla P4 Virtual Workstation',
                      'zone':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west4-c',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west4-c/acceleratorTypes/nvidia-tesla-p4-vws',
                      'maximumCardsPerInstance': 4,
                      'kind': 'compute#acceleratorType'
                    },
                    {
                      'id': '10019',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'nvidia-tesla-t4',
                      'description': 'NVIDIA Tesla T4',
                      'zone':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west4-c',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west4-c/acceleratorTypes/nvidia-tesla-t4',
                      'maximumCardsPerInstance': 4,
                      'kind': 'compute#acceleratorType'
                    },
                    {
                      'id': '10020',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'nvidia-tesla-t4-vws',
                      'description': 'NVIDIA Tesla T4 Virtual Workstation',
                      'zone':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west4-c',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west4-c/acceleratorTypes/nvidia-tesla-t4-vws',
                      'maximumCardsPerInstance': 4,
                      'kind': 'compute#acceleratorType'
                    },
                    {
                      'id': '10008',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'nvidia-tesla-v100',
                      'description': 'NVIDIA Tesla V100',
                      'zone':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west4-c',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west4-c/acceleratorTypes/nvidia-tesla-v100',
                      'maximumCardsPerInstance': 8,
                      'kind': 'compute#acceleratorType'
                    }
                  ]
            },
        'zones/europe-west4-b': {
          'acceleratorTypes': [
            {
              'id': '10010',
              'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
              'name': 'nvidia-tesla-p4',
              'description': 'NVIDIA Tesla P4',
              'zone':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west4-b',
              'selfLink':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west4-b/acceleratorTypes/nvidia-tesla-p4',
              'maximumCardsPerInstance': 4,
              'kind': 'compute#acceleratorType'
            },
            {
              'id': '10012',
              'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
              'name': 'nvidia-tesla-p4-vws',
              'description': 'NVIDIA Tesla P4 Virtual Workstation',
              'zone':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west4-b',
              'selfLink':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west4-b/acceleratorTypes/nvidia-tesla-p4-vws',
              'maximumCardsPerInstance': 4,
              'kind': 'compute#acceleratorType'
            },
            {
              'id': '10019',
              'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
              'name': 'nvidia-tesla-t4',
              'description': 'NVIDIA Tesla T4',
              'zone':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west4-b',
              'selfLink':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west4-b/acceleratorTypes/nvidia-tesla-t4',
              'maximumCardsPerInstance': 4,
              'kind': 'compute#acceleratorType'
            },
            {
              'id': '10020',
              'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
              'name': 'nvidia-tesla-t4-vws',
              'description': 'NVIDIA Tesla T4 Virtual Workstation',
              'zone':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west4-b',
              'selfLink':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west4-b/acceleratorTypes/nvidia-tesla-t4-vws',
              'maximumCardsPerInstance': 4,
              'kind': 'compute#acceleratorType'
            },
            {
              'id': '10008',
              'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
              'name': 'nvidia-tesla-v100',
              'description': 'NVIDIA Tesla V100',
              'zone':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west4-b',
              'selfLink':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west4-b/acceleratorTypes/nvidia-tesla-v100',
              'maximumCardsPerInstance': 8,
              'kind': 'compute#acceleratorType'
            }
          ]
        },
        'zones/europe-west4-a': {
          'acceleratorTypes': [
            {
              'id': '10004',
              'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
              'name': 'nvidia-tesla-p100',
              'description': 'NVIDIA Tesla P100',
              'zone':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west4-a',
              'selfLink':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west4-a/acceleratorTypes/nvidia-tesla-p100',
              'maximumCardsPerInstance': 4,
              'kind': 'compute#acceleratorType'
            },
            {
              'id': '10007',
              'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
              'name': 'nvidia-tesla-p100-vws',
              'description': 'NVIDIA Tesla P100 Virtual Workstation',
              'zone':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west4-a',
              'selfLink':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west4-a/acceleratorTypes/nvidia-tesla-p100-vws',
              'maximumCardsPerInstance': 4,
              'kind': 'compute#acceleratorType'
            },
            {
              'id': '10008',
              'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
              'name': 'nvidia-tesla-v100',
              'description': 'NVIDIA Tesla V100',
              'zone':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west4-a',
              'selfLink':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west4-a/acceleratorTypes/nvidia-tesla-v100',
              'maximumCardsPerInstance': 8,
              'kind': 'compute#acceleratorType'
            }
          ]
        },
        'zones/europe-north1-b': {
          'warning': {
            'code': 'NO_RESULTS_ON_PAGE',
            'message':
                'There are no results for scope \'zones/europe-north1-b\' on this page.',
            'data': [{'key': 'scope', 'value': 'zones/europe-north1-b'}]
          }
        },
        'zones/europe-north1-c': {
          'warning': {
            'code': 'NO_RESULTS_ON_PAGE',
            'message':
                'There are no results for scope \'zones/europe-north1-c\' on this page.',
            'data': [{'key': 'scope', 'value': 'zones/europe-north1-c'}]
          }
        },
        'zones/europe-north1-a': {
          'warning': {
            'code': 'NO_RESULTS_ON_PAGE',
            'message':
                'There are no results for scope \'zones/europe-north1-a\' on this page.',
            'data': [{'key': 'scope', 'value': 'zones/europe-north1-a'}]
          }
        },
        'zones/us-west2-c': {
          'acceleratorTypes': [
            {
              'id': '10010',
              'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
              'name': 'nvidia-tesla-p4',
              'description': 'NVIDIA Tesla P4',
              'zone':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west2-c',
              'selfLink':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west2-c/acceleratorTypes/nvidia-tesla-p4',
              'maximumCardsPerInstance': 4,
              'kind': 'compute#acceleratorType'
            },
            {
              'id': '10012',
              'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
              'name': 'nvidia-tesla-p4-vws',
              'description': 'NVIDIA Tesla P4 Virtual Workstation',
              'zone':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west2-c',
              'selfLink':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west2-c/acceleratorTypes/nvidia-tesla-p4-vws',
              'maximumCardsPerInstance': 4,
              'kind': 'compute#acceleratorType'
            }
          ]
        },
        'zones/us-west2-b': {
          'acceleratorTypes': [
            {
              'id': '10010',
              'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
              'name': 'nvidia-tesla-p4',
              'description': 'NVIDIA Tesla P4',
              'zone':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west2-b',
              'selfLink':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west2-b/acceleratorTypes/nvidia-tesla-p4',
              'maximumCardsPerInstance': 4,
              'kind': 'compute#acceleratorType'
            },
            {
              'id': '10012',
              'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
              'name': 'nvidia-tesla-p4-vws',
              'description': 'NVIDIA Tesla P4 Virtual Workstation',
              'zone':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west2-b',
              'selfLink':
                  'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west2-b/acceleratorTypes/nvidia-tesla-p4-vws',
              'maximumCardsPerInstance': 4,
              'kind': 'compute#acceleratorType'
            }
          ]
        },
        'zones/us-west2-a': {
          'warning': {
            'code': 'NO_RESULTS_ON_PAGE',
            'message':
                'There are no results for scope \'zones/us-west2-a\' on this page.',
            'data': [{'key': 'scope', 'value': 'zones/us-west2-a'}]
          }
        },
        'zones/asia-east2-c': {
          'warning': {
            'code': 'NO_RESULTS_ON_PAGE',
            'message':
                'There are no results for scope \'zones/asia-east2-c\' on this page.',
            'data': [{'key': 'scope', 'value': 'zones/asia-east2-c'}]
          }
        },
        'zones/asia-east2-b': {
          'warning': {
            'code': 'NO_RESULTS_ON_PAGE',
            'message':
                'There are no results for scope \'zones/asia-east2-b\' on this page.',
            'data': [{'key': 'scope', 'value': 'zones/asia-east2-b'}]
          }
        },
        'zones/asia-east2-a': {
          'warning': {
            'code': 'NO_RESULTS_ON_PAGE',
            'message':
                'There are no results for scope \'zones/asia-east2-a\' on this page.',
            'data': [{'key': 'scope', 'value': 'zones/asia-east2-a'}]
          }
        },
        'zones/europe-west6-b': {
          'warning': {
            'code': 'NO_RESULTS_ON_PAGE',
            'message':
                'There are no results for scope \'zones/europe-west6-b\' on this page.',
            'data': [{'key': 'scope', 'value': 'zones/europe-west6-b'}]
          }
        },
        'zones/europe-west6-c': {
          'warning': {
            'code': 'NO_RESULTS_ON_PAGE',
            'message':
                'There are no results for scope \'zones/europe-west6-c\' on this page.',
            'data': [{'key': 'scope', 'value': 'zones/europe-west6-c'}]
          }
        },
        'zones/europe-west6-a': {
          'warning': {
            'code': 'NO_RESULTS_ON_PAGE',
            'message':
                'There are no results for scope \'zones/europe-west6-a\' on this page.',
            'data': [{'key': 'scope', 'value': 'zones/europe-west6-a'}]
          }
        },
        'zones/asia-northeast2-b': {
          'warning': {
            'code': 'NO_RESULTS_ON_PAGE',
            'message':
                'There are no results for scope \'zones/asia-northeast2-b\' on this page.',
            'data': [{'key': 'scope', 'value': 'zones/asia-northeast2-b'}]
          }
        },
        'zones/asia-northeast2-c': {
          'warning': {
            'code': 'NO_RESULTS_ON_PAGE',
            'message':
                'There are no results for scope \'zones/asia-northeast2-c\' on this page.',
            'data': [{'key': 'scope', 'value': 'zones/asia-northeast2-c'}]
          }
        },
        'zones/asia-northeast2-a': {
          'warning': {
            'code': 'NO_RESULTS_ON_PAGE',
            'message':
                'There are no results for scope \'zones/asia-northeast2-a\' on this page.',
            'data': [{'key': 'scope', 'value': 'zones/asia-northeast2-a'}]
          }
        }
      },
  'selfLink':
      'https://www.googleapis.com/compute/v1/projects/weiting-dev/aggregated/acceleratorTypes',
  'kind': 'compute#acceleratorTypeAggregatedList'
}
