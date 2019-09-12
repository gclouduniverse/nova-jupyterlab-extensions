import * as React from 'react';
import { CircularProgress, withStyles } from '@material-ui/core';
import { classes } from 'typestyle';

import { COLORS, css } from '../../styles';

interface Props {
  actionPending: boolean;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  text: string;
}

// tslint:disable-next-line:enforce-name-casing
const Progress = withStyles({
  root: {
    color: COLORS.link,
  },
})(CircularProgress);

/**
 * Function component for Submit Button that displays as a progress indicator.
 */
// tslint:disable-next-line:enforce-name-casing
export function SubmitButton(props: Props) {
  const { actionPending, text, ...inputProps } = props;

  return actionPending ? (
    <Progress size="18px" />
  ) : (
    <button className={classes(css.button, css.submitButton)} {...inputProps}>
      {text}
    </button>
  );
}
