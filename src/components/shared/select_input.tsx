import * as React from 'react';
import { Option } from '../../data';
import { css } from '../../styles';

interface SelectInputProps {
  label?: string;
  name?: string;
  value?: string;
  options?: Option[];
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

/** Funtional Component for select fields */
// tslint:disable-next-line:enforce-name-casing
export function SelectInput(props: SelectInputProps) {
  const { label, options, ...inputProps } = props;
  return (
    <div className={css.inputContainer}>
      {label && <label>{label}</label>}
      <select className={css.input} {...inputProps}>
        {options &&
          options.map((o, i) => (
            <option key={i} value={o.value}>
              {o.text}
            </option>
          ))}
      </select>
    </div>
  );
}
