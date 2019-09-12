import * as React from 'react';
import { css } from '../../styles';

interface FieldErrorProps {
  message?: string;
}

/** Funtional Component for select fields */
// tslint:disable-next-line:enforce-name-casing
export function FieldError(props: FieldErrorProps) {
  const { message } = props;

  if (!message) {
    return null;
  }

  return <div className={css.errorMessage}>{message}</div>;
}
