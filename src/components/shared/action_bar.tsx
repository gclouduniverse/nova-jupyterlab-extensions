import * as csstips from 'csstips';
import * as React from 'react';

import { style } from 'typestyle';
import { css } from '../../styles';
import { OnDialogClose } from '../dialog';

interface Props {
  children?: React.ReactNode;
  closeLabel?: string;
  onDialogClose: OnDialogClose;
}

const actionBar = style({
  paddingTop: '16px',
  paddingRight: '2px',
  $nest: {
    '&>*': {
      marginLeft: '16px',
    },
  },
  ...csstips.horizontal,
  ...csstips.endJustified,
});

/** Funtional Component for defining an action bar with buttons. */
export function ActionBar(props: Props) {
  return (
    <div className={actionBar}>
      <button
        type="button"
        className={css.button}
        onClick={props.onDialogClose}
      >
        {props.closeLabel || 'Close'}
      </button>
      {props.children}
    </div>
  );
}
