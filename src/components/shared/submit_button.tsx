import * as React from 'react';
import { classes, stylesheet } from 'typestyle';

import { COLORS, css } from '../../styles';

interface Props {
  actionPending: boolean;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  text: string;
}

const localStyles = stylesheet({
  submit: {
    backgroundColor: '#1a73e8',
    color: COLORS.white,
    marginLeft: '16px',
    $nest: {
      '&:disabled': {
        backgroundColor: '#bfbfbf',
      },
      '&:hover': {
        cursor: 'pointer',
      },
      '&:disabled:hover': { cursor: 'default' },
    },
  },
  disabled: {
    backgroundColor: 'var(--md-grey-300, #e0e0e0)',
    color: 'var(--md-grey-500, #9e9e9e)',
    cursor: 'not-allowed',
    marginLeft: '16px',
  },
});

/**
 * Function component for Submit Button that displays as a progress indicator.
 */
// tslint:disable-next-line:enforce-name-casing
export function SubmitButton(props: Props) {
  return (
    <button
      className={classes(
        css.button,
        props.actionPending ? localStyles.disabled : localStyles.submit
      )}
      disabled={props.actionPending}
      onClick={props.onClick}
    >
      {props.text}
    </button>
  );
}
