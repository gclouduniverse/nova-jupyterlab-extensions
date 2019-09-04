import * as React from 'react';

interface CheckboxInputProps {
  label?: string;
  name?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

/** Funtional Component for Checkbox input fields */
// tslint:disable-next-line:enforce-name-casing
export function CheckboxInput(props: CheckboxInputProps) {
  const {label, ...inputProps} = props;
  return (
    <div>
      <input type="checkbox" {...inputProps} />
      {label && <span>{label}</span>}
    </div>
  );
}
