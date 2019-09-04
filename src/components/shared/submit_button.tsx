import * as React from 'react';
import { classes } from 'typestyle';

import { css } from '../../styles';

interface Props {
  actionPending: boolean;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  text: string;
}

/**
 * Function component for Submit Button that displays as a progress indicator.
 */
// tslint:disable-next-line:enforce-name-casing
export function SubmitButton(props: Props) {
  return (
    <button
      className={classes(
        css.button,
        props.actionPending ? css.submitButtonDisabled : css.submitButton
      )}
      disabled={props.actionPending}
      onClick={props.onClick}
    >
      {props.text}
    </button>
  );
}
