import {Option} from './option';

export interface Region extends Option{
  zones: Option[];
}
/** Supported regions and zones. */
export const REGIONS: Region[] = [
  {
    value: 'us-east1',
    text: 'us-east1 (South Carolina)',
    zones: [
      buildZone('us-east1-b'),
      buildZone('us-east1-c'),
      buildZone('us-east1-d'),
    ],
  },
  {
    value: 'us-west1',
    text: 'us-west1 (Oregon)',
    zones: [
      buildZone('us-west1-a'),
      buildZone('us-west1-b'),
      buildZone('us-west1-c'),
    ],
  },
  {
    value: 'asia-east1',
    text: 'asia-east1 (Taiwan)',
    zones: [
      buildZone('asia-east1-a'),
      buildZone('asia-east1-b'),
      buildZone('asia-east1-c'),
    ],
  },
  {
    value: 'europe-west1',
    text: 'europe-west1 (Belgium)',
    zones: [
      buildZone('europe-west1-b'),
      buildZone('europe-west1-c'),
      buildZone('europe-west1-d'),
    ],
  },
  {
    value: 'australia-southeast1',
    text: 'australia-southeast1 (Sydney)',
    zones: [
      buildZone('australia-southeast1-a'),
      buildZone('australia-southeast1-b'),
      buildZone('australia-southeast1-c'),
    ],
  },
  {
    value: 'northamerica-northeast1',
    text: 'northamerica-northeast1 (Montreal)',
    zones: [
      buildZone('northamerica-northeast1-a'),
      buildZone('northamerica-northeast1-b'),
      buildZone('northamerica-northeast1-c'),
    ]
  },
];

function buildZone(value: string, text = value) {
  return {
    value,
    text,
  };
}
