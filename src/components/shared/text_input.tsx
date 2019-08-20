import * as React from 'react';
import {css} from '../../styles';

interface TextInputProps {
  label?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
}

/** Funtional Component for text input fields */
// tslint:disable-next-line:enforce-name-casing
export function TextInput(props: TextInputProps) {
  const {onChange, label, placeholder} = props;
  return (
    <div className={css.inputContainer}>
      {label && <label>{label}</label>}
      <input className={css.input} placeholder={placeholder}
        onChange={(e) => onChange && onChange(e.target.value)} />
    </div>
  );
}
