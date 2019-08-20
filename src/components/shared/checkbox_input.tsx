import * as React from 'react';

interface CheckboxInputProps {
  label?: string;
  onChange?: (checked: boolean) => void;
}

/** Funtional Component for Checkbox input fields */
// tslint:disable-next-line:enforce-name-casing
export function CheckboxInput(props: CheckboxInputProps) {
  const {onChange, label} = props;
  return (
    <div>
      <input type="checkbox"
        onChange={(e) => onChange && onChange(e.target.checked)} />
      {label && <span>{label}</span>}
    </div>
  );
}
