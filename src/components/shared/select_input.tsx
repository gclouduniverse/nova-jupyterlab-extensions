import * as React from 'react';
import {Option} from '../../data';

interface SelectInputProps {
  label?: string;
  options?: Option[];
  onChange?: (value: string) => void;
}

/** Funtional Component for select fields */
// tslint:disable-next-line:enforce-name-casing
export function SelectInput(props: SelectInputProps) {
  const {onChange, label, options} = props;
  return (
    <div>{label && <div>{label}</div>}
      <select onChange={(e) => onChange && onChange(e.target.value)}>
        {options && options.map((o, i) =>
          <option key={i} value={o.value}>{o.text}</option>
        )}
      </select>
    </div>
  );
}

