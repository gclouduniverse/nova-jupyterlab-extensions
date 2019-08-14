import {Option} from './option';

/** Interface used in UI to represent Machine Type. */
export interface MachineType extends Option {
  cpuCount: number;
  memoryMb: number;
}

type DeprecationStatusState = 'ACTIVE'|'DELETED'|'DEPRECATED'|'OBSOLETE';

interface DeprecationStatus {
  deleted?: string;
  deprecated?: string;
  obsolete?: string;
  replacement?: string;
  state?: DeprecationStatusState;
}

interface RawMachineType {
  creationTimestamp?: string;
  deprecated?: DeprecationStatus;
  description?: string;
  guestCpus?: number;
  id?: string;
  imageSpaceGb?: number;
  isSharedCpu?: boolean;
  kind?: string;
  maximumPersistentDisks?: number;
  maximumPersistentDisksSizeGb?: string;
  memoryMb?: number;
  name?: string;
  scratchDisks?: Array<{
    diskGb?: number,
  }>;
  selfLink?: string;
  zone?: string;
}

interface MachineTypesScopedList {
  machineTypes?: Array<RawMachineType>;
  warning?: {
    code?: string,
    data?: Array<{
          key?: string,
          value?: string,
        }>,
    message?: string,
  }
}

export function getMachineTypeOptions(zone: string): MachineType[] {
  const items: {[key: string]: MachineTypesScopedList} = MACHINE_TYPE.items;
  const targetZone = 'zones/' + zone;

  if (!(items[targetZone] && items[targetZone]['machineTypes'])) {
    return [];
  }

  return items[targetZone]['machineTypes']
      .filter(machine => !machine.isSharedCpu)
      .sort((a, b) => (a.guestCpus || 0) - (b.guestCpus || 0))
      .map(machine => {
        return {
          value: machine.name,
          text: machine.description,
          cpuCount: machine.guestCpus,
          memoryMb: machine.memoryMb,
        };
      });
}

// TODO Remove this file and query machine type from API instead
export const MACHINE_TYPE =
    {
      'id': 'projects/weiting-dev/aggregated/machineTypes',
      'items':
          {
            'zones/us-central1-a':
                {
                  'machineTypes':
                      [
                        {
                          'id': '1000',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'f1-micro',
                          'description':
                              '1 vCPU (shared physical core) and 0.6 GB RAM',
                          'guestCpus': 1,
                          'memoryMb': 614,
                          'imageSpaceGb': 0,
                          'maximumPersistentDisks': 16,
                          'maximumPersistentDisksSizeGb': '3072',
                          'zone': 'us-central1-a',
                          'selfLink':
                              'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-a/machineTypes/f1-micro',
                          'isSharedCpu': true,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '2000',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'g1-small',
                          'description':
                              '1 vCPU (shared physical core) and 1.7 GB RAM',
                          'guestCpus': 1,
                          'memoryMb': 1740,
                          'imageSpaceGb': 0,
                          'maximumPersistentDisks': 16,
                          'maximumPersistentDisksSizeGb': '3072',
                          'zone': 'us-central1-a',
                          'selfLink':
                              'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-a/machineTypes/g1-small',
                          'isSharedCpu': true,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '9196',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'm1-megamem-96',
                          'description': '96 vCPUs, 1.4 TB RAM',
                          'guestCpus': 96,
                          'memoryMb': 1468006,
                          'imageSpaceGb': 0,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-central1-a',
                          'selfLink':
                              'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-a/machineTypes/m1-megamem-96',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '11160',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'm1-ultramem-160',
                          'description': '160 vCPUs, 3844 GB RAM',
                          'guestCpus': 160,
                          'memoryMb': 3936256,
                          'imageSpaceGb': 0,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-central1-a',
                          'selfLink':
                              'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-a/machineTypes/m1-ultramem-160',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '11040',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'm1-ultramem-40',
                          'description': '40 vCPUs, 961 GB RAM',
                          'guestCpus': 40,
                          'memoryMb': 984064,
                          'imageSpaceGb': 0,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-central1-a',
                          'selfLink':
                              'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-a/machineTypes/m1-ultramem-40',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '11080',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'm1-ultramem-80',
                          'description': '80 vCPUs, 1922 GB RAM',
                          'guestCpus': 80,
                          'memoryMb': 1968128,
                          'imageSpaceGb': 0,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-central1-a',
                          'selfLink':
                              'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-a/machineTypes/m1-ultramem-80',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '4016',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n1-highcpu-16',
                          'description': '16 vCPUs, 14.4 GB RAM',
                          'guestCpus': 16,
                          'memoryMb': 14746,
                          'imageSpaceGb': 10,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-central1-a',
                          'selfLink':
                              'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-a/machineTypes/n1-highcpu-16',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '4002',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n1-highcpu-2',
                          'description': '2 vCPUs, 1.8 GB RAM',
                          'guestCpus': 2,
                          'memoryMb': 1843,
                          'imageSpaceGb': 10,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-central1-a',
                          'selfLink':
                              'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-a/machineTypes/n1-highcpu-2',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '4032',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n1-highcpu-32',
                          'description': '32 vCPUs, 28.8 GB RAM',
                          'guestCpus': 32,
                          'memoryMb': 29491,
                          'imageSpaceGb': 0,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-central1-a',
                          'selfLink':
                              'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-a/machineTypes/n1-highcpu-32',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '4004',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n1-highcpu-4',
                          'description': '4 vCPUs, 3.6 GB RAM',
                          'guestCpus': 4,
                          'memoryMb': 3686,
                          'imageSpaceGb': 10,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-central1-a',
                          'selfLink':
                              'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-a/machineTypes/n1-highcpu-4',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '4064',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n1-highcpu-64',
                          'description': '64 vCPUs, 57.6 GB RAM',
                          'guestCpus': 64,
                          'memoryMb': 58982,
                          'imageSpaceGb': 0,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-central1-a',
                          'selfLink':
                              'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-a/machineTypes/n1-highcpu-64',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '4008',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n1-highcpu-8',
                          'description': '8 vCPUs, 7.2 GB RAM',
                          'guestCpus': 8,
                          'memoryMb': 7373,
                          'imageSpaceGb': 10,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-central1-a',
                          'selfLink':
                              'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-a/machineTypes/n1-highcpu-8',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '4096',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n1-highcpu-96',
                          'description': '96 vCPUs, 86 GB RAM',
                          'guestCpus': 96,
                          'memoryMb': 88474,
                          'imageSpaceGb': 0,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-central1-a',
                          'selfLink':
                              'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-a/machineTypes/n1-highcpu-96',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '5016',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n1-highmem-16',
                          'description': '16 vCPUs, 104 GB RAM',
                          'guestCpus': 16,
                          'memoryMb': 106496,
                          'imageSpaceGb': 10,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-central1-a',
                          'selfLink':
                              'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-a/machineTypes/n1-highmem-16',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '5002',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n1-highmem-2',
                          'description': '2 vCPUs, 13 GB RAM',
                          'guestCpus': 2,
                          'memoryMb': 13312,
                          'imageSpaceGb': 10,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-central1-a',
                          'selfLink':
                              'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-a/machineTypes/n1-highmem-2',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '5032',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n1-highmem-32',
                          'description': '32 vCPUs, 208 GB RAM',
                          'guestCpus': 32,
                          'memoryMb': 212992,
                          'imageSpaceGb': 0,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-central1-a',
                          'selfLink':
                              'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-a/machineTypes/n1-highmem-32',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '5004',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n1-highmem-4',
                          'description': '4 vCPUs, 26 GB RAM',
                          'guestCpus': 4,
                          'memoryMb': 26624,
                          'imageSpaceGb': 10,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-central1-a',
                          'selfLink':
                              'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-a/machineTypes/n1-highmem-4',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '5064',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n1-highmem-64',
                          'description': '64 vCPUs, 416 GB RAM',
                          'guestCpus': 64,
                          'memoryMb': 425984,
                          'imageSpaceGb': 0,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-central1-a',
                          'selfLink':
                              'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-a/machineTypes/n1-highmem-64',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '5008',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n1-highmem-8',
                          'description': '8 vCPUs, 52 GB RAM',
                          'guestCpus': 8,
                          'memoryMb': 53248,
                          'imageSpaceGb': 10,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-central1-a',
                          'selfLink':
                              'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-a/machineTypes/n1-highmem-8',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '5096',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n1-highmem-96',
                          'description': '96 vCPUs, 624 GB RAM',
                          'guestCpus': 96,
                          'memoryMb': 638976,
                          'imageSpaceGb': 0,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-central1-a',
                          'selfLink':
                              'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-a/machineTypes/n1-highmem-96',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '9096',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n1-megamem-96',
                          'description': '96 vCPUs, 1.4 TB RAM',
                          'guestCpus': 96,
                          'memoryMb': 1468006,
                          'imageSpaceGb': 0,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-central1-a',
                          'selfLink':
                              'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-a/machineTypes/n1-megamem-96',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '3001',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n1-standard-1',
                          'description': '1 vCPU, 3.75 GB RAM',
                          'guestCpus': 1,
                          'memoryMb': 3840,
                          'imageSpaceGb': 10,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-central1-a',
                          'selfLink':
                              'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-a/machineTypes/n1-standard-1',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '3016',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n1-standard-16',
                          'description': '16 vCPUs, 60 GB RAM',
                          'guestCpus': 16,
                          'memoryMb': 61440,
                          'imageSpaceGb': 10,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-central1-a',
                          'selfLink':
                              'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-a/machineTypes/n1-standard-16',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '3002',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n1-standard-2',
                          'description': '2 vCPUs, 7.5 GB RAM',
                          'guestCpus': 2,
                          'memoryMb': 7680,
                          'imageSpaceGb': 10,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-central1-a',
                          'selfLink':
                              'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-a/machineTypes/n1-standard-2',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '3032',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n1-standard-32',
                          'description': '32 vCPUs, 120 GB RAM',
                          'guestCpus': 32,
                          'memoryMb': 122880,
                          'imageSpaceGb': 0,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-central1-a',
                          'selfLink':
                              'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-a/machineTypes/n1-standard-32',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '3004',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n1-standard-4',
                          'description': '4 vCPUs, 15 GB RAM',
                          'guestCpus': 4,
                          'memoryMb': 15360,
                          'imageSpaceGb': 10,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-central1-a',
                          'selfLink':
                              'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-a/machineTypes/n1-standard-4',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '3064',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n1-standard-64',
                          'description': '64 vCPUs, 240 GB RAM',
                          'guestCpus': 64,
                          'memoryMb': 245760,
                          'imageSpaceGb': 0,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-central1-a',
                          'selfLink':
                              'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-a/machineTypes/n1-standard-64',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '3008',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n1-standard-8',
                          'description': '8 vCPUs, 30 GB RAM',
                          'guestCpus': 8,
                          'memoryMb': 30720,
                          'imageSpaceGb': 10,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-central1-a',
                          'selfLink':
                              'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-a/machineTypes/n1-standard-8',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '3096',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n1-standard-96',
                          'description': '96 vCPUs, 360 GB RAM',
                          'guestCpus': 96,
                          'memoryMb': 368640,
                          'imageSpaceGb': 0,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-central1-a',
                          'selfLink': 'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-a/machineTypes/n1-standard-96',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '10160',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n1-ultramem-160',
                          'description': '160 vCPUs, 3844 GB RAM',
                          'guestCpus': 160,
                          'memoryMb': 3936256,
                          'imageSpaceGb': 0,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-central1-a',
                          'selfLink': 'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-a/machineTypes/n1-ultramem-160',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '10040',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n1-ultramem-40',
                          'description': '40 vCPUs, 961 GB RAM',
                          'guestCpus': 40,
                          'memoryMb': 984064,
                          'imageSpaceGb': 0,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-central1-a',
                          'selfLink': 'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-a/machineTypes/n1-ultramem-40',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '10080',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n1-ultramem-80',
                          'description': '80 vCPUs, 1922 GB RAM',
                          'guestCpus': 80,
                          'memoryMb': 1968128,
                          'imageSpaceGb': 0,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-central1-a',
                          'selfLink': 'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-a/machineTypes/n1-ultramem-80',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '903016',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n2-highcpu-16',
                          'description': '16 vCPUs 16 GB RAM',
                          'guestCpus': 16,
                          'memoryMb': 16384,
                          'imageSpaceGb': 0,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-central1-a',
                          'selfLink': 'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-a/machineTypes/n2-highcpu-16',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '903002',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n2-highcpu-2',
                          'description': '2 vCPUs 2 GB RAM',
                          'guestCpus': 2,
                          'memoryMb': 2048,
                          'imageSpaceGb': 0,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-central1-a',
                          'selfLink': 'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-a/machineTypes/n2-highcpu-2',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '903032',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n2-highcpu-32',
                          'description': '32 vCPUs 32 GB RAM',
                          'guestCpus': 32,
                          'memoryMb': 32768,
                          'imageSpaceGb': 0,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-central1-a',
                          'selfLink': 'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-a/machineTypes/n2-highcpu-32',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '903004',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n2-highcpu-4',
                          'description': '4 vCPUs 4 GB RAM',
                          'guestCpus': 4,
                          'memoryMb': 4096,
                          'imageSpaceGb': 0,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-central1-a',
                          'selfLink': 'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-a/machineTypes/n2-highcpu-4',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '903048',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n2-highcpu-48',
                          'description': '48 vCPUs 48 GB RAM',
                          'guestCpus': 48,
                          'memoryMb': 49152,
                          'imageSpaceGb': 0,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-central1-a',
                          'selfLink': 'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-a/machineTypes/n2-highcpu-48',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '903064',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n2-highcpu-64',
                          'description': '64 vCPUs 64 GB RAM',
                          'guestCpus': 64,
                          'memoryMb': 65536,
                          'imageSpaceGb': 0,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-central1-a',
                          'selfLink': 'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-a/machineTypes/n2-highcpu-64',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '903008',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n2-highcpu-8',
                          'description': '8 vCPUs 8 GB RAM',
                          'guestCpus': 8,
                          'memoryMb': 8192,
                          'imageSpaceGb': 0,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-central1-a',
                          'selfLink': 'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-a/machineTypes/n2-highcpu-8',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '903080',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n2-highcpu-80',
                          'description': '80 vCPUs 80 GB RAM',
                          'guestCpus': 80,
                          'memoryMb': 81920,
                          'imageSpaceGb': 0,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-central1-a',
                          'selfLink': 'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-a/machineTypes/n2-highcpu-80',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '902016',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n2-highmem-16',
                          'description': '16 vCPUs 128 GB RAM',
                          'guestCpus': 16,
                          'memoryMb': 131072,
                          'imageSpaceGb': 0,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-central1-a',
                          'selfLink': 'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-a/machineTypes/n2-highmem-16',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '902002',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n2-highmem-2',
                          'description': '2 vCPUs 16 GB RAM',
                          'guestCpus': 2,
                          'memoryMb': 16384,
                          'imageSpaceGb': 0,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-central1-a',
                          'selfLink': 'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-a/machineTypes/n2-highmem-2',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '902032',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n2-highmem-32',
                          'description': '32 vCPUs 256 GB RAM',
                          'guestCpus': 32,
                          'memoryMb': 262144,
                          'imageSpaceGb': 0,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-central1-a',
                          'selfLink':
                              'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-a/machineTypes/n2-highmem-32',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '902004',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n2-highmem-4',
                          'description': '4 vCPUs 32 GB RAM',
                          'guestCpus': 4,
                          'memoryMb': 32768,
                          'imageSpaceGb': 0,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-central1-a',
                          'selfLink':
                              'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-a/machineTypes/n2-highmem-4',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '902048',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n2-highmem-48',
                          'description': '48 vCPUs 384 GB RAM',
                          'guestCpus': 48,
                          'memoryMb': 393216,
                          'imageSpaceGb': 0,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-central1-a',
                          'selfLink':
                              'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-a/machineTypes/n2-highmem-48',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '902064',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n2-highmem-64',
                          'description': '64 vCPUs 512 GB RAM',
                          'guestCpus': 64,
                          'memoryMb': 524288,
                          'imageSpaceGb': 0,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-central1-a',
                          'selfLink':
                              'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-a/machineTypes/n2-highmem-64',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '902008',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n2-highmem-8',
                          'description': '8 vCPUs 64 GB RAM',
                          'guestCpus': 8,
                          'memoryMb': 65536,
                          'imageSpaceGb': 0,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-central1-a',
                          'selfLink':
                              'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-a/machineTypes/n2-highmem-8',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '902080',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n2-highmem-80',
                          'description': '80 vCPUs 640 GB RAM',
                          'guestCpus': 80,
                          'memoryMb': 655360,
                          'imageSpaceGb': 0,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-central1-a',
                          'selfLink':
                              'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-a/machineTypes/n2-highmem-80',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '901016',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n2-standard-16',
                          'description': '16 vCPUs 64 GB RAM',
                          'guestCpus': 16,
                          'memoryMb': 65536,
                          'imageSpaceGb': 0,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-central1-a',
                          'selfLink':
                              'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-a/machineTypes/n2-standard-16',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '901002',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n2-standard-2',
                          'description': '2 vCPUs 8 GB RAM',
                          'guestCpus': 2,
                          'memoryMb': 8192,
                          'imageSpaceGb': 0,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-central1-a',
                          'selfLink':
                              'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-a/machineTypes/n2-standard-2',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '901032',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n2-standard-32',
                          'description': '32 vCPUs 128 GB RAM',
                          'guestCpus': 32,
                          'memoryMb': 131072,
                          'imageSpaceGb': 0,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-central1-a',
                          'selfLink':
                              'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-a/machineTypes/n2-standard-32',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '901004',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n2-standard-4',
                          'description': '4 vCPUs 16 GB RAM',
                          'guestCpus': 4,
                          'memoryMb': 16384,
                          'imageSpaceGb': 0,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-central1-a',
                          'selfLink':
                              'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-a/machineTypes/n2-standard-4',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '901048',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n2-standard-48',
                          'description': '48 vCPUs 192 GB RAM',
                          'guestCpus': 48,
                          'memoryMb': 196608,
                          'imageSpaceGb': 0,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-central1-a',
                          'selfLink':
                              'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-a/machineTypes/n2-standard-48',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '901064',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n2-standard-64',
                          'description': '64 vCPUs 256 GB RAM',
                          'guestCpus': 64,
                          'memoryMb': 262144,
                          'imageSpaceGb': 0,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-central1-a',
                          'selfLink':
                              'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-a/machineTypes/n2-standard-64',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '901008',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n2-standard-8',
                          'description': '8 vCPUs 32 GB RAM',
                          'guestCpus': 8,
                          'memoryMb': 32768,
                          'imageSpaceGb': 0,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-central1-a',
                          'selfLink':
                              'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-a/machineTypes/n2-standard-8',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '901080',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n2-standard-80',
                          'description': '80 vCPUs 320 GB RAM',
                          'guestCpus': 80,
                          'memoryMb': 327680,
                          'imageSpaceGb': 0,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-central1-a',
                          'selfLink':
                              'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-a/machineTypes/n2-standard-80',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        }
                      ]
                },
            'zones/us-central1-b':
                {
                  'machineTypes':
                      [
                        {
                          'id': '801016',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'c2-standard-16',
                          'description':
                              'Compute Optimized: 16 vCPUs, 64 GB RAM',
                          'guestCpus': 16,
                          'memoryMb': 65536,
                          'imageSpaceGb': 0,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-central1-b',
                          'selfLink': 'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-b/machineTypes/c2-standard-16',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '801030',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'c2-standard-30',
                          'description':
                              'Compute Optimized: 30 vCPUs, 120 GB RAM',
                          'guestCpus': 30,
                          'memoryMb': 122880,
                          'imageSpaceGb': 0,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-central1-b',
                          'selfLink': 'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-b/machineTypes/c2-standard-30',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '801004',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'c2-standard-4',
                          'description':
                              'Compute Optimized: 4 vCPUs, 16 GB RAM',
                          'guestCpus': 4,
                          'memoryMb': 16384,
                          'imageSpaceGb': 0,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-central1-b',
                          'selfLink': 'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-b/machineTypes/c2-standard-4',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '801060',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'c2-standard-60',
                          'description':
                              'Compute Optimized: 60 vCPUs, 240 GB RAM',
                          'guestCpus': 60,
                          'memoryMb': 245760,
                          'imageSpaceGb': 0,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-central1-b',
                          'selfLink': 'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-b/machineTypes/c2-standard-60',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '801008',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'c2-standard-8',
                          'description':
                              'Compute Optimized: 8 vCPUs, 32 GB RAM',
                          'guestCpus': 8,
                          'memoryMb': 32768,
                          'imageSpaceGb': 0,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-central1-b',
                          'selfLink': 'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-b/machineTypes/c2-standard-8',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '1000',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'f1-micro',
                          'description':
                              '1 vCPU (shared physical core) and 0.6 GB RAM',
                          'guestCpus': 1,
                          'memoryMb': 614,
                          'imageSpaceGb': 0,
                          'maximumPersistentDisks': 16,
                          'maximumPersistentDisksSizeGb': '3072',
                          'zone': 'us-central1-b',
                          'selfLink': 'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-b/machineTypes/f1-micro',
                          'isSharedCpu': true,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '2000',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'g1-small',
                          'description':
                              '1 vCPU (shared physical core) and 1.7 GB RAM',
                          'guestCpus': 1,
                          'memoryMb': 1740,
                          'imageSpaceGb': 0,
                          'maximumPersistentDisks': 16,
                          'maximumPersistentDisksSizeGb': '3072',
                          'zone': 'us-central1-b',
                          'selfLink': 'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-b/machineTypes/g1-small',
                          'isSharedCpu': true,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '9196',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'm1-megamem-96',
                          'description': '96 vCPUs, 1.4 TB RAM',
                          'guestCpus': 96,
                          'memoryMb': 1468006,
                          'imageSpaceGb': 0,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-central1-b',
                          'selfLink': 'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-b/machineTypes/m1-megamem-96',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '11160',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'm1-ultramem-160',
                          'description': '160 vCPUs, 3844 GB RAM',
                          'guestCpus': 160,
                          'memoryMb': 3936256,
                          'imageSpaceGb': 0,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-central1-b',
                          'selfLink': 'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-b/machineTypes/m1-ultramem-160',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '11040',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'm1-ultramem-40',
                          'description': '40 vCPUs, 961 GB RAM',
                          'guestCpus': 40,
                          'memoryMb': 984064,
                          'imageSpaceGb': 0,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-central1-b',
                          'selfLink': 'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-b/machineTypes/m1-ultramem-40',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '11080',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'm1-ultramem-80',
                          'description': '80 vCPUs, 1922 GB RAM',
                          'guestCpus': 80,
                          'memoryMb': 1968128,
                          'imageSpaceGb': 0,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-central1-b',
                          'selfLink': 'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-b/machineTypes/m1-ultramem-80',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '4016',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n1-highcpu-16',
                          'description': '16 vCPUs, 14.4 GB RAM',
                          'guestCpus': 16,
                          'memoryMb': 14746,
                          'imageSpaceGb': 10,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-central1-b',
                          'selfLink': 'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-b/machineTypes/n1-highcpu-16',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '4002',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n1-highcpu-2',
                          'description': '2 vCPUs, 1.8 GB RAM',
                          'guestCpus': 2,
                          'memoryMb': 1843,
                          'imageSpaceGb': 10,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-central1-b',
                          'selfLink': 'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-b/machineTypes/n1-highcpu-2',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '4032',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n1-highcpu-32',
                          'description': '32 vCPUs, 28.8 GB RAM',
                          'guestCpus': 32,
                          'memoryMb': 29491,
                          'imageSpaceGb': 0,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-central1-b',
                          'selfLink': 'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-b/machineTypes/n1-highcpu-32',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '4004',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n1-highcpu-4',
                          'description': '4 vCPUs, 3.6 GB RAM',
                          'guestCpus': 4,
                          'memoryMb': 3686,
                          'imageSpaceGb': 10,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-central1-b',
                          'selfLink': 'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-b/machineTypes/n1-highcpu-4',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '4064',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n1-highcpu-64',
                          'description': '64 vCPUs, 57.6 GB RAM',
                          'guestCpus': 64,
                          'memoryMb': 58982,
                          'imageSpaceGb': 0,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-central1-b',
                          'selfLink': 'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-b/machineTypes/n1-highcpu-64',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '4008',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n1-highcpu-8',
                          'description': '8 vCPUs, 7.2 GB RAM',
                          'guestCpus': 8,
                          'memoryMb': 7373,
                          'imageSpaceGb': 10,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-central1-b',
                          'selfLink': 'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-b/machineTypes/n1-highcpu-8',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '4096',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n1-highcpu-96',
                          'description': '96 vCPUs, 86 GB RAM',
                          'guestCpus': 96,
                          'memoryMb': 88474,
                          'imageSpaceGb': 0,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-central1-b',
                          'selfLink': 'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-b/machineTypes/n1-highcpu-96',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '5016',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n1-highmem-16',
                          'description': '16 vCPUs, 104 GB RAM',
                          'guestCpus': 16,
                          'memoryMb': 106496,
                          'imageSpaceGb': 10,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-central1-b',
                          'selfLink': 'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-b/machineTypes/n1-highmem-16',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '5002',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n1-highmem-2',
                          'description': '2 vCPUs, 13 GB RAM',
                          'guestCpus': 2,
                          'memoryMb': 13312,
                          'imageSpaceGb': 10,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-central1-b',
                          'selfLink': 'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-b/machineTypes/n1-highmem-2',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '5032',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n1-highmem-32',
                          'description': '32 vCPUs, 208 GB RAM',
                          'guestCpus': 32,
                          'memoryMb': 212992,
                          'imageSpaceGb': 0,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-central1-b',
                          'selfLink': 'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-b/machineTypes/n1-highmem-32',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '5004',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n1-highmem-4',
                          'description': '4 vCPUs, 26 GB RAM',
                          'guestCpus': 4,
                          'memoryMb': 26624,
                          'imageSpaceGb': 10,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-central1-b',
                          'selfLink': 'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-b/machineTypes/n1-highmem-4',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '5064',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n1-highmem-64',
                          'description': '64 vCPUs, 416 GB RAM',
                          'guestCpus': 64,
                          'memoryMb': 425984,
                          'imageSpaceGb': 0,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-central1-b',
                          'selfLink': 'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-b/machineTypes/n1-highmem-64',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '5008',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n1-highmem-8',
                          'description': '8 vCPUs, 52 GB RAM',
                          'guestCpus': 8,
                          'memoryMb': 53248,
                          'imageSpaceGb': 10,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-central1-b',
                          'selfLink':
                              'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-b/machineTypes/n1-highmem-8',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '5096',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n1-highmem-96',
                          'description': '96 vCPUs, 624 GB RAM',
                          'guestCpus': 96,
                          'memoryMb': 638976,
                          'imageSpaceGb': 0,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-central1-b',
                          'selfLink':
                              'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-b/machineTypes/n1-highmem-96',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '9096',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n1-megamem-96',
                          'description': '96 vCPUs, 1.4 TB RAM',
                          'guestCpus': 96,
                          'memoryMb': 1468006,
                          'imageSpaceGb': 0,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-central1-b',
                          'selfLink':
                              'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-b/machineTypes/n1-megamem-96',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '3001',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n1-standard-1',
                          'description': '1 vCPU, 3.75 GB RAM',
                          'guestCpus': 1,
                          'memoryMb': 3840,
                          'imageSpaceGb': 10,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-central1-b',
                          'selfLink':
                              'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-b/machineTypes/n1-standard-1',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '3016',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n1-standard-16',
                          'description': '16 vCPUs, 60 GB RAM',
                          'guestCpus': 16,
                          'memoryMb': 61440,
                          'imageSpaceGb': 10,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-central1-b',
                          'selfLink':
                              'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-b/machineTypes/n1-standard-16',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '3002',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n1-standard-2',
                          'description': '2 vCPUs, 7.5 GB RAM',
                          'guestCpus': 2,
                          'memoryMb': 7680,
                          'imageSpaceGb': 10,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-central1-b',
                          'selfLink':
                              'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-b/machineTypes/n1-standard-2',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '3032',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n1-standard-32',
                          'description': '32 vCPUs, 120 GB RAM',
                          'guestCpus': 32,
                          'memoryMb': 122880,
                          'imageSpaceGb': 0,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-central1-b',
                          'selfLink':
                              'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-b/machineTypes/n1-standard-32',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '3004',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n1-standard-4',
                          'description': '4 vCPUs, 15 GB RAM',
                          'guestCpus': 4,
                          'memoryMb': 15360,
                          'imageSpaceGb': 10,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-central1-b',
                          'selfLink':
                              'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-b/machineTypes/n1-standard-4',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '3064',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n1-standard-64',
                          'description': '64 vCPUs, 240 GB RAM',
                          'guestCpus': 64,
                          'memoryMb': 245760,
                          'imageSpaceGb': 0,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-central1-b',
                          'selfLink':
                              'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-b/machineTypes/n1-standard-64',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '3008',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n1-standard-8',
                          'description': '8 vCPUs, 30 GB RAM',
                          'guestCpus': 8,
                          'memoryMb': 30720,
                          'imageSpaceGb': 10,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-central1-b',
                          'selfLink':
                              'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-b/machineTypes/n1-standard-8',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '3096',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n1-standard-96',
                          'description': '96 vCPUs, 360 GB RAM',
                          'guestCpus': 96,
                          'memoryMb': 368640,
                          'imageSpaceGb': 0,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-central1-b',
                          'selfLink':
                              'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-b/machineTypes/n1-standard-96',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '10160',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n1-ultramem-160',
                          'description': '160 vCPUs, 3844 GB RAM',
                          'guestCpus': 160,
                          'memoryMb': 3936256,
                          'imageSpaceGb': 0,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-central1-b',
                          'selfLink':
                              'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-b/machineTypes/n1-ultramem-160',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '10040',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n1-ultramem-40',
                          'description': '40 vCPUs, 961 GB RAM',
                          'guestCpus': 40,
                          'memoryMb': 984064,
                          'imageSpaceGb': 0,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-central1-b',
                          'selfLink':
                              'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-b/machineTypes/n1-ultramem-40',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '10080',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n1-ultramem-80',
                          'description': '80 vCPUs, 1922 GB RAM',
                          'guestCpus': 80,
                          'memoryMb': 1968128,
                          'imageSpaceGb': 0,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-central1-b',
                          'selfLink':
                              'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-b/machineTypes/n1-ultramem-80',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        }
                      ]
                },
            'zones/us-central1-c':
                {
                  'machineTypes': [
                    {
                      'id': '801016',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'c2-standard-16',
                      'description': 'Compute Optimized: 16 vCPUs, 64 GB RAM',
                      'guestCpus': 16,
                      'memoryMb': 65536,
                      'imageSpaceGb': 0,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-central1-c',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-c/machineTypes/c2-standard-16',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '801030',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'c2-standard-30',
                      'description': 'Compute Optimized: 30 vCPUs, 120 GB RAM',
                      'guestCpus': 30,
                      'memoryMb': 122880,
                      'imageSpaceGb': 0,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-central1-c',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-c/machineTypes/c2-standard-30',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '801004',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'c2-standard-4',
                      'description': 'Compute Optimized: 4 vCPUs, 16 GB RAM',
                      'guestCpus': 4,
                      'memoryMb': 16384,
                      'imageSpaceGb': 0,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-central1-c',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-c/machineTypes/c2-standard-4',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '801060',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'c2-standard-60',
                      'description': 'Compute Optimized: 60 vCPUs, 240 GB RAM',
                      'guestCpus': 60,
                      'memoryMb': 245760,
                      'imageSpaceGb': 0,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-central1-c',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-c/machineTypes/c2-standard-60',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '801008',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'c2-standard-8',
                      'description': 'Compute Optimized: 8 vCPUs, 32 GB RAM',
                      'guestCpus': 8,
                      'memoryMb': 32768,
                      'imageSpaceGb': 0,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-central1-c',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-c/machineTypes/c2-standard-8',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '1000',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'f1-micro',
                      'description':
                          '1 vCPU (shared physical core) and 0.6 GB RAM',
                      'guestCpus': 1,
                      'memoryMb': 614,
                      'imageSpaceGb': 0,
                      'maximumPersistentDisks': 16,
                      'maximumPersistentDisksSizeGb': '3072',
                      'zone': 'us-central1-c',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-c/machineTypes/f1-micro',
                      'isSharedCpu': true,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '2000',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'g1-small',
                      'description':
                          '1 vCPU (shared physical core) and 1.7 GB RAM',
                      'guestCpus': 1,
                      'memoryMb': 1740,
                      'imageSpaceGb': 0,
                      'maximumPersistentDisks': 16,
                      'maximumPersistentDisksSizeGb': '3072',
                      'zone': 'us-central1-c',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-c/machineTypes/g1-small',
                      'isSharedCpu': true,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '11160',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'm1-ultramem-160',
                      'description': '160 vCPUs, 3844 GB RAM',
                      'guestCpus': 160,
                      'memoryMb': 3936256,
                      'imageSpaceGb': 0,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-central1-c',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-c/machineTypes/m1-ultramem-160',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '11040',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'm1-ultramem-40',
                      'description': '40 vCPUs, 961 GB RAM',
                      'guestCpus': 40,
                      'memoryMb': 984064,
                      'imageSpaceGb': 0,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-central1-c',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-c/machineTypes/m1-ultramem-40',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '11080',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'm1-ultramem-80',
                      'description': '80 vCPUs, 1922 GB RAM',
                      'guestCpus': 80,
                      'memoryMb': 1968128,
                      'imageSpaceGb': 0,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-central1-c',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-c/machineTypes/m1-ultramem-80',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '4016',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n1-highcpu-16',
                      'description': '16 vCPUs, 14.4 GB RAM',
                      'guestCpus': 16,
                      'memoryMb': 14746,
                      'imageSpaceGb': 10,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-central1-c',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-c/machineTypes/n1-highcpu-16',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '4002',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n1-highcpu-2',
                      'description': '2 vCPUs, 1.8 GB RAM',
                      'guestCpus': 2,
                      'memoryMb': 1843,
                      'imageSpaceGb': 10,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-central1-c',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-c/machineTypes/n1-highcpu-2',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '4032',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n1-highcpu-32',
                      'description': '32 vCPUs, 28.8 GB RAM',
                      'guestCpus': 32,
                      'memoryMb': 29491,
                      'imageSpaceGb': 0,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-central1-c',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-c/machineTypes/n1-highcpu-32',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '4004',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n1-highcpu-4',
                      'description': '4 vCPUs, 3.6 GB RAM',
                      'guestCpus': 4,
                      'memoryMb': 3686,
                      'imageSpaceGb': 10,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-central1-c',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-c/machineTypes/n1-highcpu-4',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '4064',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n1-highcpu-64',
                      'description': '64 vCPUs, 57.6 GB RAM',
                      'guestCpus': 64,
                      'memoryMb': 58982,
                      'imageSpaceGb': 0,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-central1-c',
                      'selfLink': 'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-c/machineTypes/n1-highcpu-64',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '4008',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n1-highcpu-8',
                      'description': '8 vCPUs, 7.2 GB RAM',
                      'guestCpus': 8,
                      'memoryMb': 7373,
                      'imageSpaceGb': 10,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-central1-c',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-c/machineTypes/n1-highcpu-8',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '4096',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n1-highcpu-96',
                      'description': '96 vCPUs, 86 GB RAM',
                      'guestCpus': 96,
                      'memoryMb': 88474,
                      'imageSpaceGb': 0,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-central1-c',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-c/machineTypes/n1-highcpu-96',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '5016',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n1-highmem-16',
                      'description': '16 vCPUs, 104 GB RAM',
                      'guestCpus': 16,
                      'memoryMb': 106496,
                      'imageSpaceGb': 10,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-central1-c',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-c/machineTypes/n1-highmem-16',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '5002',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n1-highmem-2',
                      'description': '2 vCPUs, 13 GB RAM',
                      'guestCpus': 2,
                      'memoryMb': 13312,
                      'imageSpaceGb': 10,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-central1-c',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-c/machineTypes/n1-highmem-2',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '5032',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n1-highmem-32',
                      'description': '32 vCPUs, 208 GB RAM',
                      'guestCpus': 32,
                      'memoryMb': 212992,
                      'imageSpaceGb': 0,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-central1-c',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-c/machineTypes/n1-highmem-32',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '5004',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n1-highmem-4',
                      'description': '4 vCPUs, 26 GB RAM',
                      'guestCpus': 4,
                      'memoryMb': 26624,
                      'imageSpaceGb': 10,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-central1-c',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-c/machineTypes/n1-highmem-4',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '5064',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n1-highmem-64',
                      'description': '64 vCPUs, 416 GB RAM',
                      'guestCpus': 64,
                      'memoryMb': 425984,
                      'imageSpaceGb': 0,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-central1-c',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-c/machineTypes/n1-highmem-64',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '5008',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n1-highmem-8',
                      'description': '8 vCPUs, 52 GB RAM',
                      'guestCpus': 8,
                      'memoryMb': 53248,
                      'imageSpaceGb': 10,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-central1-c',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-c/machineTypes/n1-highmem-8',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '5096',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n1-highmem-96',
                      'description': '96 vCPUs, 624 GB RAM',
                      'guestCpus': 96,
                      'memoryMb': 638976,
                      'imageSpaceGb': 0,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-central1-c',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-c/machineTypes/n1-highmem-96',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '3001',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n1-standard-1',
                      'description': '1 vCPU, 3.75 GB RAM',
                      'guestCpus': 1,
                      'memoryMb': 3840,
                      'imageSpaceGb': 10,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-central1-c',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-c/machineTypes/n1-standard-1',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '3016',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n1-standard-16',
                      'description': '16 vCPUs, 60 GB RAM',
                      'guestCpus': 16,
                      'memoryMb': 61440,
                      'imageSpaceGb': 10,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-central1-c',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-c/machineTypes/n1-standard-16',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '3002',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n1-standard-2',
                      'description': '2 vCPUs, 7.5 GB RAM',
                      'guestCpus': 2,
                      'memoryMb': 7680,
                      'imageSpaceGb': 10,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-central1-c',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-c/machineTypes/n1-standard-2',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '3032',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n1-standard-32',
                      'description': '32 vCPUs, 120 GB RAM',
                      'guestCpus': 32,
                      'memoryMb': 122880,
                      'imageSpaceGb': 0,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-central1-c',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-c/machineTypes/n1-standard-32',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '3004',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n1-standard-4',
                      'description': '4 vCPUs, 15 GB RAM',
                      'guestCpus': 4,
                      'memoryMb': 15360,
                      'imageSpaceGb': 10,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-central1-c',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-c/machineTypes/n1-standard-4',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '3064',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n1-standard-64',
                      'description': '64 vCPUs, 240 GB RAM',
                      'guestCpus': 64,
                      'memoryMb': 245760,
                      'imageSpaceGb': 0,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-central1-c',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-c/machineTypes/n1-standard-64',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '3008',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n1-standard-8',
                      'description': '8 vCPUs, 30 GB RAM',
                      'guestCpus': 8,
                      'memoryMb': 30720,
                      'imageSpaceGb': 10,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-central1-c',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-c/machineTypes/n1-standard-8',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '3096',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n1-standard-96',
                      'description': '96 vCPUs, 360 GB RAM',
                      'guestCpus': 96,
                      'memoryMb': 368640,
                      'imageSpaceGb': 0,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-central1-c',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-c/machineTypes/n1-standard-96',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '10160',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n1-ultramem-160',
                      'description': '160 vCPUs, 3844 GB RAM',
                      'guestCpus': 160,
                      'memoryMb': 3936256,
                      'imageSpaceGb': 0,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-central1-c',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-c/machineTypes/n1-ultramem-160',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '10040',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n1-ultramem-40',
                      'description': '40 vCPUs, 961 GB RAM',
                      'guestCpus': 40,
                      'memoryMb': 984064,
                      'imageSpaceGb': 0,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-central1-c',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-c/machineTypes/n1-ultramem-40',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '10080',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n1-ultramem-80',
                      'description': '80 vCPUs, 1922 GB RAM',
                      'guestCpus': 80,
                      'memoryMb': 1968128,
                      'imageSpaceGb': 0,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-central1-c',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-c/machineTypes/n1-ultramem-80',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '903016',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n2-highcpu-16',
                      'description': '16 vCPUs 16 GB RAM',
                      'guestCpus': 16,
                      'memoryMb': 16384,
                      'imageSpaceGb': 0,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-central1-c',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-c/machineTypes/n2-highcpu-16',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '903002',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n2-highcpu-2',
                      'description': '2 vCPUs 2 GB RAM',
                      'guestCpus': 2,
                      'memoryMb': 2048,
                      'imageSpaceGb': 0,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-central1-c',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-c/machineTypes/n2-highcpu-2',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '903032',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n2-highcpu-32',
                      'description': '32 vCPUs 32 GB RAM',
                      'guestCpus': 32,
                      'memoryMb': 32768,
                      'imageSpaceGb': 0,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-central1-c',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-c/machineTypes/n2-highcpu-32',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '903004',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n2-highcpu-4',
                      'description': '4 vCPUs 4 GB RAM',
                      'guestCpus': 4,
                      'memoryMb': 4096,
                      'imageSpaceGb': 0,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-central1-c',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-c/machineTypes/n2-highcpu-4',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '903048',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n2-highcpu-48',
                      'description': '48 vCPUs 48 GB RAM',
                      'guestCpus': 48,
                      'memoryMb': 49152,
                      'imageSpaceGb': 0,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-central1-c',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-c/machineTypes/n2-highcpu-48',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '903064',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n2-highcpu-64',
                      'description': '64 vCPUs 64 GB RAM',
                      'guestCpus': 64,
                      'memoryMb': 65536,
                      'imageSpaceGb': 0,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-central1-c',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-c/machineTypes/n2-highcpu-64',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '903008',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n2-highcpu-8',
                      'description': '8 vCPUs 8 GB RAM',
                      'guestCpus': 8,
                      'memoryMb': 8192,
                      'imageSpaceGb': 0,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-central1-c',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-c/machineTypes/n2-highcpu-8',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '903080',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n2-highcpu-80',
                      'description': '80 vCPUs 80 GB RAM',
                      'guestCpus': 80,
                      'memoryMb': 81920,
                      'imageSpaceGb': 0,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-central1-c',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-c/machineTypes/n2-highcpu-80',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '902016',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n2-highmem-16',
                      'description': '16 vCPUs 128 GB RAM',
                      'guestCpus': 16,
                      'memoryMb': 131072,
                      'imageSpaceGb': 0,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-central1-c',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-c/machineTypes/n2-highmem-16',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '902002',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n2-highmem-2',
                      'description': '2 vCPUs 16 GB RAM',
                      'guestCpus': 2,
                      'memoryMb': 16384,
                      'imageSpaceGb': 0,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-central1-c',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-c/machineTypes/n2-highmem-2',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '902032',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n2-highmem-32',
                      'description': '32 vCPUs 256 GB RAM',
                      'guestCpus': 32,
                      'memoryMb': 262144,
                      'imageSpaceGb': 0,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-central1-c',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-c/machineTypes/n2-highmem-32',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '902004',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n2-highmem-4',
                      'description': '4 vCPUs 32 GB RAM',
                      'guestCpus': 4,
                      'memoryMb': 32768,
                      'imageSpaceGb': 0,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-central1-c',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-c/machineTypes/n2-highmem-4',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '902048',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n2-highmem-48',
                      'description': '48 vCPUs 384 GB RAM',
                      'guestCpus': 48,
                      'memoryMb': 393216,
                      'imageSpaceGb': 0,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-central1-c',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-c/machineTypes/n2-highmem-48',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '902064',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n2-highmem-64',
                      'description': '64 vCPUs 512 GB RAM',
                      'guestCpus': 64,
                      'memoryMb': 524288,
                      'imageSpaceGb': 0,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-central1-c',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-c/machineTypes/n2-highmem-64',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '902008',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n2-highmem-8',
                      'description': '8 vCPUs 64 GB RAM',
                      'guestCpus': 8,
                      'memoryMb': 65536,
                      'imageSpaceGb': 0,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-central1-c',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-c/machineTypes/n2-highmem-8',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '902080',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n2-highmem-80',
                      'description': '80 vCPUs 640 GB RAM',
                      'guestCpus': 80,
                      'memoryMb': 655360,
                      'imageSpaceGb': 0,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-central1-c',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-c/machineTypes/n2-highmem-80',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '901016',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n2-standard-16',
                      'description': '16 vCPUs 64 GB RAM',
                      'guestCpus': 16,
                      'memoryMb': 65536,
                      'imageSpaceGb': 0,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-central1-c',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-c/machineTypes/n2-standard-16',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '901002',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n2-standard-2',
                      'description': '2 vCPUs 8 GB RAM',
                      'guestCpus': 2,
                      'memoryMb': 8192,
                      'imageSpaceGb': 0,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-central1-c',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-c/machineTypes/n2-standard-2',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '901032',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n2-standard-32',
                      'description': '32 vCPUs 128 GB RAM',
                      'guestCpus': 32,
                      'memoryMb': 131072,
                      'imageSpaceGb': 0,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-central1-c',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-c/machineTypes/n2-standard-32',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '901004',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n2-standard-4',
                      'description': '4 vCPUs 16 GB RAM',
                      'guestCpus': 4,
                      'memoryMb': 16384,
                      'imageSpaceGb': 0,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-central1-c',
                      'selfLink': 'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-c/machineTypes/n2-standard-4',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '901048',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n2-standard-48',
                      'description': '48 vCPUs 192 GB RAM',
                      'guestCpus': 48,
                      'memoryMb': 196608,
                      'imageSpaceGb': 0,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-central1-c',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-c/machineTypes/n2-standard-48',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '901064',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n2-standard-64',
                      'description': '64 vCPUs 256 GB RAM',
                      'guestCpus': 64,
                      'memoryMb': 262144,
                      'imageSpaceGb': 0,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-central1-c',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-c/machineTypes/n2-standard-64',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '901008',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n2-standard-8',
                      'description': '8 vCPUs 32 GB RAM',
                      'guestCpus': 8,
                      'memoryMb': 32768,
                      'imageSpaceGb': 0,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-central1-c',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-c/machineTypes/n2-standard-8',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '901080',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n2-standard-80',
                      'description': '80 vCPUs 320 GB RAM',
                      'guestCpus': 80,
                      'memoryMb': 327680,
                      'imageSpaceGb': 0,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-central1-c',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-c/machineTypes/n2-standard-80',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    }
                  ]
                },
            'zones/us-central1-f': {
              'machineTypes': [
                {
                  'id': '1000',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'f1-micro',
                  'description': '1 vCPU (shared physical core) and 0.6 GB RAM',
                  'guestCpus': 1,
                  'memoryMb': 614,
                  'imageSpaceGb': 0,
                  'maximumPersistentDisks': 16,
                  'maximumPersistentDisksSizeGb': '3072',
                  'zone': 'us-central1-f',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-f/machineTypes/f1-micro',
                  'isSharedCpu': true,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '2000',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'g1-small',
                  'description': '1 vCPU (shared physical core) and 1.7 GB RAM',
                  'guestCpus': 1,
                  'memoryMb': 1740,
                  'imageSpaceGb': 0,
                  'maximumPersistentDisks': 16,
                  'maximumPersistentDisksSizeGb': '3072',
                  'zone': 'us-central1-f',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-f/machineTypes/g1-small',
                  'isSharedCpu': true,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '4016',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-highcpu-16',
                  'description': '16 vCPUs, 14.4 GB RAM',
                  'guestCpus': 16,
                  'memoryMb': 14746,
                  'imageSpaceGb': 10,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'us-central1-f',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-f/machineTypes/n1-highcpu-16',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '4002',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-highcpu-2',
                  'description': '2 vCPUs, 1.8 GB RAM',
                  'guestCpus': 2,
                  'memoryMb': 1843,
                  'imageSpaceGb': 10,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'us-central1-f',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-f/machineTypes/n1-highcpu-2',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '4032',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-highcpu-32',
                  'description': '32 vCPUs, 28.8 GB RAM',
                  'guestCpus': 32,
                  'memoryMb': 29491,
                  'imageSpaceGb': 0,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'us-central1-f',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-f/machineTypes/n1-highcpu-32',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '4004',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-highcpu-4',
                  'description': '4 vCPUs, 3.6 GB RAM',
                  'guestCpus': 4,
                  'memoryMb': 3686,
                  'imageSpaceGb': 10,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'us-central1-f',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-f/machineTypes/n1-highcpu-4',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '4064',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-highcpu-64',
                  'description': '64 vCPUs, 57.6 GB RAM',
                  'guestCpus': 64,
                  'memoryMb': 58982,
                  'imageSpaceGb': 0,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'us-central1-f',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-f/machineTypes/n1-highcpu-64',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '4008',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-highcpu-8',
                  'description': '8 vCPUs, 7.2 GB RAM',
                  'guestCpus': 8,
                  'memoryMb': 7373,
                  'imageSpaceGb': 10,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'us-central1-f',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-f/machineTypes/n1-highcpu-8',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '4096',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-highcpu-96',
                  'description': '96 vCPUs, 86 GB RAM',
                  'guestCpus': 96,
                  'memoryMb': 88474,
                  'imageSpaceGb': 0,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'us-central1-f',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-f/machineTypes/n1-highcpu-96',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '5016',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-highmem-16',
                  'description': '16 vCPUs, 104 GB RAM',
                  'guestCpus': 16,
                  'memoryMb': 106496,
                  'imageSpaceGb': 10,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'us-central1-f',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-f/machineTypes/n1-highmem-16',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '5002',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-highmem-2',
                  'description': '2 vCPUs, 13 GB RAM',
                  'guestCpus': 2,
                  'memoryMb': 13312,
                  'imageSpaceGb': 10,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'us-central1-f',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-f/machineTypes/n1-highmem-2',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '5032',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-highmem-32',
                  'description': '32 vCPUs, 208 GB RAM',
                  'guestCpus': 32,
                  'memoryMb': 212992,
                  'imageSpaceGb': 0,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'us-central1-f',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-f/machineTypes/n1-highmem-32',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '5004',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-highmem-4',
                  'description': '4 vCPUs, 26 GB RAM',
                  'guestCpus': 4,
                  'memoryMb': 26624,
                  'imageSpaceGb': 10,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'us-central1-f',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-f/machineTypes/n1-highmem-4',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '5064',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-highmem-64',
                  'description': '64 vCPUs, 416 GB RAM',
                  'guestCpus': 64,
                  'memoryMb': 425984,
                  'imageSpaceGb': 0,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'us-central1-f',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-f/machineTypes/n1-highmem-64',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '5008',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-highmem-8',
                  'description': '8 vCPUs, 52 GB RAM',
                  'guestCpus': 8,
                  'memoryMb': 53248,
                  'imageSpaceGb': 10,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'us-central1-f',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-f/machineTypes/n1-highmem-8',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '5096',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-highmem-96',
                  'description': '96 vCPUs, 624 GB RAM',
                  'guestCpus': 96,
                  'memoryMb': 638976,
                  'imageSpaceGb': 0,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'us-central1-f',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-f/machineTypes/n1-highmem-96',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '3001',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-standard-1',
                  'description': '1 vCPU, 3.75 GB RAM',
                  'guestCpus': 1,
                  'memoryMb': 3840,
                  'imageSpaceGb': 10,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'us-central1-f',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-f/machineTypes/n1-standard-1',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '3016',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-standard-16',
                  'description': '16 vCPUs, 60 GB RAM',
                  'guestCpus': 16,
                  'memoryMb': 61440,
                  'imageSpaceGb': 10,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'us-central1-f',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-f/machineTypes/n1-standard-16',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '3002',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-standard-2',
                  'description': '2 vCPUs, 7.5 GB RAM',
                  'guestCpus': 2,
                  'memoryMb': 7680,
                  'imageSpaceGb': 10,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'us-central1-f',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-f/machineTypes/n1-standard-2',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '3032',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-standard-32',
                  'description': '32 vCPUs, 120 GB RAM',
                  'guestCpus': 32,
                  'memoryMb': 122880,
                  'imageSpaceGb': 0,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'us-central1-f',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-f/machineTypes/n1-standard-32',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '3004',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-standard-4',
                  'description': '4 vCPUs, 15 GB RAM',
                  'guestCpus': 4,
                  'memoryMb': 15360,
                  'imageSpaceGb': 10,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'us-central1-f',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-f/machineTypes/n1-standard-4',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '3064',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-standard-64',
                  'description': '64 vCPUs, 240 GB RAM',
                  'guestCpus': 64,
                  'memoryMb': 245760,
                  'imageSpaceGb': 0,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'us-central1-f',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-f/machineTypes/n1-standard-64',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '3008',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-standard-8',
                  'description': '8 vCPUs, 30 GB RAM',
                  'guestCpus': 8,
                  'memoryMb': 30720,
                  'imageSpaceGb': 10,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'us-central1-f',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-f/machineTypes/n1-standard-8',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '3096',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-standard-96',
                  'description': '96 vCPUs, 360 GB RAM',
                  'guestCpus': 96,
                  'memoryMb': 368640,
                  'imageSpaceGb': 0,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'us-central1-f',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-central1-f/machineTypes/n1-standard-96',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                }
              ]
            },
            'zones/europe-west1-b':
                {
                  'machineTypes':
                      [
                        {
                          'id': '1000',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'f1-micro',
                          'description':
                              '1 vCPU (shared physical core) and 0.6 GB RAM',
                          'guestCpus': 1,
                          'memoryMb': 614,
                          'imageSpaceGb': 0,
                          'maximumPersistentDisks': 16,
                          'maximumPersistentDisksSizeGb': '3072',
                          'zone': 'europe-west1-b',
                          'selfLink': 'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west1-b/machineTypes/f1-micro',
                          'isSharedCpu': true,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '2000',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'g1-small',
                          'description':
                              '1 vCPU (shared physical core) and 1.7 GB RAM',
                          'guestCpus': 1,
                          'memoryMb': 1740,
                          'imageSpaceGb': 0,
                          'maximumPersistentDisks': 16,
                          'maximumPersistentDisksSizeGb': '3072',
                          'zone': 'europe-west1-b',
                          'selfLink': 'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west1-b/machineTypes/g1-small',
                          'isSharedCpu': true,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '9196',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'm1-megamem-96',
                          'description': '96 vCPUs, 1.4 TB RAM',
                          'guestCpus': 96,
                          'memoryMb': 1468006,
                          'imageSpaceGb': 0,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'europe-west1-b',
                          'selfLink': 'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west1-b/machineTypes/m1-megamem-96',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '11160',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'm1-ultramem-160',
                          'description': '160 vCPUs, 3844 GB RAM',
                          'guestCpus': 160,
                          'memoryMb': 3936256,
                          'imageSpaceGb': 0,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'europe-west1-b',
                          'selfLink': 'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west1-b/machineTypes/m1-ultramem-160',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '11040',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'm1-ultramem-40',
                          'description': '40 vCPUs, 961 GB RAM',
                          'guestCpus': 40,
                          'memoryMb': 984064,
                          'imageSpaceGb': 0,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'europe-west1-b',
                          'selfLink': 'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west1-b/machineTypes/m1-ultramem-40',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '11080',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'm1-ultramem-80',
                          'description': '80 vCPUs, 1922 GB RAM',
                          'guestCpus': 80,
                          'memoryMb': 1968128,
                          'imageSpaceGb': 0,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'europe-west1-b',
                          'selfLink': 'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west1-b/machineTypes/m1-ultramem-80',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '4016',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n1-highcpu-16',
                          'description': '16 vCPUs, 14.4 GB RAM',
                          'guestCpus': 16,
                          'memoryMb': 14746,
                          'imageSpaceGb': 10,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'europe-west1-b',
                          'selfLink': 'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west1-b/machineTypes/n1-highcpu-16',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '4002',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n1-highcpu-2',
                          'description': '2 vCPUs, 1.8 GB RAM',
                          'guestCpus': 2,
                          'memoryMb': 1843,
                          'imageSpaceGb': 10,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'europe-west1-b',
                          'selfLink': 'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west1-b/machineTypes/n1-highcpu-2',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '4032',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n1-highcpu-32',
                          'description': '32 vCPUs, 28.8 GB RAM',
                          'guestCpus': 32,
                          'memoryMb': 29491,
                          'imageSpaceGb': 0,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'europe-west1-b',
                          'selfLink': 'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west1-b/machineTypes/n1-highcpu-32',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '4004',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n1-highcpu-4',
                          'description': '4 vCPUs, 3.6 GB RAM',
                          'guestCpus': 4,
                          'memoryMb': 3686,
                          'imageSpaceGb': 10,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'europe-west1-b',
                          'selfLink': 'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west1-b/machineTypes/n1-highcpu-4',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '4064',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n1-highcpu-64',
                          'description': '64 vCPUs, 57.6 GB RAM',
                          'guestCpus': 64,
                          'memoryMb': 58982,
                          'imageSpaceGb': 0,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'europe-west1-b',
                          'selfLink': 'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west1-b/machineTypes/n1-highcpu-64',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '4008',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n1-highcpu-8',
                          'description': '8 vCPUs, 7.2 GB RAM',
                          'guestCpus': 8,
                          'memoryMb': 7373,
                          'imageSpaceGb': 10,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'europe-west1-b',
                          'selfLink': 'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west1-b/machineTypes/n1-highcpu-8',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '4096',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n1-highcpu-96',
                          'description': '96 vCPUs, 86 GB RAM',
                          'guestCpus': 96,
                          'memoryMb': 88474,
                          'imageSpaceGb': 0,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'europe-west1-b',
                          'selfLink': 'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west1-b/machineTypes/n1-highcpu-96',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '5016',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n1-highmem-16',
                          'description': '16 vCPUs, 104 GB RAM',
                          'guestCpus': 16,
                          'memoryMb': 106496,
                          'imageSpaceGb': 10,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'europe-west1-b',
                          'selfLink': 'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west1-b/machineTypes/n1-highmem-16',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '5002',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n1-highmem-2',
                          'description': '2 vCPUs, 13 GB RAM',
                          'guestCpus': 2,
                          'memoryMb': 13312,
                          'imageSpaceGb': 10,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'europe-west1-b',
                          'selfLink':
                              'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west1-b/machineTypes/n1-highmem-2',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '5032',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n1-highmem-32',
                          'description': '32 vCPUs, 208 GB RAM',
                          'guestCpus': 32,
                          'memoryMb': 212992,
                          'imageSpaceGb': 0,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'europe-west1-b',
                          'selfLink':
                              'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west1-b/machineTypes/n1-highmem-32',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '5004',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n1-highmem-4',
                          'description': '4 vCPUs, 26 GB RAM',
                          'guestCpus': 4,
                          'memoryMb': 26624,
                          'imageSpaceGb': 10,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'europe-west1-b',
                          'selfLink':
                              'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west1-b/machineTypes/n1-highmem-4',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '5064',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n1-highmem-64',
                          'description': '64 vCPUs, 416 GB RAM',
                          'guestCpus': 64,
                          'memoryMb': 425984,
                          'imageSpaceGb': 0,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'europe-west1-b',
                          'selfLink':
                              'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west1-b/machineTypes/n1-highmem-64',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '5008',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n1-highmem-8',
                          'description': '8 vCPUs, 52 GB RAM',
                          'guestCpus': 8,
                          'memoryMb': 53248,
                          'imageSpaceGb': 10,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'europe-west1-b',
                          'selfLink':
                              'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west1-b/machineTypes/n1-highmem-8',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '5096',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n1-highmem-96',
                          'description': '96 vCPUs, 624 GB RAM',
                          'guestCpus': 96,
                          'memoryMb': 638976,
                          'imageSpaceGb': 0,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'europe-west1-b',
                          'selfLink':
                              'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west1-b/machineTypes/n1-highmem-96',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '9096',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n1-megamem-96',
                          'description': '96 vCPUs, 1.4 TB RAM',
                          'guestCpus': 96,
                          'memoryMb': 1468006,
                          'imageSpaceGb': 0,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'europe-west1-b',
                          'selfLink':
                              'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west1-b/machineTypes/n1-megamem-96',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '3001',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n1-standard-1',
                          'description': '1 vCPU, 3.75 GB RAM',
                          'guestCpus': 1,
                          'memoryMb': 3840,
                          'imageSpaceGb': 10,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'europe-west1-b',
                          'selfLink':
                              'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west1-b/machineTypes/n1-standard-1',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '3016',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n1-standard-16',
                          'description': '16 vCPUs, 60 GB RAM',
                          'guestCpus': 16,
                          'memoryMb': 61440,
                          'imageSpaceGb': 10,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'europe-west1-b',
                          'selfLink':
                              'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west1-b/machineTypes/n1-standard-16',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '3002',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n1-standard-2',
                          'description': '2 vCPUs, 7.5 GB RAM',
                          'guestCpus': 2,
                          'memoryMb': 7680,
                          'imageSpaceGb': 10,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'europe-west1-b',
                          'selfLink':
                              'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west1-b/machineTypes/n1-standard-2',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '3032',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n1-standard-32',
                          'description': '32 vCPUs, 120 GB RAM',
                          'guestCpus': 32,
                          'memoryMb': 122880,
                          'imageSpaceGb': 0,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'europe-west1-b',
                          'selfLink':
                              'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west1-b/machineTypes/n1-standard-32',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '3004',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n1-standard-4',
                          'description': '4 vCPUs, 15 GB RAM',
                          'guestCpus': 4,
                          'memoryMb': 15360,
                          'imageSpaceGb': 10,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'europe-west1-b',
                          'selfLink':
                              'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west1-b/machineTypes/n1-standard-4',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '3064',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n1-standard-64',
                          'description': '64 vCPUs, 240 GB RAM',
                          'guestCpus': 64,
                          'memoryMb': 245760,
                          'imageSpaceGb': 0,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'europe-west1-b',
                          'selfLink':
                              'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west1-b/machineTypes/n1-standard-64',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '3008',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n1-standard-8',
                          'description': '8 vCPUs, 30 GB RAM',
                          'guestCpus': 8,
                          'memoryMb': 30720,
                          'imageSpaceGb': 10,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'europe-west1-b',
                          'selfLink':
                              'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west1-b/machineTypes/n1-standard-8',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '3096',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n1-standard-96',
                          'description': '96 vCPUs, 360 GB RAM',
                          'guestCpus': 96,
                          'memoryMb': 368640,
                          'imageSpaceGb': 0,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'europe-west1-b',
                          'selfLink':
                              'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west1-b/machineTypes/n1-standard-96',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '10160',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n1-ultramem-160',
                          'description': '160 vCPUs, 3844 GB RAM',
                          'guestCpus': 160,
                          'memoryMb': 3936256,
                          'imageSpaceGb': 0,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'europe-west1-b',
                          'selfLink':
                              'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west1-b/machineTypes/n1-ultramem-160',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '10040',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n1-ultramem-40',
                          'description': '40 vCPUs, 961 GB RAM',
                          'guestCpus': 40,
                          'memoryMb': 984064,
                          'imageSpaceGb': 0,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'europe-west1-b',
                          'selfLink':
                              'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west1-b/machineTypes/n1-ultramem-40',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '10080',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n1-ultramem-80',
                          'description': '80 vCPUs, 1922 GB RAM',
                          'guestCpus': 80,
                          'memoryMb': 1968128,
                          'imageSpaceGb': 0,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'europe-west1-b',
                          'selfLink':
                              'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west1-b/machineTypes/n1-ultramem-80',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        }
                      ]
                },
            'zones/europe-west1-c': {
              'machineTypes': [
                {
                  'id': '1000',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'f1-micro',
                  'description': '1 vCPU (shared physical core) and 0.6 GB RAM',
                  'guestCpus': 1,
                  'memoryMb': 614,
                  'imageSpaceGb': 0,
                  'maximumPersistentDisks': 16,
                  'maximumPersistentDisksSizeGb': '3072',
                  'zone': 'europe-west1-c',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west1-c/machineTypes/f1-micro',
                  'isSharedCpu': true,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '2000',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'g1-small',
                  'description': '1 vCPU (shared physical core) and 1.7 GB RAM',
                  'guestCpus': 1,
                  'memoryMb': 1740,
                  'imageSpaceGb': 0,
                  'maximumPersistentDisks': 16,
                  'maximumPersistentDisksSizeGb': '3072',
                  'zone': 'europe-west1-c',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west1-c/machineTypes/g1-small',
                  'isSharedCpu': true,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '4016',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-highcpu-16',
                  'description': '16 vCPUs, 14.4 GB RAM',
                  'guestCpus': 16,
                  'memoryMb': 14746,
                  'imageSpaceGb': 10,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'europe-west1-c',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west1-c/machineTypes/n1-highcpu-16',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '4002',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-highcpu-2',
                  'description': '2 vCPUs, 1.8 GB RAM',
                  'guestCpus': 2,
                  'memoryMb': 1843,
                  'imageSpaceGb': 10,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'europe-west1-c',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west1-c/machineTypes/n1-highcpu-2',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '4032',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-highcpu-32',
                  'description': '32 vCPUs, 28.8 GB RAM',
                  'guestCpus': 32,
                  'memoryMb': 29491,
                  'imageSpaceGb': 0,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'europe-west1-c',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west1-c/machineTypes/n1-highcpu-32',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '4004',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-highcpu-4',
                  'description': '4 vCPUs, 3.6 GB RAM',
                  'guestCpus': 4,
                  'memoryMb': 3686,
                  'imageSpaceGb': 10,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'europe-west1-c',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west1-c/machineTypes/n1-highcpu-4',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '4064',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-highcpu-64',
                  'description': '64 vCPUs, 57.6 GB RAM',
                  'guestCpus': 64,
                  'memoryMb': 58982,
                  'imageSpaceGb': 0,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'europe-west1-c',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west1-c/machineTypes/n1-highcpu-64',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '4008',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-highcpu-8',
                  'description': '8 vCPUs, 7.2 GB RAM',
                  'guestCpus': 8,
                  'memoryMb': 7373,
                  'imageSpaceGb': 10,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'europe-west1-c',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west1-c/machineTypes/n1-highcpu-8',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '4096',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-highcpu-96',
                  'description': '96 vCPUs, 86 GB RAM',
                  'guestCpus': 96,
                  'memoryMb': 88474,
                  'imageSpaceGb': 0,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'europe-west1-c',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west1-c/machineTypes/n1-highcpu-96',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '5016',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-highmem-16',
                  'description': '16 vCPUs, 104 GB RAM',
                  'guestCpus': 16,
                  'memoryMb': 106496,
                  'imageSpaceGb': 10,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'europe-west1-c',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west1-c/machineTypes/n1-highmem-16',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '5002',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-highmem-2',
                  'description': '2 vCPUs, 13 GB RAM',
                  'guestCpus': 2,
                  'memoryMb': 13312,
                  'imageSpaceGb': 10,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'europe-west1-c',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west1-c/machineTypes/n1-highmem-2',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '5032',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-highmem-32',
                  'description': '32 vCPUs, 208 GB RAM',
                  'guestCpus': 32,
                  'memoryMb': 212992,
                  'imageSpaceGb': 0,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'europe-west1-c',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west1-c/machineTypes/n1-highmem-32',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '5004',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-highmem-4',
                  'description': '4 vCPUs, 26 GB RAM',
                  'guestCpus': 4,
                  'memoryMb': 26624,
                  'imageSpaceGb': 10,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'europe-west1-c',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west1-c/machineTypes/n1-highmem-4',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '5064',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-highmem-64',
                  'description': '64 vCPUs, 416 GB RAM',
                  'guestCpus': 64,
                  'memoryMb': 425984,
                  'imageSpaceGb': 0,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'europe-west1-c',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west1-c/machineTypes/n1-highmem-64',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '5008',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-highmem-8',
                  'description': '8 vCPUs, 52 GB RAM',
                  'guestCpus': 8,
                  'memoryMb': 53248,
                  'imageSpaceGb': 10,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'europe-west1-c',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west1-c/machineTypes/n1-highmem-8',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '5096',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-highmem-96',
                  'description': '96 vCPUs, 624 GB RAM',
                  'guestCpus': 96,
                  'memoryMb': 638976,
                  'imageSpaceGb': 0,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'europe-west1-c',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west1-c/machineTypes/n1-highmem-96',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '3001',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-standard-1',
                  'description': '1 vCPU, 3.75 GB RAM',
                  'guestCpus': 1,
                  'memoryMb': 3840,
                  'imageSpaceGb': 10,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'europe-west1-c',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west1-c/machineTypes/n1-standard-1',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '3016',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-standard-16',
                  'description': '16 vCPUs, 60 GB RAM',
                  'guestCpus': 16,
                  'memoryMb': 61440,
                  'imageSpaceGb': 10,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'europe-west1-c',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west1-c/machineTypes/n1-standard-16',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '3002',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-standard-2',
                  'description': '2 vCPUs, 7.5 GB RAM',
                  'guestCpus': 2,
                  'memoryMb': 7680,
                  'imageSpaceGb': 10,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'europe-west1-c',
                  'selfLink': 'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west1-c/machineTypes/n1-standard-2',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '3032',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-standard-32',
                  'description': '32 vCPUs, 120 GB RAM',
                  'guestCpus': 32,
                  'memoryMb': 122880,
                  'imageSpaceGb': 0,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'europe-west1-c',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west1-c/machineTypes/n1-standard-32',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '3004',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-standard-4',
                  'description': '4 vCPUs, 15 GB RAM',
                  'guestCpus': 4,
                  'memoryMb': 15360,
                  'imageSpaceGb': 10,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'europe-west1-c',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west1-c/machineTypes/n1-standard-4',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '3064',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-standard-64',
                  'description': '64 vCPUs, 240 GB RAM',
                  'guestCpus': 64,
                  'memoryMb': 245760,
                  'imageSpaceGb': 0,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'europe-west1-c',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west1-c/machineTypes/n1-standard-64',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '3008',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-standard-8',
                  'description': '8 vCPUs, 30 GB RAM',
                  'guestCpus': 8,
                  'memoryMb': 30720,
                  'imageSpaceGb': 10,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'europe-west1-c',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west1-c/machineTypes/n1-standard-8',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '3096',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-standard-96',
                  'description': '96 vCPUs, 360 GB RAM',
                  'guestCpus': 96,
                  'memoryMb': 368640,
                  'imageSpaceGb': 0,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'europe-west1-c',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west1-c/machineTypes/n1-standard-96',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                }
              ]
            },
            'zones/europe-west1-d': {
              'machineTypes': [
                {
                  'id': '1000',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'f1-micro',
                  'description': '1 vCPU (shared physical core) and 0.6 GB RAM',
                  'guestCpus': 1,
                  'memoryMb': 614,
                  'imageSpaceGb': 0,
                  'maximumPersistentDisks': 16,
                  'maximumPersistentDisksSizeGb': '3072',
                  'zone': 'europe-west1-d',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west1-d/machineTypes/f1-micro',
                  'isSharedCpu': true,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '2000',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'g1-small',
                  'description': '1 vCPU (shared physical core) and 1.7 GB RAM',
                  'guestCpus': 1,
                  'memoryMb': 1740,
                  'imageSpaceGb': 0,
                  'maximumPersistentDisks': 16,
                  'maximumPersistentDisksSizeGb': '3072',
                  'zone': 'europe-west1-d',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west1-d/machineTypes/g1-small',
                  'isSharedCpu': true,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '9196',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'm1-megamem-96',
                  'description': '96 vCPUs, 1.4 TB RAM',
                  'guestCpus': 96,
                  'memoryMb': 1468006,
                  'imageSpaceGb': 0,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'europe-west1-d',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west1-d/machineTypes/m1-megamem-96',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '11160',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'm1-ultramem-160',
                  'description': '160 vCPUs, 3844 GB RAM',
                  'guestCpus': 160,
                  'memoryMb': 3936256,
                  'imageSpaceGb': 0,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'europe-west1-d',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west1-d/machineTypes/m1-ultramem-160',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '11040',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'm1-ultramem-40',
                  'description': '40 vCPUs, 961 GB RAM',
                  'guestCpus': 40,
                  'memoryMb': 984064,
                  'imageSpaceGb': 0,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'europe-west1-d',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west1-d/machineTypes/m1-ultramem-40',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '11080',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'm1-ultramem-80',
                  'description': '80 vCPUs, 1922 GB RAM',
                  'guestCpus': 80,
                  'memoryMb': 1968128,
                  'imageSpaceGb': 0,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'europe-west1-d',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west1-d/machineTypes/m1-ultramem-80',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '4016',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-highcpu-16',
                  'description': '16 vCPUs, 14.4 GB RAM',
                  'guestCpus': 16,
                  'memoryMb': 14746,
                  'imageSpaceGb': 10,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'europe-west1-d',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west1-d/machineTypes/n1-highcpu-16',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '4002',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-highcpu-2',
                  'description': '2 vCPUs, 1.8 GB RAM',
                  'guestCpus': 2,
                  'memoryMb': 1843,
                  'imageSpaceGb': 10,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'europe-west1-d',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west1-d/machineTypes/n1-highcpu-2',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '4032',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-highcpu-32',
                  'description': '32 vCPUs, 28.8 GB RAM',
                  'guestCpus': 32,
                  'memoryMb': 29491,
                  'imageSpaceGb': 0,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'europe-west1-d',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west1-d/machineTypes/n1-highcpu-32',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '4004',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-highcpu-4',
                  'description': '4 vCPUs, 3.6 GB RAM',
                  'guestCpus': 4,
                  'memoryMb': 3686,
                  'imageSpaceGb': 10,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'europe-west1-d',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west1-d/machineTypes/n1-highcpu-4',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '4064',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-highcpu-64',
                  'description': '64 vCPUs, 57.6 GB RAM',
                  'guestCpus': 64,
                  'memoryMb': 58982,
                  'imageSpaceGb': 0,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'europe-west1-d',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west1-d/machineTypes/n1-highcpu-64',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '4008',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-highcpu-8',
                  'description': '8 vCPUs, 7.2 GB RAM',
                  'guestCpus': 8,
                  'memoryMb': 7373,
                  'imageSpaceGb': 10,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'europe-west1-d',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west1-d/machineTypes/n1-highcpu-8',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '4096',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-highcpu-96',
                  'description': '96 vCPUs, 86 GB RAM',
                  'guestCpus': 96,
                  'memoryMb': 88474,
                  'imageSpaceGb': 0,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'europe-west1-d',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west1-d/machineTypes/n1-highcpu-96',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '5016',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-highmem-16',
                  'description': '16 vCPUs, 104 GB RAM',
                  'guestCpus': 16,
                  'memoryMb': 106496,
                  'imageSpaceGb': 10,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'europe-west1-d',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west1-d/machineTypes/n1-highmem-16',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '5002',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-highmem-2',
                  'description': '2 vCPUs, 13 GB RAM',
                  'guestCpus': 2,
                  'memoryMb': 13312,
                  'imageSpaceGb': 10,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'europe-west1-d',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west1-d/machineTypes/n1-highmem-2',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '5032',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-highmem-32',
                  'description': '32 vCPUs, 208 GB RAM',
                  'guestCpus': 32,
                  'memoryMb': 212992,
                  'imageSpaceGb': 0,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'europe-west1-d',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west1-d/machineTypes/n1-highmem-32',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '5004',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-highmem-4',
                  'description': '4 vCPUs, 26 GB RAM',
                  'guestCpus': 4,
                  'memoryMb': 26624,
                  'imageSpaceGb': 10,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'europe-west1-d',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west1-d/machineTypes/n1-highmem-4',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '5064',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-highmem-64',
                  'description': '64 vCPUs, 416 GB RAM',
                  'guestCpus': 64,
                  'memoryMb': 425984,
                  'imageSpaceGb': 0,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'europe-west1-d',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west1-d/machineTypes/n1-highmem-64',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '5008',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-highmem-8',
                  'description': '8 vCPUs, 52 GB RAM',
                  'guestCpus': 8,
                  'memoryMb': 53248,
                  'imageSpaceGb': 10,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'europe-west1-d',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west1-d/machineTypes/n1-highmem-8',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '5096',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-highmem-96',
                  'description': '96 vCPUs, 624 GB RAM',
                  'guestCpus': 96,
                  'memoryMb': 638976,
                  'imageSpaceGb': 0,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'europe-west1-d',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west1-d/machineTypes/n1-highmem-96',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '9096',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-megamem-96',
                  'description': '96 vCPUs, 1.4 TB RAM',
                  'guestCpus': 96,
                  'memoryMb': 1468006,
                  'imageSpaceGb': 0,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'europe-west1-d',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west1-d/machineTypes/n1-megamem-96',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '3001',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-standard-1',
                  'description': '1 vCPU, 3.75 GB RAM',
                  'guestCpus': 1,
                  'memoryMb': 3840,
                  'imageSpaceGb': 10,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'europe-west1-d',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west1-d/machineTypes/n1-standard-1',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '3016',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-standard-16',
                  'description': '16 vCPUs, 60 GB RAM',
                  'guestCpus': 16,
                  'memoryMb': 61440,
                  'imageSpaceGb': 10,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'europe-west1-d',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west1-d/machineTypes/n1-standard-16',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '3002',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-standard-2',
                  'description': '2 vCPUs, 7.5 GB RAM',
                  'guestCpus': 2,
                  'memoryMb': 7680,
                  'imageSpaceGb': 10,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'europe-west1-d',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west1-d/machineTypes/n1-standard-2',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '3032',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-standard-32',
                  'description': '32 vCPUs, 120 GB RAM',
                  'guestCpus': 32,
                  'memoryMb': 122880,
                  'imageSpaceGb': 0,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'europe-west1-d',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west1-d/machineTypes/n1-standard-32',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '3004',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-standard-4',
                  'description': '4 vCPUs, 15 GB RAM',
                  'guestCpus': 4,
                  'memoryMb': 15360,
                  'imageSpaceGb': 10,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'europe-west1-d',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west1-d/machineTypes/n1-standard-4',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '3064',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-standard-64',
                  'description': '64 vCPUs, 240 GB RAM',
                  'guestCpus': 64,
                  'memoryMb': 245760,
                  'imageSpaceGb': 0,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'europe-west1-d',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west1-d/machineTypes/n1-standard-64',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '3008',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-standard-8',
                  'description': '8 vCPUs, 30 GB RAM',
                  'guestCpus': 8,
                  'memoryMb': 30720,
                  'imageSpaceGb': 10,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'europe-west1-d',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west1-d/machineTypes/n1-standard-8',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '3096',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-standard-96',
                  'description': '96 vCPUs, 360 GB RAM',
                  'guestCpus': 96,
                  'memoryMb': 368640,
                  'imageSpaceGb': 0,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'europe-west1-d',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west1-d/machineTypes/n1-standard-96',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '10160',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-ultramem-160',
                  'description': '160 vCPUs, 3844 GB RAM',
                  'guestCpus': 160,
                  'memoryMb': 3936256,
                  'imageSpaceGb': 0,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'europe-west1-d',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west1-d/machineTypes/n1-ultramem-160',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '10040',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-ultramem-40',
                  'description': '40 vCPUs, 961 GB RAM',
                  'guestCpus': 40,
                  'memoryMb': 984064,
                  'imageSpaceGb': 0,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'europe-west1-d',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west1-d/machineTypes/n1-ultramem-40',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '10080',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-ultramem-80',
                  'description': '80 vCPUs, 1922 GB RAM',
                  'guestCpus': 80,
                  'memoryMb': 1968128,
                  'imageSpaceGb': 0,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'europe-west1-d',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/europe-west1-d/machineTypes/n1-ultramem-80',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                }
              ]
            },
            'zones/us-west1-a':
                {
                  'machineTypes': [
                    {
                      'id': '1000',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'f1-micro',
                      'description':
                          '1 vCPU (shared physical core) and 0.6 GB RAM',
                      'guestCpus': 1,
                      'memoryMb': 614,
                      'imageSpaceGb': 0,
                      'maximumPersistentDisks': 16,
                      'maximumPersistentDisksSizeGb': '3072',
                      'zone': 'us-west1-a',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west1-a/machineTypes/f1-micro',
                      'isSharedCpu': true,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '2000',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'g1-small',
                      'description':
                          '1 vCPU (shared physical core) and 1.7 GB RAM',
                      'guestCpus': 1,
                      'memoryMb': 1740,
                      'imageSpaceGb': 0,
                      'maximumPersistentDisks': 16,
                      'maximumPersistentDisksSizeGb': '3072',
                      'zone': 'us-west1-a',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west1-a/machineTypes/g1-small',
                      'isSharedCpu': true,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '9196',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'm1-megamem-96',
                      'description': '96 vCPUs, 1.4 TB RAM',
                      'guestCpus': 96,
                      'memoryMb': 1468006,
                      'imageSpaceGb': 0,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-west1-a',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west1-a/machineTypes/m1-megamem-96',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '11160',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'm1-ultramem-160',
                      'description': '160 vCPUs, 3844 GB RAM',
                      'guestCpus': 160,
                      'memoryMb': 3936256,
                      'imageSpaceGb': 0,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-west1-a',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west1-a/machineTypes/m1-ultramem-160',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '11040',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'm1-ultramem-40',
                      'description': '40 vCPUs, 961 GB RAM',
                      'guestCpus': 40,
                      'memoryMb': 984064,
                      'imageSpaceGb': 0,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-west1-a',
                      'selfLink': 'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west1-a/machineTypes/m1-ultramem-40',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '11080',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'm1-ultramem-80',
                      'description': '80 vCPUs, 1922 GB RAM',
                      'guestCpus': 80,
                      'memoryMb': 1968128,
                      'imageSpaceGb': 0,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-west1-a',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west1-a/machineTypes/m1-ultramem-80',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '4016',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n1-highcpu-16',
                      'description': '16 vCPUs, 14.4 GB RAM',
                      'guestCpus': 16,
                      'memoryMb': 14746,
                      'imageSpaceGb': 10,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-west1-a',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west1-a/machineTypes/n1-highcpu-16',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '4002',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n1-highcpu-2',
                      'description': '2 vCPUs, 1.8 GB RAM',
                      'guestCpus': 2,
                      'memoryMb': 1843,
                      'imageSpaceGb': 10,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-west1-a',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west1-a/machineTypes/n1-highcpu-2',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '4032',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n1-highcpu-32',
                      'description': '32 vCPUs, 28.8 GB RAM',
                      'guestCpus': 32,
                      'memoryMb': 29491,
                      'imageSpaceGb': 0,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-west1-a',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west1-a/machineTypes/n1-highcpu-32',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '4004',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n1-highcpu-4',
                      'description': '4 vCPUs, 3.6 GB RAM',
                      'guestCpus': 4,
                      'memoryMb': 3686,
                      'imageSpaceGb': 10,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-west1-a',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west1-a/machineTypes/n1-highcpu-4',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '4064',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n1-highcpu-64',
                      'description': '64 vCPUs, 57.6 GB RAM',
                      'guestCpus': 64,
                      'memoryMb': 58982,
                      'imageSpaceGb': 0,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-west1-a',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west1-a/machineTypes/n1-highcpu-64',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '4008',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n1-highcpu-8',
                      'description': '8 vCPUs, 7.2 GB RAM',
                      'guestCpus': 8,
                      'memoryMb': 7373,
                      'imageSpaceGb': 10,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-west1-a',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west1-a/machineTypes/n1-highcpu-8',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '4096',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n1-highcpu-96',
                      'description': '96 vCPUs, 86 GB RAM',
                      'guestCpus': 96,
                      'memoryMb': 88474,
                      'imageSpaceGb': 0,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-west1-a',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west1-a/machineTypes/n1-highcpu-96',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '5016',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n1-highmem-16',
                      'description': '16 vCPUs, 104 GB RAM',
                      'guestCpus': 16,
                      'memoryMb': 106496,
                      'imageSpaceGb': 10,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-west1-a',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west1-a/machineTypes/n1-highmem-16',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '5002',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n1-highmem-2',
                      'description': '2 vCPUs, 13 GB RAM',
                      'guestCpus': 2,
                      'memoryMb': 13312,
                      'imageSpaceGb': 10,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-west1-a',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west1-a/machineTypes/n1-highmem-2',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '5032',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n1-highmem-32',
                      'description': '32 vCPUs, 208 GB RAM',
                      'guestCpus': 32,
                      'memoryMb': 212992,
                      'imageSpaceGb': 0,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-west1-a',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west1-a/machineTypes/n1-highmem-32',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '5004',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n1-highmem-4',
                      'description': '4 vCPUs, 26 GB RAM',
                      'guestCpus': 4,
                      'memoryMb': 26624,
                      'imageSpaceGb': 10,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-west1-a',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west1-a/machineTypes/n1-highmem-4',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '5064',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n1-highmem-64',
                      'description': '64 vCPUs, 416 GB RAM',
                      'guestCpus': 64,
                      'memoryMb': 425984,
                      'imageSpaceGb': 0,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-west1-a',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west1-a/machineTypes/n1-highmem-64',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '5008',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n1-highmem-8',
                      'description': '8 vCPUs, 52 GB RAM',
                      'guestCpus': 8,
                      'memoryMb': 53248,
                      'imageSpaceGb': 10,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-west1-a',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west1-a/machineTypes/n1-highmem-8',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '5096',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n1-highmem-96',
                      'description': '96 vCPUs, 624 GB RAM',
                      'guestCpus': 96,
                      'memoryMb': 638976,
                      'imageSpaceGb': 0,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-west1-a',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west1-a/machineTypes/n1-highmem-96',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '9096',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n1-megamem-96',
                      'description': '96 vCPUs, 1.4 TB RAM',
                      'guestCpus': 96,
                      'memoryMb': 1468006,
                      'imageSpaceGb': 0,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-west1-a',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west1-a/machineTypes/n1-megamem-96',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '3001',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n1-standard-1',
                      'description': '1 vCPU, 3.75 GB RAM',
                      'guestCpus': 1,
                      'memoryMb': 3840,
                      'imageSpaceGb': 10,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-west1-a',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west1-a/machineTypes/n1-standard-1',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '3016',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n1-standard-16',
                      'description': '16 vCPUs, 60 GB RAM',
                      'guestCpus': 16,
                      'memoryMb': 61440,
                      'imageSpaceGb': 10,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-west1-a',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west1-a/machineTypes/n1-standard-16',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '3002',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n1-standard-2',
                      'description': '2 vCPUs, 7.5 GB RAM',
                      'guestCpus': 2,
                      'memoryMb': 7680,
                      'imageSpaceGb': 10,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-west1-a',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west1-a/machineTypes/n1-standard-2',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '3032',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n1-standard-32',
                      'description': '32 vCPUs, 120 GB RAM',
                      'guestCpus': 32,
                      'memoryMb': 122880,
                      'imageSpaceGb': 0,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-west1-a',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west1-a/machineTypes/n1-standard-32',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '3004',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n1-standard-4',
                      'description': '4 vCPUs, 15 GB RAM',
                      'guestCpus': 4,
                      'memoryMb': 15360,
                      'imageSpaceGb': 10,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-west1-a',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west1-a/machineTypes/n1-standard-4',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '3064',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n1-standard-64',
                      'description': '64 vCPUs, 240 GB RAM',
                      'guestCpus': 64,
                      'memoryMb': 245760,
                      'imageSpaceGb': 0,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-west1-a',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west1-a/machineTypes/n1-standard-64',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '3008',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n1-standard-8',
                      'description': '8 vCPUs, 30 GB RAM',
                      'guestCpus': 8,
                      'memoryMb': 30720,
                      'imageSpaceGb': 10,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-west1-a',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west1-a/machineTypes/n1-standard-8',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '3096',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n1-standard-96',
                      'description': '96 vCPUs, 360 GB RAM',
                      'guestCpus': 96,
                      'memoryMb': 368640,
                      'imageSpaceGb': 0,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-west1-a',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west1-a/machineTypes/n1-standard-96',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '10160',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n1-ultramem-160',
                      'description': '160 vCPUs, 3844 GB RAM',
                      'guestCpus': 160,
                      'memoryMb': 3936256,
                      'imageSpaceGb': 0,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-west1-a',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west1-a/machineTypes/n1-ultramem-160',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '10040',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n1-ultramem-40',
                      'description': '40 vCPUs, 961 GB RAM',
                      'guestCpus': 40,
                      'memoryMb': 984064,
                      'imageSpaceGb': 0,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-west1-a',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west1-a/machineTypes/n1-ultramem-40',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '10080',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n1-ultramem-80',
                      'description': '80 vCPUs, 1922 GB RAM',
                      'guestCpus': 80,
                      'memoryMb': 1968128,
                      'imageSpaceGb': 0,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-west1-a',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west1-a/machineTypes/n1-ultramem-80',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    }
                  ]
                },
            'zones/us-west1-b':
                {
                  'machineTypes': [
                    {
                      'id': '1000',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'f1-micro',
                      'description':
                          '1 vCPU (shared physical core) and 0.6 GB RAM',
                      'guestCpus': 1,
                      'memoryMb': 614,
                      'imageSpaceGb': 0,
                      'maximumPersistentDisks': 16,
                      'maximumPersistentDisksSizeGb': '3072',
                      'zone': 'us-west1-b',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west1-b/machineTypes/f1-micro',
                      'isSharedCpu': true,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '2000',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'g1-small',
                      'description':
                          '1 vCPU (shared physical core) and 1.7 GB RAM',
                      'guestCpus': 1,
                      'memoryMb': 1740,
                      'imageSpaceGb': 0,
                      'maximumPersistentDisks': 16,
                      'maximumPersistentDisksSizeGb': '3072',
                      'zone': 'us-west1-b',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west1-b/machineTypes/g1-small',
                      'isSharedCpu': true,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '9196',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'm1-megamem-96',
                      'description': '96 vCPUs, 1.4 TB RAM',
                      'guestCpus': 96,
                      'memoryMb': 1468006,
                      'imageSpaceGb': 0,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-west1-b',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west1-b/machineTypes/m1-megamem-96',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '11160',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'm1-ultramem-160',
                      'description': '160 vCPUs, 3844 GB RAM',
                      'guestCpus': 160,
                      'memoryMb': 3936256,
                      'imageSpaceGb': 0,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-west1-b',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west1-b/machineTypes/m1-ultramem-160',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '11040',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'm1-ultramem-40',
                      'description': '40 vCPUs, 961 GB RAM',
                      'guestCpus': 40,
                      'memoryMb': 984064,
                      'imageSpaceGb': 0,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-west1-b',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west1-b/machineTypes/m1-ultramem-40',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '11080',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'm1-ultramem-80',
                      'description': '80 vCPUs, 1922 GB RAM',
                      'guestCpus': 80,
                      'memoryMb': 1968128,
                      'imageSpaceGb': 0,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-west1-b',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west1-b/machineTypes/m1-ultramem-80',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '4016',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n1-highcpu-16',
                      'description': '16 vCPUs, 14.4 GB RAM',
                      'guestCpus': 16,
                      'memoryMb': 14746,
                      'imageSpaceGb': 10,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-west1-b',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west1-b/machineTypes/n1-highcpu-16',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '4002',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n1-highcpu-2',
                      'description': '2 vCPUs, 1.8 GB RAM',
                      'guestCpus': 2,
                      'memoryMb': 1843,
                      'imageSpaceGb': 10,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-west1-b',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west1-b/machineTypes/n1-highcpu-2',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '4032',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n1-highcpu-32',
                      'description': '32 vCPUs, 28.8 GB RAM',
                      'guestCpus': 32,
                      'memoryMb': 29491,
                      'imageSpaceGb': 0,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-west1-b',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west1-b/machineTypes/n1-highcpu-32',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '4004',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n1-highcpu-4',
                      'description': '4 vCPUs, 3.6 GB RAM',
                      'guestCpus': 4,
                      'memoryMb': 3686,
                      'imageSpaceGb': 10,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-west1-b',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west1-b/machineTypes/n1-highcpu-4',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '4064',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n1-highcpu-64',
                      'description': '64 vCPUs, 57.6 GB RAM',
                      'guestCpus': 64,
                      'memoryMb': 58982,
                      'imageSpaceGb': 0,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-west1-b',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west1-b/machineTypes/n1-highcpu-64',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '4008',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n1-highcpu-8',
                      'description': '8 vCPUs, 7.2 GB RAM',
                      'guestCpus': 8,
                      'memoryMb': 7373,
                      'imageSpaceGb': 10,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-west1-b',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west1-b/machineTypes/n1-highcpu-8',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '4096',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n1-highcpu-96',
                      'description': '96 vCPUs, 86 GB RAM',
                      'guestCpus': 96,
                      'memoryMb': 88474,
                      'imageSpaceGb': 0,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-west1-b',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west1-b/machineTypes/n1-highcpu-96',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '5016',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n1-highmem-16',
                      'description': '16 vCPUs, 104 GB RAM',
                      'guestCpus': 16,
                      'memoryMb': 106496,
                      'imageSpaceGb': 10,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-west1-b',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west1-b/machineTypes/n1-highmem-16',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '5002',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n1-highmem-2',
                      'description': '2 vCPUs, 13 GB RAM',
                      'guestCpus': 2,
                      'memoryMb': 13312,
                      'imageSpaceGb': 10,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-west1-b',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west1-b/machineTypes/n1-highmem-2',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '5032',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n1-highmem-32',
                      'description': '32 vCPUs, 208 GB RAM',
                      'guestCpus': 32,
                      'memoryMb': 212992,
                      'imageSpaceGb': 0,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-west1-b',
                      'selfLink': 'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west1-b/machineTypes/n1-highmem-32',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '5004',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n1-highmem-4',
                      'description': '4 vCPUs, 26 GB RAM',
                      'guestCpus': 4,
                      'memoryMb': 26624,
                      'imageSpaceGb': 10,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-west1-b',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west1-b/machineTypes/n1-highmem-4',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '5064',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n1-highmem-64',
                      'description': '64 vCPUs, 416 GB RAM',
                      'guestCpus': 64,
                      'memoryMb': 425984,
                      'imageSpaceGb': 0,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-west1-b',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west1-b/machineTypes/n1-highmem-64',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '5008',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n1-highmem-8',
                      'description': '8 vCPUs, 52 GB RAM',
                      'guestCpus': 8,
                      'memoryMb': 53248,
                      'imageSpaceGb': 10,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-west1-b',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west1-b/machineTypes/n1-highmem-8',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '5096',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n1-highmem-96',
                      'description': '96 vCPUs, 624 GB RAM',
                      'guestCpus': 96,
                      'memoryMb': 638976,
                      'imageSpaceGb': 0,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-west1-b',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west1-b/machineTypes/n1-highmem-96',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '9096',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n1-megamem-96',
                      'description': '96 vCPUs, 1.4 TB RAM',
                      'guestCpus': 96,
                      'memoryMb': 1468006,
                      'imageSpaceGb': 0,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-west1-b',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west1-b/machineTypes/n1-megamem-96',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '3001',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n1-standard-1',
                      'description': '1 vCPU, 3.75 GB RAM',
                      'guestCpus': 1,
                      'memoryMb': 3840,
                      'imageSpaceGb': 10,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-west1-b',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west1-b/machineTypes/n1-standard-1',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '3016',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n1-standard-16',
                      'description': '16 vCPUs, 60 GB RAM',
                      'guestCpus': 16,
                      'memoryMb': 61440,
                      'imageSpaceGb': 10,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-west1-b',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west1-b/machineTypes/n1-standard-16',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '3002',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n1-standard-2',
                      'description': '2 vCPUs, 7.5 GB RAM',
                      'guestCpus': 2,
                      'memoryMb': 7680,
                      'imageSpaceGb': 10,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-west1-b',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west1-b/machineTypes/n1-standard-2',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '3032',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n1-standard-32',
                      'description': '32 vCPUs, 120 GB RAM',
                      'guestCpus': 32,
                      'memoryMb': 122880,
                      'imageSpaceGb': 0,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-west1-b',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west1-b/machineTypes/n1-standard-32',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '3004',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n1-standard-4',
                      'description': '4 vCPUs, 15 GB RAM',
                      'guestCpus': 4,
                      'memoryMb': 15360,
                      'imageSpaceGb': 10,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-west1-b',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west1-b/machineTypes/n1-standard-4',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '3064',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n1-standard-64',
                      'description': '64 vCPUs, 240 GB RAM',
                      'guestCpus': 64,
                      'memoryMb': 245760,
                      'imageSpaceGb': 0,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-west1-b',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west1-b/machineTypes/n1-standard-64',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '3008',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n1-standard-8',
                      'description': '8 vCPUs, 30 GB RAM',
                      'guestCpus': 8,
                      'memoryMb': 30720,
                      'imageSpaceGb': 10,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-west1-b',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west1-b/machineTypes/n1-standard-8',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '3096',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n1-standard-96',
                      'description': '96 vCPUs, 360 GB RAM',
                      'guestCpus': 96,
                      'memoryMb': 368640,
                      'imageSpaceGb': 0,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-west1-b',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west1-b/machineTypes/n1-standard-96',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '10160',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n1-ultramem-160',
                      'description': '160 vCPUs, 3844 GB RAM',
                      'guestCpus': 160,
                      'memoryMb': 3936256,
                      'imageSpaceGb': 0,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-west1-b',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west1-b/machineTypes/n1-ultramem-160',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '10040',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n1-ultramem-40',
                      'description': '40 vCPUs, 961 GB RAM',
                      'guestCpus': 40,
                      'memoryMb': 984064,
                      'imageSpaceGb': 0,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-west1-b',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west1-b/machineTypes/n1-ultramem-40',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '10080',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n1-ultramem-80',
                      'description': '80 vCPUs, 1922 GB RAM',
                      'guestCpus': 80,
                      'memoryMb': 1968128,
                      'imageSpaceGb': 0,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'us-west1-b',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west1-b/machineTypes/n1-ultramem-80',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    }
                  ]
                },
            'zones/us-west1-c': {
              'machineTypes': [
                {
                  'id': '1000',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'f1-micro',
                  'description': '1 vCPU (shared physical core) and 0.6 GB RAM',
                  'guestCpus': 1,
                  'memoryMb': 614,
                  'imageSpaceGb': 0,
                  'maximumPersistentDisks': 16,
                  'maximumPersistentDisksSizeGb': '3072',
                  'zone': 'us-west1-c',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west1-c/machineTypes/f1-micro',
                  'isSharedCpu': true,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '2000',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'g1-small',
                  'description': '1 vCPU (shared physical core) and 1.7 GB RAM',
                  'guestCpus': 1,
                  'memoryMb': 1740,
                  'imageSpaceGb': 0,
                  'maximumPersistentDisks': 16,
                  'maximumPersistentDisksSizeGb': '3072',
                  'zone': 'us-west1-c',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west1-c/machineTypes/g1-small',
                  'isSharedCpu': true,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '4016',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-highcpu-16',
                  'description': '16 vCPUs, 14.4 GB RAM',
                  'guestCpus': 16,
                  'memoryMb': 14746,
                  'imageSpaceGb': 10,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'us-west1-c',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west1-c/machineTypes/n1-highcpu-16',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '4002',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-highcpu-2',
                  'description': '2 vCPUs, 1.8 GB RAM',
                  'guestCpus': 2,
                  'memoryMb': 1843,
                  'imageSpaceGb': 10,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'us-west1-c',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west1-c/machineTypes/n1-highcpu-2',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '4032',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-highcpu-32',
                  'description': '32 vCPUs, 28.8 GB RAM',
                  'guestCpus': 32,
                  'memoryMb': 29491,
                  'imageSpaceGb': 0,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'us-west1-c',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west1-c/machineTypes/n1-highcpu-32',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '4004',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-highcpu-4',
                  'description': '4 vCPUs, 3.6 GB RAM',
                  'guestCpus': 4,
                  'memoryMb': 3686,
                  'imageSpaceGb': 10,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'us-west1-c',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west1-c/machineTypes/n1-highcpu-4',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '4064',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-highcpu-64',
                  'description': '64 vCPUs, 57.6 GB RAM',
                  'guestCpus': 64,
                  'memoryMb': 58982,
                  'imageSpaceGb': 0,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'us-west1-c',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west1-c/machineTypes/n1-highcpu-64',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '4008',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-highcpu-8',
                  'description': '8 vCPUs, 7.2 GB RAM',
                  'guestCpus': 8,
                  'memoryMb': 7373,
                  'imageSpaceGb': 10,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'us-west1-c',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west1-c/machineTypes/n1-highcpu-8',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '4096',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-highcpu-96',
                  'description': '96 vCPUs, 86 GB RAM',
                  'guestCpus': 96,
                  'memoryMb': 88474,
                  'imageSpaceGb': 0,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'us-west1-c',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west1-c/machineTypes/n1-highcpu-96',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '5016',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-highmem-16',
                  'description': '16 vCPUs, 104 GB RAM',
                  'guestCpus': 16,
                  'memoryMb': 106496,
                  'imageSpaceGb': 10,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'us-west1-c',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west1-c/machineTypes/n1-highmem-16',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '5002',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-highmem-2',
                  'description': '2 vCPUs, 13 GB RAM',
                  'guestCpus': 2,
                  'memoryMb': 13312,
                  'imageSpaceGb': 10,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'us-west1-c',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west1-c/machineTypes/n1-highmem-2',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '5032',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-highmem-32',
                  'description': '32 vCPUs, 208 GB RAM',
                  'guestCpus': 32,
                  'memoryMb': 212992,
                  'imageSpaceGb': 0,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'us-west1-c',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west1-c/machineTypes/n1-highmem-32',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '5004',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-highmem-4',
                  'description': '4 vCPUs, 26 GB RAM',
                  'guestCpus': 4,
                  'memoryMb': 26624,
                  'imageSpaceGb': 10,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'us-west1-c',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west1-c/machineTypes/n1-highmem-4',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '5064',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-highmem-64',
                  'description': '64 vCPUs, 416 GB RAM',
                  'guestCpus': 64,
                  'memoryMb': 425984,
                  'imageSpaceGb': 0,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'us-west1-c',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west1-c/machineTypes/n1-highmem-64',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '5008',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-highmem-8',
                  'description': '8 vCPUs, 52 GB RAM',
                  'guestCpus': 8,
                  'memoryMb': 53248,
                  'imageSpaceGb': 10,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'us-west1-c',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west1-c/machineTypes/n1-highmem-8',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '5096',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-highmem-96',
                  'description': '96 vCPUs, 624 GB RAM',
                  'guestCpus': 96,
                  'memoryMb': 638976,
                  'imageSpaceGb': 0,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'us-west1-c',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west1-c/machineTypes/n1-highmem-96',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '3001',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-standard-1',
                  'description': '1 vCPU, 3.75 GB RAM',
                  'guestCpus': 1,
                  'memoryMb': 3840,
                  'imageSpaceGb': 10,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'us-west1-c',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west1-c/machineTypes/n1-standard-1',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '3016',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-standard-16',
                  'description': '16 vCPUs, 60 GB RAM',
                  'guestCpus': 16,
                  'memoryMb': 61440,
                  'imageSpaceGb': 10,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'us-west1-c',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west1-c/machineTypes/n1-standard-16',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '3002',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-standard-2',
                  'description': '2 vCPUs, 7.5 GB RAM',
                  'guestCpus': 2,
                  'memoryMb': 7680,
                  'imageSpaceGb': 10,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'us-west1-c',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west1-c/machineTypes/n1-standard-2',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '3032',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-standard-32',
                  'description': '32 vCPUs, 120 GB RAM',
                  'guestCpus': 32,
                  'memoryMb': 122880,
                  'imageSpaceGb': 0,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'us-west1-c',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west1-c/machineTypes/n1-standard-32',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '3004',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-standard-4',
                  'description': '4 vCPUs, 15 GB RAM',
                  'guestCpus': 4,
                  'memoryMb': 15360,
                  'imageSpaceGb': 10,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'us-west1-c',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west1-c/machineTypes/n1-standard-4',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '3064',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-standard-64',
                  'description': '64 vCPUs, 240 GB RAM',
                  'guestCpus': 64,
                  'memoryMb': 245760,
                  'imageSpaceGb': 0,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'us-west1-c',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west1-c/machineTypes/n1-standard-64',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '3008',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-standard-8',
                  'description': '8 vCPUs, 30 GB RAM',
                  'guestCpus': 8,
                  'memoryMb': 30720,
                  'imageSpaceGb': 10,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'us-west1-c',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west1-c/machineTypes/n1-standard-8',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '3096',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-standard-96',
                  'description': '96 vCPUs, 360 GB RAM',
                  'guestCpus': 96,
                  'memoryMb': 368640,
                  'imageSpaceGb': 0,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'us-west1-c',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-west1-c/machineTypes/n1-standard-96',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                }
              ]
            },
            'zones/asia-east1-a':
                {
                  'machineTypes': [
                    {
                      'id': '1000',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'f1-micro',
                      'description':
                          '1 vCPU (shared physical core) and 0.6 GB RAM',
                      'guestCpus': 1,
                      'memoryMb': 614,
                      'imageSpaceGb': 0,
                      'maximumPersistentDisks': 16,
                      'maximumPersistentDisksSizeGb': '3072',
                      'zone': 'asia-east1-a',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/asia-east1-a/machineTypes/f1-micro',
                      'isSharedCpu': true,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '2000',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'g1-small',
                      'description':
                          '1 vCPU (shared physical core) and 1.7 GB RAM',
                      'guestCpus': 1,
                      'memoryMb': 1740,
                      'imageSpaceGb': 0,
                      'maximumPersistentDisks': 16,
                      'maximumPersistentDisksSizeGb': '3072',
                      'zone': 'asia-east1-a',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/asia-east1-a/machineTypes/g1-small',
                      'isSharedCpu': true,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '9196',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'm1-megamem-96',
                      'description': '96 vCPUs, 1.4 TB RAM',
                      'guestCpus': 96,
                      'memoryMb': 1468006,
                      'imageSpaceGb': 0,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'asia-east1-a',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/asia-east1-a/machineTypes/m1-megamem-96',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '4016',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n1-highcpu-16',
                      'description': '16 vCPUs, 14.4 GB RAM',
                      'guestCpus': 16,
                      'memoryMb': 14746,
                      'imageSpaceGb': 10,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'asia-east1-a',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/asia-east1-a/machineTypes/n1-highcpu-16',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '4002',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n1-highcpu-2',
                      'description': '2 vCPUs, 1.8 GB RAM',
                      'guestCpus': 2,
                      'memoryMb': 1843,
                      'imageSpaceGb': 10,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'asia-east1-a',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/asia-east1-a/machineTypes/n1-highcpu-2',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '4032',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n1-highcpu-32',
                      'description': '32 vCPUs, 28.8 GB RAM',
                      'guestCpus': 32,
                      'memoryMb': 29491,
                      'imageSpaceGb': 0,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'asia-east1-a',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/asia-east1-a/machineTypes/n1-highcpu-32',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '4004',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n1-highcpu-4',
                      'description': '4 vCPUs, 3.6 GB RAM',
                      'guestCpus': 4,
                      'memoryMb': 3686,
                      'imageSpaceGb': 10,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'asia-east1-a',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/asia-east1-a/machineTypes/n1-highcpu-4',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '4064',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n1-highcpu-64',
                      'description': '64 vCPUs, 57.6 GB RAM',
                      'guestCpus': 64,
                      'memoryMb': 58982,
                      'imageSpaceGb': 0,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'asia-east1-a',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/asia-east1-a/machineTypes/n1-highcpu-64',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '4008',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n1-highcpu-8',
                      'description': '8 vCPUs, 7.2 GB RAM',
                      'guestCpus': 8,
                      'memoryMb': 7373,
                      'imageSpaceGb': 10,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'asia-east1-a',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/asia-east1-a/machineTypes/n1-highcpu-8',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '4096',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n1-highcpu-96',
                      'description': '96 vCPUs, 86 GB RAM',
                      'guestCpus': 96,
                      'memoryMb': 88474,
                      'imageSpaceGb': 0,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'asia-east1-a',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/asia-east1-a/machineTypes/n1-highcpu-96',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '5016',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n1-highmem-16',
                      'description': '16 vCPUs, 104 GB RAM',
                      'guestCpus': 16,
                      'memoryMb': 106496,
                      'imageSpaceGb': 10,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'asia-east1-a',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/asia-east1-a/machineTypes/n1-highmem-16',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '5002',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n1-highmem-2',
                      'description': '2 vCPUs, 13 GB RAM',
                      'guestCpus': 2,
                      'memoryMb': 13312,
                      'imageSpaceGb': 10,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'asia-east1-a',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/asia-east1-a/machineTypes/n1-highmem-2',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '5032',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n1-highmem-32',
                      'description': '32 vCPUs, 208 GB RAM',
                      'guestCpus': 32,
                      'memoryMb': 212992,
                      'imageSpaceGb': 0,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'asia-east1-a',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/asia-east1-a/machineTypes/n1-highmem-32',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '5004',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n1-highmem-4',
                      'description': '4 vCPUs, 26 GB RAM',
                      'guestCpus': 4,
                      'memoryMb': 26624,
                      'imageSpaceGb': 10,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'asia-east1-a',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/asia-east1-a/machineTypes/n1-highmem-4',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '5064',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n1-highmem-64',
                      'description': '64 vCPUs, 416 GB RAM',
                      'guestCpus': 64,
                      'memoryMb': 425984,
                      'imageSpaceGb': 0,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'asia-east1-a',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/asia-east1-a/machineTypes/n1-highmem-64',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '5008',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n1-highmem-8',
                      'description': '8 vCPUs, 52 GB RAM',
                      'guestCpus': 8,
                      'memoryMb': 53248,
                      'imageSpaceGb': 10,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'asia-east1-a',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/asia-east1-a/machineTypes/n1-highmem-8',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '5096',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n1-highmem-96',
                      'description': '96 vCPUs, 624 GB RAM',
                      'guestCpus': 96,
                      'memoryMb': 638976,
                      'imageSpaceGb': 0,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'asia-east1-a',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/asia-east1-a/machineTypes/n1-highmem-96',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '9096',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n1-megamem-96',
                      'description': '96 vCPUs, 1.4 TB RAM',
                      'guestCpus': 96,
                      'memoryMb': 1468006,
                      'imageSpaceGb': 0,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'asia-east1-a',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/asia-east1-a/machineTypes/n1-megamem-96',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '3001',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n1-standard-1',
                      'description': '1 vCPU, 3.75 GB RAM',
                      'guestCpus': 1,
                      'memoryMb': 3840,
                      'imageSpaceGb': 10,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'asia-east1-a',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/asia-east1-a/machineTypes/n1-standard-1',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '3016',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n1-standard-16',
                      'description': '16 vCPUs, 60 GB RAM',
                      'guestCpus': 16,
                      'memoryMb': 61440,
                      'imageSpaceGb': 10,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'asia-east1-a',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/asia-east1-a/machineTypes/n1-standard-16',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '3002',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n1-standard-2',
                      'description': '2 vCPUs, 7.5 GB RAM',
                      'guestCpus': 2,
                      'memoryMb': 7680,
                      'imageSpaceGb': 10,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'asia-east1-a',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/asia-east1-a/machineTypes/n1-standard-2',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '3032',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n1-standard-32',
                      'description': '32 vCPUs, 120 GB RAM',
                      'guestCpus': 32,
                      'memoryMb': 122880,
                      'imageSpaceGb': 0,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'asia-east1-a',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/asia-east1-a/machineTypes/n1-standard-32',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '3004',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n1-standard-4',
                      'description': '4 vCPUs, 15 GB RAM',
                      'guestCpus': 4,
                      'memoryMb': 15360,
                      'imageSpaceGb': 10,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'asia-east1-a',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/asia-east1-a/machineTypes/n1-standard-4',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '3064',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n1-standard-64',
                      'description': '64 vCPUs, 240 GB RAM',
                      'guestCpus': 64,
                      'memoryMb': 245760,
                      'imageSpaceGb': 0,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'asia-east1-a',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/asia-east1-a/machineTypes/n1-standard-64',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '3008',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n1-standard-8',
                      'description': '8 vCPUs, 30 GB RAM',
                      'guestCpus': 8,
                      'memoryMb': 30720,
                      'imageSpaceGb': 10,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'asia-east1-a',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/asia-east1-a/machineTypes/n1-standard-8',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    },
                    {
                      'id': '3096',
                      'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                      'name': 'n1-standard-96',
                      'description': '96 vCPUs, 360 GB RAM',
                      'guestCpus': 96,
                      'memoryMb': 368640,
                      'imageSpaceGb': 0,
                      'maximumPersistentDisks': 128,
                      'maximumPersistentDisksSizeGb': '65536',
                      'zone': 'asia-east1-a',
                      'selfLink':
                          'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/asia-east1-a/machineTypes/n1-standard-96',
                      'isSharedCpu': false,
                      'kind': 'compute#machineType'
                    }
                  ]
                },
            'zones/asia-east1-b': {
              'machineTypes': [
                {
                  'id': '1000',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'f1-micro',
                  'description': '1 vCPU (shared physical core) and 0.6 GB RAM',
                  'guestCpus': 1,
                  'memoryMb': 614,
                  'imageSpaceGb': 0,
                  'maximumPersistentDisks': 16,
                  'maximumPersistentDisksSizeGb': '3072',
                  'zone': 'asia-east1-b',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/asia-east1-b/machineTypes/f1-micro',
                  'isSharedCpu': true,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '2000',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'g1-small',
                  'description': '1 vCPU (shared physical core) and 1.7 GB RAM',
                  'guestCpus': 1,
                  'memoryMb': 1740,
                  'imageSpaceGb': 0,
                  'maximumPersistentDisks': 16,
                  'maximumPersistentDisksSizeGb': '3072',
                  'zone': 'asia-east1-b',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/asia-east1-b/machineTypes/g1-small',
                  'isSharedCpu': true,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '9196',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'm1-megamem-96',
                  'description': '96 vCPUs, 1.4 TB RAM',
                  'guestCpus': 96,
                  'memoryMb': 1468006,
                  'imageSpaceGb': 0,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'asia-east1-b',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/asia-east1-b/machineTypes/m1-megamem-96',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '4016',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-highcpu-16',
                  'description': '16 vCPUs, 14.4 GB RAM',
                  'guestCpus': 16,
                  'memoryMb': 14746,
                  'imageSpaceGb': 10,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'asia-east1-b',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/asia-east1-b/machineTypes/n1-highcpu-16',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '4002',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-highcpu-2',
                  'description': '2 vCPUs, 1.8 GB RAM',
                  'guestCpus': 2,
                  'memoryMb': 1843,
                  'imageSpaceGb': 10,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'asia-east1-b',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/asia-east1-b/machineTypes/n1-highcpu-2',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '4032',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-highcpu-32',
                  'description': '32 vCPUs, 28.8 GB RAM',
                  'guestCpus': 32,
                  'memoryMb': 29491,
                  'imageSpaceGb': 0,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'asia-east1-b',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/asia-east1-b/machineTypes/n1-highcpu-32',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '4004',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-highcpu-4',
                  'description': '4 vCPUs, 3.6 GB RAM',
                  'guestCpus': 4,
                  'memoryMb': 3686,
                  'imageSpaceGb': 10,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'asia-east1-b',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/asia-east1-b/machineTypes/n1-highcpu-4',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '4064',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-highcpu-64',
                  'description': '64 vCPUs, 57.6 GB RAM',
                  'guestCpus': 64,
                  'memoryMb': 58982,
                  'imageSpaceGb': 0,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'asia-east1-b',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/asia-east1-b/machineTypes/n1-highcpu-64',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '4008',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-highcpu-8',
                  'description': '8 vCPUs, 7.2 GB RAM',
                  'guestCpus': 8,
                  'memoryMb': 7373,
                  'imageSpaceGb': 10,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'asia-east1-b',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/asia-east1-b/machineTypes/n1-highcpu-8',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '4096',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-highcpu-96',
                  'description': '96 vCPUs, 86 GB RAM',
                  'guestCpus': 96,
                  'memoryMb': 88474,
                  'imageSpaceGb': 0,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'asia-east1-b',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/asia-east1-b/machineTypes/n1-highcpu-96',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '5016',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-highmem-16',
                  'description': '16 vCPUs, 104 GB RAM',
                  'guestCpus': 16,
                  'memoryMb': 106496,
                  'imageSpaceGb': 10,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'asia-east1-b',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/asia-east1-b/machineTypes/n1-highmem-16',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '5002',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-highmem-2',
                  'description': '2 vCPUs, 13 GB RAM',
                  'guestCpus': 2,
                  'memoryMb': 13312,
                  'imageSpaceGb': 10,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'asia-east1-b',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/asia-east1-b/machineTypes/n1-highmem-2',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '5032',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-highmem-32',
                  'description': '32 vCPUs, 208 GB RAM',
                  'guestCpus': 32,
                  'memoryMb': 212992,
                  'imageSpaceGb': 0,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'asia-east1-b',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/asia-east1-b/machineTypes/n1-highmem-32',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '5004',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-highmem-4',
                  'description': '4 vCPUs, 26 GB RAM',
                  'guestCpus': 4,
                  'memoryMb': 26624,
                  'imageSpaceGb': 10,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'asia-east1-b',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/asia-east1-b/machineTypes/n1-highmem-4',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '5064',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-highmem-64',
                  'description': '64 vCPUs, 416 GB RAM',
                  'guestCpus': 64,
                  'memoryMb': 425984,
                  'imageSpaceGb': 0,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'asia-east1-b',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/asia-east1-b/machineTypes/n1-highmem-64',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '5008',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-highmem-8',
                  'description': '8 vCPUs, 52 GB RAM',
                  'guestCpus': 8,
                  'memoryMb': 53248,
                  'imageSpaceGb': 10,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'asia-east1-b',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/asia-east1-b/machineTypes/n1-highmem-8',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '5096',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-highmem-96',
                  'description': '96 vCPUs, 624 GB RAM',
                  'guestCpus': 96,
                  'memoryMb': 638976,
                  'imageSpaceGb': 0,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'asia-east1-b',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/asia-east1-b/machineTypes/n1-highmem-96',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '9096',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-megamem-96',
                  'description': '96 vCPUs, 1.4 TB RAM',
                  'guestCpus': 96,
                  'memoryMb': 1468006,
                  'imageSpaceGb': 0,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'asia-east1-b',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/asia-east1-b/machineTypes/n1-megamem-96',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '3001',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-standard-1',
                  'description': '1 vCPU, 3.75 GB RAM',
                  'guestCpus': 1,
                  'memoryMb': 3840,
                  'imageSpaceGb': 10,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'asia-east1-b',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/asia-east1-b/machineTypes/n1-standard-1',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '3016',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-standard-16',
                  'description': '16 vCPUs, 60 GB RAM',
                  'guestCpus': 16,
                  'memoryMb': 61440,
                  'imageSpaceGb': 10,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'asia-east1-b',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/asia-east1-b/machineTypes/n1-standard-16',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '3002',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-standard-2',
                  'description': '2 vCPUs, 7.5 GB RAM',
                  'guestCpus': 2,
                  'memoryMb': 7680,
                  'imageSpaceGb': 10,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'asia-east1-b',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/asia-east1-b/machineTypes/n1-standard-2',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '3032',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-standard-32',
                  'description': '32 vCPUs, 120 GB RAM',
                  'guestCpus': 32,
                  'memoryMb': 122880,
                  'imageSpaceGb': 0,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'asia-east1-b',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/asia-east1-b/machineTypes/n1-standard-32',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '3004',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-standard-4',
                  'description': '4 vCPUs, 15 GB RAM',
                  'guestCpus': 4,
                  'memoryMb': 15360,
                  'imageSpaceGb': 10,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'asia-east1-b',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/asia-east1-b/machineTypes/n1-standard-4',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '3064',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-standard-64',
                  'description': '64 vCPUs, 240 GB RAM',
                  'guestCpus': 64,
                  'memoryMb': 245760,
                  'imageSpaceGb': 0,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'asia-east1-b',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/asia-east1-b/machineTypes/n1-standard-64',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '3008',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-standard-8',
                  'description': '8 vCPUs, 30 GB RAM',
                  'guestCpus': 8,
                  'memoryMb': 30720,
                  'imageSpaceGb': 10,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'asia-east1-b',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/asia-east1-b/machineTypes/n1-standard-8',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '3096',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-standard-96',
                  'description': '96 vCPUs, 360 GB RAM',
                  'guestCpus': 96,
                  'memoryMb': 368640,
                  'imageSpaceGb': 0,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'asia-east1-b',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/asia-east1-b/machineTypes/n1-standard-96',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                }
              ]
            },
            'zones/asia-east1-c': {
              'machineTypes': [
                {
                  'id': '1000',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'f1-micro',
                  'description': '1 vCPU (shared physical core) and 0.6 GB RAM',
                  'guestCpus': 1,
                  'memoryMb': 614,
                  'imageSpaceGb': 0,
                  'maximumPersistentDisks': 16,
                  'maximumPersistentDisksSizeGb': '3072',
                  'zone': 'asia-east1-c',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/asia-east1-c/machineTypes/f1-micro',
                  'isSharedCpu': true,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '2000',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'g1-small',
                  'description': '1 vCPU (shared physical core) and 1.7 GB RAM',
                  'guestCpus': 1,
                  'memoryMb': 1740,
                  'imageSpaceGb': 0,
                  'maximumPersistentDisks': 16,
                  'maximumPersistentDisksSizeGb': '3072',
                  'zone': 'asia-east1-c',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/asia-east1-c/machineTypes/g1-small',
                  'isSharedCpu': true,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '4016',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-highcpu-16',
                  'description': '16 vCPUs, 14.4 GB RAM',
                  'guestCpus': 16,
                  'memoryMb': 14746,
                  'imageSpaceGb': 10,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'asia-east1-c',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/asia-east1-c/machineTypes/n1-highcpu-16',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '4002',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-highcpu-2',
                  'description': '2 vCPUs, 1.8 GB RAM',
                  'guestCpus': 2,
                  'memoryMb': 1843,
                  'imageSpaceGb': 10,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'asia-east1-c',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/asia-east1-c/machineTypes/n1-highcpu-2',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '4032',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-highcpu-32',
                  'description': '32 vCPUs, 28.8 GB RAM',
                  'guestCpus': 32,
                  'memoryMb': 29491,
                  'imageSpaceGb': 0,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'asia-east1-c',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/asia-east1-c/machineTypes/n1-highcpu-32',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '4004',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-highcpu-4',
                  'description': '4 vCPUs, 3.6 GB RAM',
                  'guestCpus': 4,
                  'memoryMb': 3686,
                  'imageSpaceGb': 10,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'asia-east1-c',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/asia-east1-c/machineTypes/n1-highcpu-4',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '4064',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-highcpu-64',
                  'description': '64 vCPUs, 57.6 GB RAM',
                  'guestCpus': 64,
                  'memoryMb': 58982,
                  'imageSpaceGb': 0,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'asia-east1-c',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/asia-east1-c/machineTypes/n1-highcpu-64',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '4008',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-highcpu-8',
                  'description': '8 vCPUs, 7.2 GB RAM',
                  'guestCpus': 8,
                  'memoryMb': 7373,
                  'imageSpaceGb': 10,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'asia-east1-c',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/asia-east1-c/machineTypes/n1-highcpu-8',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '4096',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-highcpu-96',
                  'description': '96 vCPUs, 86 GB RAM',
                  'guestCpus': 96,
                  'memoryMb': 88474,
                  'imageSpaceGb': 0,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'asia-east1-c',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/asia-east1-c/machineTypes/n1-highcpu-96',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '5016',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-highmem-16',
                  'description': '16 vCPUs, 104 GB RAM',
                  'guestCpus': 16,
                  'memoryMb': 106496,
                  'imageSpaceGb': 10,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'asia-east1-c',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/asia-east1-c/machineTypes/n1-highmem-16',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '5002',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-highmem-2',
                  'description': '2 vCPUs, 13 GB RAM',
                  'guestCpus': 2,
                  'memoryMb': 13312,
                  'imageSpaceGb': 10,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'asia-east1-c',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/asia-east1-c/machineTypes/n1-highmem-2',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '5032',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-highmem-32',
                  'description': '32 vCPUs, 208 GB RAM',
                  'guestCpus': 32,
                  'memoryMb': 212992,
                  'imageSpaceGb': 0,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'asia-east1-c',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/asia-east1-c/machineTypes/n1-highmem-32',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '5004',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-highmem-4',
                  'description': '4 vCPUs, 26 GB RAM',
                  'guestCpus': 4,
                  'memoryMb': 26624,
                  'imageSpaceGb': 10,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'asia-east1-c',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/asia-east1-c/machineTypes/n1-highmem-4',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '5064',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-highmem-64',
                  'description': '64 vCPUs, 416 GB RAM',
                  'guestCpus': 64,
                  'memoryMb': 425984,
                  'imageSpaceGb': 0,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'asia-east1-c',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/asia-east1-c/machineTypes/n1-highmem-64',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '5008',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-highmem-8',
                  'description': '8 vCPUs, 52 GB RAM',
                  'guestCpus': 8,
                  'memoryMb': 53248,
                  'imageSpaceGb': 10,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'asia-east1-c',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/asia-east1-c/machineTypes/n1-highmem-8',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '5096',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-highmem-96',
                  'description': '96 vCPUs, 624 GB RAM',
                  'guestCpus': 96,
                  'memoryMb': 638976,
                  'imageSpaceGb': 0,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'asia-east1-c',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/asia-east1-c/machineTypes/n1-highmem-96',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '3001',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-standard-1',
                  'description': '1 vCPU, 3.75 GB RAM',
                  'guestCpus': 1,
                  'memoryMb': 3840,
                  'imageSpaceGb': 10,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'asia-east1-c',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/asia-east1-c/machineTypes/n1-standard-1',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '3016',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-standard-16',
                  'description': '16 vCPUs, 60 GB RAM',
                  'guestCpus': 16,
                  'memoryMb': 61440,
                  'imageSpaceGb': 10,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'asia-east1-c',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/asia-east1-c/machineTypes/n1-standard-16',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '3002',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-standard-2',
                  'description': '2 vCPUs, 7.5 GB RAM',
                  'guestCpus': 2,
                  'memoryMb': 7680,
                  'imageSpaceGb': 10,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'asia-east1-c',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/asia-east1-c/machineTypes/n1-standard-2',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '3032',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-standard-32',
                  'description': '32 vCPUs, 120 GB RAM',
                  'guestCpus': 32,
                  'memoryMb': 122880,
                  'imageSpaceGb': 0,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'asia-east1-c',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/asia-east1-c/machineTypes/n1-standard-32',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '3004',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-standard-4',
                  'description': '4 vCPUs, 15 GB RAM',
                  'guestCpus': 4,
                  'memoryMb': 15360,
                  'imageSpaceGb': 10,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'asia-east1-c',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/asia-east1-c/machineTypes/n1-standard-4',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '3064',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-standard-64',
                  'description': '64 vCPUs, 240 GB RAM',
                  'guestCpus': 64,
                  'memoryMb': 245760,
                  'imageSpaceGb': 0,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'asia-east1-c',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/asia-east1-c/machineTypes/n1-standard-64',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '3008',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-standard-8',
                  'description': '8 vCPUs, 30 GB RAM',
                  'guestCpus': 8,
                  'memoryMb': 30720,
                  'imageSpaceGb': 10,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'asia-east1-c',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/asia-east1-c/machineTypes/n1-standard-8',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '3096',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-standard-96',
                  'description': '96 vCPUs, 360 GB RAM',
                  'guestCpus': 96,
                  'memoryMb': 368640,
                  'imageSpaceGb': 0,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'asia-east1-c',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/asia-east1-c/machineTypes/n1-standard-96',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                }
              ]
            },
            'zones/us-east1-b':
                {
                  'machineTypes':
                      [
                        {
                          'id': '1000',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'f1-micro',
                          'description':
                              '1 vCPU (shared physical core) and 0.6 GB RAM',
                          'guestCpus': 1,
                          'memoryMb': 614,
                          'imageSpaceGb': 0,
                          'maximumPersistentDisks': 16,
                          'maximumPersistentDisksSizeGb': '3072',
                          'zone': 'us-east1-b',
                          'selfLink': 'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-east1-b/machineTypes/f1-micro',
                          'isSharedCpu': true,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '2000',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'g1-small',
                          'description':
                              '1 vCPU (shared physical core) and 1.7 GB RAM',
                          'guestCpus': 1,
                          'memoryMb': 1740,
                          'imageSpaceGb': 0,
                          'maximumPersistentDisks': 16,
                          'maximumPersistentDisksSizeGb': '3072',
                          'zone': 'us-east1-b',
                          'selfLink': 'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-east1-b/machineTypes/g1-small',
                          'isSharedCpu': true,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '9196',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'm1-megamem-96',
                          'description': '96 vCPUs, 1.4 TB RAM',
                          'guestCpus': 96,
                          'memoryMb': 1468006,
                          'imageSpaceGb': 0,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-east1-b',
                          'selfLink': 'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-east1-b/machineTypes/m1-megamem-96',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '11160',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'm1-ultramem-160',
                          'description': '160 vCPUs, 3844 GB RAM',
                          'guestCpus': 160,
                          'memoryMb': 3936256,
                          'imageSpaceGb': 0,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-east1-b',
                          'selfLink': 'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-east1-b/machineTypes/m1-ultramem-160',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '11040',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'm1-ultramem-40',
                          'description': '40 vCPUs, 961 GB RAM',
                          'guestCpus': 40,
                          'memoryMb': 984064,
                          'imageSpaceGb': 0,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-east1-b',
                          'selfLink': 'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-east1-b/machineTypes/m1-ultramem-40',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '11080',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'm1-ultramem-80',
                          'description': '80 vCPUs, 1922 GB RAM',
                          'guestCpus': 80,
                          'memoryMb': 1968128,
                          'imageSpaceGb': 0,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-east1-b',
                          'selfLink': 'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-east1-b/machineTypes/m1-ultramem-80',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '4016',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n1-highcpu-16',
                          'description': '16 vCPUs, 14.4 GB RAM',
                          'guestCpus': 16,
                          'memoryMb': 14746,
                          'imageSpaceGb': 10,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-east1-b',
                          'selfLink': 'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-east1-b/machineTypes/n1-highcpu-16',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '4002',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n1-highcpu-2',
                          'description': '2 vCPUs, 1.8 GB RAM',
                          'guestCpus': 2,
                          'memoryMb': 1843,
                          'imageSpaceGb': 10,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-east1-b',
                          'selfLink': 'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-east1-b/machineTypes/n1-highcpu-2',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '4032',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n1-highcpu-32',
                          'description': '32 vCPUs, 28.8 GB RAM',
                          'guestCpus': 32,
                          'memoryMb': 29491,
                          'imageSpaceGb': 0,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-east1-b',
                          'selfLink': 'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-east1-b/machineTypes/n1-highcpu-32',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '4004',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n1-highcpu-4',
                          'description': '4 vCPUs, 3.6 GB RAM',
                          'guestCpus': 4,
                          'memoryMb': 3686,
                          'imageSpaceGb': 10,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-east1-b',
                          'selfLink': 'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-east1-b/machineTypes/n1-highcpu-4',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '4064',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n1-highcpu-64',
                          'description': '64 vCPUs, 57.6 GB RAM',
                          'guestCpus': 64,
                          'memoryMb': 58982,
                          'imageSpaceGb': 0,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-east1-b',
                          'selfLink': 'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-east1-b/machineTypes/n1-highcpu-64',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '4008',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n1-highcpu-8',
                          'description': '8 vCPUs, 7.2 GB RAM',
                          'guestCpus': 8,
                          'memoryMb': 7373,
                          'imageSpaceGb': 10,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-east1-b',
                          'selfLink': 'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-east1-b/machineTypes/n1-highcpu-8',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '4096',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n1-highcpu-96',
                          'description': '96 vCPUs, 86 GB RAM',
                          'guestCpus': 96,
                          'memoryMb': 88474,
                          'imageSpaceGb': 0,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-east1-b',
                          'selfLink': 'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-east1-b/machineTypes/n1-highcpu-96',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '5016',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n1-highmem-16',
                          'description': '16 vCPUs, 104 GB RAM',
                          'guestCpus': 16,
                          'memoryMb': 106496,
                          'imageSpaceGb': 10,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-east1-b',
                          'selfLink': 'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-east1-b/machineTypes/n1-highmem-16',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '5002',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n1-highmem-2',
                          'description': '2 vCPUs, 13 GB RAM',
                          'guestCpus': 2,
                          'memoryMb': 13312,
                          'imageSpaceGb': 10,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-east1-b',
                          'selfLink': 'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-east1-b/machineTypes/n1-highmem-2',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '5032',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n1-highmem-32',
                          'description': '32 vCPUs, 208 GB RAM',
                          'guestCpus': 32,
                          'memoryMb': 212992,
                          'imageSpaceGb': 0,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-east1-b',
                          'selfLink':
                              'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-east1-b/machineTypes/n1-highmem-32',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '5004',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n1-highmem-4',
                          'description': '4 vCPUs, 26 GB RAM',
                          'guestCpus': 4,
                          'memoryMb': 26624,
                          'imageSpaceGb': 10,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-east1-b',
                          'selfLink':
                              'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-east1-b/machineTypes/n1-highmem-4',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '5064',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n1-highmem-64',
                          'description': '64 vCPUs, 416 GB RAM',
                          'guestCpus': 64,
                          'memoryMb': 425984,
                          'imageSpaceGb': 0,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-east1-b',
                          'selfLink':
                              'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-east1-b/machineTypes/n1-highmem-64',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '5008',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n1-highmem-8',
                          'description': '8 vCPUs, 52 GB RAM',
                          'guestCpus': 8,
                          'memoryMb': 53248,
                          'imageSpaceGb': 10,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-east1-b',
                          'selfLink':
                              'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-east1-b/machineTypes/n1-highmem-8',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '5096',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n1-highmem-96',
                          'description': '96 vCPUs, 624 GB RAM',
                          'guestCpus': 96,
                          'memoryMb': 638976,
                          'imageSpaceGb': 0,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-east1-b',
                          'selfLink':
                              'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-east1-b/machineTypes/n1-highmem-96',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '9096',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n1-megamem-96',
                          'description': '96 vCPUs, 1.4 TB RAM',
                          'guestCpus': 96,
                          'memoryMb': 1468006,
                          'imageSpaceGb': 0,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-east1-b',
                          'selfLink':
                              'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-east1-b/machineTypes/n1-megamem-96',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '3001',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n1-standard-1',
                          'description': '1 vCPU, 3.75 GB RAM',
                          'guestCpus': 1,
                          'memoryMb': 3840,
                          'imageSpaceGb': 10,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-east1-b',
                          'selfLink':
                              'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-east1-b/machineTypes/n1-standard-1',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '3016',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n1-standard-16',
                          'description': '16 vCPUs, 60 GB RAM',
                          'guestCpus': 16,
                          'memoryMb': 61440,
                          'imageSpaceGb': 10,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-east1-b',
                          'selfLink':
                              'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-east1-b/machineTypes/n1-standard-16',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '3002',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n1-standard-2',
                          'description': '2 vCPUs, 7.5 GB RAM',
                          'guestCpus': 2,
                          'memoryMb': 7680,
                          'imageSpaceGb': 10,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-east1-b',
                          'selfLink':
                              'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-east1-b/machineTypes/n1-standard-2',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '3032',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n1-standard-32',
                          'description': '32 vCPUs, 120 GB RAM',
                          'guestCpus': 32,
                          'memoryMb': 122880,
                          'imageSpaceGb': 0,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-east1-b',
                          'selfLink':
                              'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-east1-b/machineTypes/n1-standard-32',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '3004',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n1-standard-4',
                          'description': '4 vCPUs, 15 GB RAM',
                          'guestCpus': 4,
                          'memoryMb': 15360,
                          'imageSpaceGb': 10,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-east1-b',
                          'selfLink':
                              'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-east1-b/machineTypes/n1-standard-4',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '3064',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n1-standard-64',
                          'description': '64 vCPUs, 240 GB RAM',
                          'guestCpus': 64,
                          'memoryMb': 245760,
                          'imageSpaceGb': 0,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-east1-b',
                          'selfLink':
                              'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-east1-b/machineTypes/n1-standard-64',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '3008',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n1-standard-8',
                          'description': '8 vCPUs, 30 GB RAM',
                          'guestCpus': 8,
                          'memoryMb': 30720,
                          'imageSpaceGb': 10,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-east1-b',
                          'selfLink':
                              'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-east1-b/machineTypes/n1-standard-8',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '3096',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n1-standard-96',
                          'description': '96 vCPUs, 360 GB RAM',
                          'guestCpus': 96,
                          'memoryMb': 368640,
                          'imageSpaceGb': 0,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-east1-b',
                          'selfLink':
                              'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-east1-b/machineTypes/n1-standard-96',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '10160',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n1-ultramem-160',
                          'description': '160 vCPUs, 3844 GB RAM',
                          'guestCpus': 160,
                          'memoryMb': 3936256,
                          'imageSpaceGb': 0,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-east1-b',
                          'selfLink':
                              'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-east1-b/machineTypes/n1-ultramem-160',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '10040',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n1-ultramem-40',
                          'description': '40 vCPUs, 961 GB RAM',
                          'guestCpus': 40,
                          'memoryMb': 984064,
                          'imageSpaceGb': 0,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-east1-b',
                          'selfLink':
                              'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-east1-b/machineTypes/n1-ultramem-40',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        },
                        {
                          'id': '10080',
                          'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                          'name': 'n1-ultramem-80',
                          'description': '80 vCPUs, 1922 GB RAM',
                          'guestCpus': 80,
                          'memoryMb': 1968128,
                          'imageSpaceGb': 0,
                          'maximumPersistentDisks': 128,
                          'maximumPersistentDisksSizeGb': '65536',
                          'zone': 'us-east1-b',
                          'selfLink':
                              'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-east1-b/machineTypes/n1-ultramem-80',
                          'isSharedCpu': false,
                          'kind': 'compute#machineType'
                        }
                      ]
                },
            'zones/us-east1-c': {
              'machineTypes': [
                {
                  'id': '1000',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'f1-micro',
                  'description': '1 vCPU (shared physical core) and 0.6 GB RAM',
                  'guestCpus': 1,
                  'memoryMb': 614,
                  'imageSpaceGb': 0,
                  'maximumPersistentDisks': 16,
                  'maximumPersistentDisksSizeGb': '3072',
                  'zone': 'us-east1-c',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-east1-c/machineTypes/f1-micro',
                  'isSharedCpu': true,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '2000',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'g1-small',
                  'description': '1 vCPU (shared physical core) and 1.7 GB RAM',
                  'guestCpus': 1,
                  'memoryMb': 1740,
                  'imageSpaceGb': 0,
                  'maximumPersistentDisks': 16,
                  'maximumPersistentDisksSizeGb': '3072',
                  'zone': 'us-east1-c',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-east1-c/machineTypes/g1-small',
                  'isSharedCpu': true,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '9196',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'm1-megamem-96',
                  'description': '96 vCPUs, 1.4 TB RAM',
                  'guestCpus': 96,
                  'memoryMb': 1468006,
                  'imageSpaceGb': 0,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'us-east1-c',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-east1-c/machineTypes/m1-megamem-96',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '4016',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-highcpu-16',
                  'description': '16 vCPUs, 14.4 GB RAM',
                  'guestCpus': 16,
                  'memoryMb': 14746,
                  'imageSpaceGb': 10,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'us-east1-c',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-east1-c/machineTypes/n1-highcpu-16',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '4002',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-highcpu-2',
                  'description': '2 vCPUs, 1.8 GB RAM',
                  'guestCpus': 2,
                  'memoryMb': 1843,
                  'imageSpaceGb': 10,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'us-east1-c',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-east1-c/machineTypes/n1-highcpu-2',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '4032',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-highcpu-32',
                  'description': '32 vCPUs, 28.8 GB RAM',
                  'guestCpus': 32,
                  'memoryMb': 29491,
                  'imageSpaceGb': 0,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'us-east1-c',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-east1-c/machineTypes/n1-highcpu-32',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '4004',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-highcpu-4',
                  'description': '4 vCPUs, 3.6 GB RAM',
                  'guestCpus': 4,
                  'memoryMb': 3686,
                  'imageSpaceGb': 10,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'us-east1-c',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-east1-c/machineTypes/n1-highcpu-4',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '4064',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-highcpu-64',
                  'description': '64 vCPUs, 57.6 GB RAM',
                  'guestCpus': 64,
                  'memoryMb': 58982,
                  'imageSpaceGb': 0,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'us-east1-c',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-east1-c/machineTypes/n1-highcpu-64',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '4008',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-highcpu-8',
                  'description': '8 vCPUs, 7.2 GB RAM',
                  'guestCpus': 8,
                  'memoryMb': 7373,
                  'imageSpaceGb': 10,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'us-east1-c',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-east1-c/machineTypes/n1-highcpu-8',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '4096',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-highcpu-96',
                  'description': '96 vCPUs, 86 GB RAM',
                  'guestCpus': 96,
                  'memoryMb': 88474,
                  'imageSpaceGb': 0,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'us-east1-c',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-east1-c/machineTypes/n1-highcpu-96',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '5016',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-highmem-16',
                  'description': '16 vCPUs, 104 GB RAM',
                  'guestCpus': 16,
                  'memoryMb': 106496,
                  'imageSpaceGb': 10,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'us-east1-c',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-east1-c/machineTypes/n1-highmem-16',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '5002',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-highmem-2',
                  'description': '2 vCPUs, 13 GB RAM',
                  'guestCpus': 2,
                  'memoryMb': 13312,
                  'imageSpaceGb': 10,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'us-east1-c',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-east1-c/machineTypes/n1-highmem-2',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '5032',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-highmem-32',
                  'description': '32 vCPUs, 208 GB RAM',
                  'guestCpus': 32,
                  'memoryMb': 212992,
                  'imageSpaceGb': 0,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'us-east1-c',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-east1-c/machineTypes/n1-highmem-32',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '5004',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-highmem-4',
                  'description': '4 vCPUs, 26 GB RAM',
                  'guestCpus': 4,
                  'memoryMb': 26624,
                  'imageSpaceGb': 10,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'us-east1-c',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-east1-c/machineTypes/n1-highmem-4',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '5064',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-highmem-64',
                  'description': '64 vCPUs, 416 GB RAM',
                  'guestCpus': 64,
                  'memoryMb': 425984,
                  'imageSpaceGb': 0,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'us-east1-c',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-east1-c/machineTypes/n1-highmem-64',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '5008',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-highmem-8',
                  'description': '8 vCPUs, 52 GB RAM',
                  'guestCpus': 8,
                  'memoryMb': 53248,
                  'imageSpaceGb': 10,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'us-east1-c',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-east1-c/machineTypes/n1-highmem-8',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '5096',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-highmem-96',
                  'description': '96 vCPUs, 624 GB RAM',
                  'guestCpus': 96,
                  'memoryMb': 638976,
                  'imageSpaceGb': 0,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'us-east1-c',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-east1-c/machineTypes/n1-highmem-96',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '9096',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-megamem-96',
                  'description': '96 vCPUs, 1.4 TB RAM',
                  'guestCpus': 96,
                  'memoryMb': 1468006,
                  'imageSpaceGb': 0,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'us-east1-c',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-east1-c/machineTypes/n1-megamem-96',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '3001',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-standard-1',
                  'description': '1 vCPU, 3.75 GB RAM',
                  'guestCpus': 1,
                  'memoryMb': 3840,
                  'imageSpaceGb': 10,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'us-east1-c',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-east1-c/machineTypes/n1-standard-1',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '3016',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-standard-16',
                  'description': '16 vCPUs, 60 GB RAM',
                  'guestCpus': 16,
                  'memoryMb': 61440,
                  'imageSpaceGb': 10,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'us-east1-c',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-east1-c/machineTypes/n1-standard-16',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '3002',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-standard-2',
                  'description': '2 vCPUs, 7.5 GB RAM',
                  'guestCpus': 2,
                  'memoryMb': 7680,
                  'imageSpaceGb': 10,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'us-east1-c',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-east1-c/machineTypes/n1-standard-2',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '3032',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-standard-32',
                  'description': '32 vCPUs, 120 GB RAM',
                  'guestCpus': 32,
                  'memoryMb': 122880,
                  'imageSpaceGb': 0,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'us-east1-c',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-east1-c/machineTypes/n1-standard-32',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '3004',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-standard-4',
                  'description': '4 vCPUs, 15 GB RAM',
                  'guestCpus': 4,
                  'memoryMb': 15360,
                  'imageSpaceGb': 10,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'us-east1-c',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-east1-c/machineTypes/n1-standard-4',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '3064',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-standard-64',
                  'description': '64 vCPUs, 240 GB RAM',
                  'guestCpus': 64,
                  'memoryMb': 245760,
                  'imageSpaceGb': 0,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'us-east1-c',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-east1-c/machineTypes/n1-standard-64',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '3008',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-standard-8',
                  'description': '8 vCPUs, 30 GB RAM',
                  'guestCpus': 8,
                  'memoryMb': 30720,
                  'imageSpaceGb': 10,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'us-east1-c',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-east1-c/machineTypes/n1-standard-8',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '3096',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-standard-96',
                  'description': '96 vCPUs, 360 GB RAM',
                  'guestCpus': 96,
                  'memoryMb': 368640,
                  'imageSpaceGb': 0,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'us-east1-c',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-east1-c/machineTypes/n1-standard-96',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                }
              ]
            },
            'zones/us-east1-d': {
              'machineTypes': [
                {
                  'id': '1000',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'f1-micro',
                  'description': '1 vCPU (shared physical core) and 0.6 GB RAM',
                  'guestCpus': 1,
                  'memoryMb': 614,
                  'imageSpaceGb': 0,
                  'maximumPersistentDisks': 16,
                  'maximumPersistentDisksSizeGb': '3072',
                  'zone': 'us-east1-d',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-east1-d/machineTypes/f1-micro',
                  'isSharedCpu': true,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '2000',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'g1-small',
                  'description': '1 vCPU (shared physical core) and 1.7 GB RAM',
                  'guestCpus': 1,
                  'memoryMb': 1740,
                  'imageSpaceGb': 0,
                  'maximumPersistentDisks': 16,
                  'maximumPersistentDisksSizeGb': '3072',
                  'zone': 'us-east1-d',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-east1-d/machineTypes/g1-small',
                  'isSharedCpu': true,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '11160',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'm1-ultramem-160',
                  'description': '160 vCPUs, 3844 GB RAM',
                  'guestCpus': 160,
                  'memoryMb': 3936256,
                  'imageSpaceGb': 0,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'us-east1-d',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-east1-d/machineTypes/m1-ultramem-160',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '11040',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'm1-ultramem-40',
                  'description': '40 vCPUs, 961 GB RAM',
                  'guestCpus': 40,
                  'memoryMb': 984064,
                  'imageSpaceGb': 0,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'us-east1-d',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-east1-d/machineTypes/m1-ultramem-40',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '11080',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'm1-ultramem-80',
                  'description': '80 vCPUs, 1922 GB RAM',
                  'guestCpus': 80,
                  'memoryMb': 1968128,
                  'imageSpaceGb': 0,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'us-east1-d',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-east1-d/machineTypes/m1-ultramem-80',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '4016',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-highcpu-16',
                  'description': '16 vCPUs, 14.4 GB RAM',
                  'guestCpus': 16,
                  'memoryMb': 14746,
                  'imageSpaceGb': 10,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'us-east1-d',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-east1-d/machineTypes/n1-highcpu-16',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '4002',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-highcpu-2',
                  'description': '2 vCPUs, 1.8 GB RAM',
                  'guestCpus': 2,
                  'memoryMb': 1843,
                  'imageSpaceGb': 10,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'us-east1-d',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-east1-d/machineTypes/n1-highcpu-2',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '4032',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-highcpu-32',
                  'description': '32 vCPUs, 28.8 GB RAM',
                  'guestCpus': 32,
                  'memoryMb': 29491,
                  'imageSpaceGb': 0,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'us-east1-d',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-east1-d/machineTypes/n1-highcpu-32',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '4004',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-highcpu-4',
                  'description': '4 vCPUs, 3.6 GB RAM',
                  'guestCpus': 4,
                  'memoryMb': 3686,
                  'imageSpaceGb': 10,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'us-east1-d',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-east1-d/machineTypes/n1-highcpu-4',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '4064',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-highcpu-64',
                  'description': '64 vCPUs, 57.6 GB RAM',
                  'guestCpus': 64,
                  'memoryMb': 58982,
                  'imageSpaceGb': 0,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'us-east1-d',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-east1-d/machineTypes/n1-highcpu-64',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '4008',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-highcpu-8',
                  'description': '8 vCPUs, 7.2 GB RAM',
                  'guestCpus': 8,
                  'memoryMb': 7373,
                  'imageSpaceGb': 10,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'us-east1-d',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-east1-d/machineTypes/n1-highcpu-8',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '4096',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-highcpu-96',
                  'description': '96 vCPUs, 86 GB RAM',
                  'guestCpus': 96,
                  'memoryMb': 88474,
                  'imageSpaceGb': 0,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'us-east1-d',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-east1-d/machineTypes/n1-highcpu-96',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '5016',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-highmem-16',
                  'description': '16 vCPUs, 104 GB RAM',
                  'guestCpus': 16,
                  'memoryMb': 106496,
                  'imageSpaceGb': 10,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'us-east1-d',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-east1-d/machineTypes/n1-highmem-16',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                },
                {
                  'id': '5002',
                  'creationTimestamp': '1969-12-31T16:00:00.000-08:00',
                  'name': 'n1-highmem-2',
                  'description': '2 vCPUs, 13 GB RAM',
                  'guestCpus': 2,
                  'memoryMb': 13312,
                  'imageSpaceGb': 10,
                  'maximumPersistentDisks': 128,
                  'maximumPersistentDisksSizeGb': '65536',
                  'zone': 'us-east1-d',
                  'selfLink':
                      'https://www.googleapis.com/compute/v1/projects/weiting-dev/zones/us-east1-d/machineTypes/n1-highmem-2',
                  'isSharedCpu': false,
                  'kind': 'compute#machineType'
                }
              ]
            },
            'zones/asia-northeast1-a': {
              'warning': {
                'code': 'NO_RESULTS_ON_PAGE',
                'message':
                    'There are no results for scope \'zones/asia-northeast1-a\' on this page.',
                'data': [{'key': 'scope', 'value': 'zones/asia-northeast1-a'}]
              }
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
            'zones/asia-southeast1-b': {
              'warning': {
                'code': 'NO_RESULTS_ON_PAGE',
                'message':
                    'There are no results for scope \'zones/asia-southeast1-b\' on this page.',
                'data': [{'key': 'scope', 'value': 'zones/asia-southeast1-b'}]
              }
            },
            'zones/asia-southeast1-c': {
              'warning': {
                'code': 'NO_RESULTS_ON_PAGE',
                'message':
                    'There are no results for scope \'zones/asia-southeast1-c\' on this page.',
                'data': [{'key': 'scope', 'value': 'zones/asia-southeast1-c'}]
              }
            },
            'zones/us-east4-a': {
              'warning': {
                'code': 'NO_RESULTS_ON_PAGE',
                'message':
                    'There are no results for scope \'zones/us-east4-a\' on this page.',
                'data': [{'key': 'scope', 'value': 'zones/us-east4-a'}]
              }
            },
            'zones/us-east4-b': {
              'warning': {
                'code': 'NO_RESULTS_ON_PAGE',
                'message':
                    'There are no results for scope \'zones/us-east4-b\' on this page.',
                'data': [{'key': 'scope', 'value': 'zones/us-east4-b'}]
              }
            },
            'zones/us-east4-c': {
              'warning': {
                'code': 'NO_RESULTS_ON_PAGE',
                'message':
                    'There are no results for scope \'zones/us-east4-c\' on this page.',
                'data': [{'key': 'scope', 'value': 'zones/us-east4-c'}]
              }
            },
            'zones/australia-southeast1-c': {
              'warning': {
                'code': 'NO_RESULTS_ON_PAGE',
                'message':
                    'There are no results for scope \'zones/australia-southeast1-c\' on this page.',
                'data':
                    [{'key': 'scope', 'value': 'zones/australia-southeast1-c'}]
              }
            },
            'zones/australia-southeast1-a': {
              'warning': {
                'code': 'NO_RESULTS_ON_PAGE',
                'message':
                    'There are no results for scope \'zones/australia-southeast1-a\' on this page.',
                'data':
                    [{'key': 'scope', 'value': 'zones/australia-southeast1-a'}]
              }
            },
            'zones/australia-southeast1-b': {
              'warning': {
                'code': 'NO_RESULTS_ON_PAGE',
                'message':
                    'There are no results for scope \'zones/australia-southeast1-b\' on this page.',
                'data':
                    [{'key': 'scope', 'value': 'zones/australia-southeast1-b'}]
              }
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
                'data':
                    [{'key': 'scope', 'value': 'zones/southamerica-east1-a'}]
              }
            },
            'zones/southamerica-east1-b': {
              'warning': {
                'code': 'NO_RESULTS_ON_PAGE',
                'message':
                    'There are no results for scope \'zones/southamerica-east1-b\' on this page.',
                'data':
                    [{'key': 'scope', 'value': 'zones/southamerica-east1-b'}]
              }
            },
            'zones/southamerica-east1-c': {
              'warning': {
                'code': 'NO_RESULTS_ON_PAGE',
                'message':
                    'There are no results for scope \'zones/southamerica-east1-c\' on this page.',
                'data':
                    [{'key': 'scope', 'value': 'zones/southamerica-east1-c'}]
              }
            },
            'zones/asia-south1-b': {
              'warning': {
                'code': 'NO_RESULTS_ON_PAGE',
                'message':
                    'There are no results for scope \'zones/asia-south1-b\' on this page.',
                'data': [{'key': 'scope', 'value': 'zones/asia-south1-b'}]
              }
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
              'warning': {
                'code': 'NO_RESULTS_ON_PAGE',
                'message':
                    'There are no results for scope \'zones/northamerica-northeast1-a\' on this page.',
                'data': [
                  {'key': 'scope', 'value': 'zones/northamerica-northeast1-a'}
                ]
              }
            },
            'zones/northamerica-northeast1-b': {
              'warning': {
                'code': 'NO_RESULTS_ON_PAGE',
                'message':
                    'There are no results for scope \'zones/northamerica-northeast1-b\' on this page.',
                'data': [
                  {'key': 'scope', 'value': 'zones/northamerica-northeast1-b'}
                ]
              }
            },
            'zones/northamerica-northeast1-c': {
              'warning': {
                'code': 'NO_RESULTS_ON_PAGE',
                'message':
                    'There are no results for scope \'zones/northamerica-northeast1-c\' on this page.',
                'data': [
                  {'key': 'scope', 'value': 'zones/northamerica-northeast1-c'}
                ]
              }
            },
            'zones/europe-west4-c': {
              'warning': {
                'code': 'NO_RESULTS_ON_PAGE',
                'message':
                    'There are no results for scope \'zones/europe-west4-c\' on this page.',
                'data': [{'key': 'scope', 'value': 'zones/europe-west4-c'}]
              }
            },
            'zones/europe-west4-b': {
              'warning': {
                'code': 'NO_RESULTS_ON_PAGE',
                'message':
                    'There are no results for scope \'zones/europe-west4-b\' on this page.',
                'data': [{'key': 'scope', 'value': 'zones/europe-west4-b'}]
              }
            },
            'zones/europe-west4-a': {
              'warning': {
                'code': 'NO_RESULTS_ON_PAGE',
                'message':
                    'There are no results for scope \'zones/europe-west4-a\' on this page.',
                'data': [{'key': 'scope', 'value': 'zones/europe-west4-a'}]
              }
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
              'warning': {
                'code': 'NO_RESULTS_ON_PAGE',
                'message':
                    'There are no results for scope \'zones/us-west2-c\' on this page.',
                'data': [{'key': 'scope', 'value': 'zones/us-west2-c'}]
              }
            },
            'zones/us-west2-b': {
              'warning': {
                'code': 'NO_RESULTS_ON_PAGE',
                'message':
                    'There are no results for scope \'zones/us-west2-b\' on this page.',
                'data': [{'key': 'scope', 'value': 'zones/us-west2-b'}]
              }
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
      'nextPageToken': 'CgsIAxG6CAAAAAAAABIOCgxuMS1oaWdobWVtLTI=',
      'selfLink':
          'https://www.googleapis.com/compute/v1/projects/weiting-dev/aggregated/machineTypes',
      'kind': 'compute#machineTypeAggregatedList'
    }
