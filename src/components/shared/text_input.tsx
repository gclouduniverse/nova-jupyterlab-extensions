import * as React from 'react';
import {css} from '../../styles';

interface TextInputProps {
  label?: string;
  name?: string;
  value?: string;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<any>) => void;
}

/** Funtional Component for text input fields */
// tslint:disable-next-line:enforce-name-casing
export function TextInput(props: TextInputProps) {
  const {label, ...inputProps} = props;
  return (
    <div className={css.inputContainer}>
      {label && <label>{label}</label>}
      <input
        className={css.input}
        {...inputProps} />
    </div>
  );
}
