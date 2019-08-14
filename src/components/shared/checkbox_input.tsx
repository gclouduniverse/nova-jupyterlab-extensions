import * as React from 'react';

export interface CheckboxInputProps {
  id: string;
  label?: string;
}

export class CheckboxInput extends React.Component<CheckboxInputProps> {
  constructor(props: CheckboxInputProps) {
    super(props);
  }

  render() {
    const {id, label} = this.props;

    return (
      <div>
        <input type="checkbox" id={id} />
        {label && <span>{label}</span>}
      </div>
    );
  }
}
