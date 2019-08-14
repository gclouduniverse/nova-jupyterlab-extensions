import * as React from 'react';
import {Launch} from '@material-ui/icons';

export class SchedulerDescription extends React.Component {
  render() {
    const DESCRIPTION = `Schedule a notebook run and this notebook will be
                        automatically executed from the beginning to the end
                        based on the specified frequency. The finished
                        notebooks will be saved in a Cloud Storage bucket and
                        viewable from a dashboard. Using this feature will add
                        additional cost.`;

    return (
      <div>
        <div>{DESCRIPTION}</div>
        <a href=""
          target="_blank">
          Learn more
          <Launch fontSize='small' classes={{fontSizeSmall: 'smallIcon'}} />
        </a>
      </div>
    );
  }
}
