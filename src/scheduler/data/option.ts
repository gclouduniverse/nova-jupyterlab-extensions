export interface Option {
  text: string;
  value: string|number;
  disabled?: boolean;
}

/** Returns an option whose value matches the given value. */
export function findOptionByValue<T extends Option>(
    options: T[], value: string|number|undefined): T|undefined {
  if (value === undefined) return undefined;
  return options.find(option => option.value === value);
}
