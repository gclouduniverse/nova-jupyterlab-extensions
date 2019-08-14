import * as React from 'react';
import {Option} from '../../scheduler/data';

export interface SelectInputProps {
  id: string;
  label?: string;
  options?: Option[];
  onChange?: Function;
  forwardedRef?: React.RefObject<HTMLSelectElement>;
}

export class SelectInput extends React.Component<SelectInputProps> {
  constructor(props: SelectInputProps) {
    super(props);
  }

  componentDidMount() {
    const {onChange, options} = this.props;

    // Trigger onChange event on init deployment
    if (onChange && options && options.length > 1) {
      onChange(options[0].value);
    }
  }

  componentWillReceiveProps(nextProps: SelectInputProps) {
    if (this.props.options !== nextProps.options) {
      const {onChange, options} = nextProps;

      // Trigger onChange event on options change
      if (onChange && options && options.length > 1) {
        onChange(options[0].value);
      }
    }
  }

  private onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const {onChange} = this.props;

    if (onChange) {
      onChange(e.target.value);
    }
  }

  private renderOptions(options: Option[]) {
    return options.map((option: Option) => {
      return (<option value={option.value}>{option.text}</option>);
    });
  }

  render() {
    const {id, label, options, forwardedRef} = this.props;
    return (
      <div>
        {label && <div>{label}</div>}
        <select id={id}
          ref={forwardedRef}
          onChange={this.onChange.bind(this)}>
          {options && this.renderOptions(options)}
        </select >
      </div >
    );
  }
}

