import * as React from 'react';

export interface TextInputProps {
  id: string;
  label?: string;
  placeholder?: string;
}

export class TextInput extends React.Component<TextInputProps> {
  constructor(props: TextInputProps) {
    super(props);
  }

  render() {
    const {id, label, placeholder} = this.props;
    return (
      <div>
        {label && <span>{label}</span>}
        <div><input id={id} placeholder={placeholder} /></div>
      </div>
    );
  }
}
