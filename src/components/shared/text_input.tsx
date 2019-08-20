import * as React from 'react';

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
    <div>
      {label && <span>{label}</span>}
      <div><input placeholder={placeholder}
        onChange={(e) => onChange && onChange(e.target.value)} />
      </div>
    </div>
  );
}
