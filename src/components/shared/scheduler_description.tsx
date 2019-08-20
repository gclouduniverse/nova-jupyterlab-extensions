import * as React from 'react';
import {LearnMoreLink} from './learn_more_link';

const DESCRIPTION = `Schedule and run this Notebook from start to finish
at the specified frequency. The executed Notebook will be saved to a
Cloud Storage bucket and viewable from a dashboard. Using this feature will
incur additional charges for running an AI Platform Training Job.`;
const LINK = 'https://cloud.google.com/ml-engine/docs/pricing';

/** Functional Component for the Scheduler Documentation */
// tslint:disable-next-line:enforce-name-casing
export function SchedulerDescription() {
  return (
    <div>
      <div>{DESCRIPTION}</div>
      <LearnMoreLink href={LINK} />
    </div>
  );
}
