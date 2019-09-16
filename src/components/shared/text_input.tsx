import * as React from 'react';
import { classes } from 'typestyle';

import { css } from '../../styles';

interface TextInputProps {
  label?: string;
  name?: string;
  value?: string;
  placeholder?: string;
  hasError?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

/** Funtional Component for text input fields */
// tslint:disable-next-line:enforce-name-casing
export function TextInput(props: TextInputProps) {
  const { label, hasError, ...inputProps } = props;
  return (
    <div className={classes(css.inputContainer, hasError && 'error')}>
      {label && <label>{label}</label>}
      <input
        className={classes(css.input, hasError && 'error')}
        {...inputProps}
      />
    </div>
  );
}
