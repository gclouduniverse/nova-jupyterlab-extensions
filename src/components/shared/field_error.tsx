import * as React from 'react';
import { style } from 'typestyle';

import { COLORS } from '../../styles';

interface FieldErrorProps {
  message?: string;
}

const error = style({
  color: COLORS.red,
  paddingBottom: '10px',
});

/** Funtional Component for select fields */
// tslint:disable-next-line:enforce-name-casing
export function FieldError(props: FieldErrorProps) {
  const { message } = props;
  return message ? <div className={error}>{message}</div> : null;
}
