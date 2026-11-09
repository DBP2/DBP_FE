import { useId, type SelectHTMLAttributes } from 'react';

import FormField from '@/components/common/FormField/FormField';
import { cn } from '@/utils/cn';

import './SelectField.css';

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: readonly string[];
  placeholder?: string;
  hint?: string;
  error?: string;
}

export default function SelectField({
  label,
  options,
  placeholder,
  hint,
  error,
  required,
  className,
  id,
  value,
  ...props
}: SelectFieldProps) {
  const generatedId = useId();
  const selectId = id ?? generatedId;

  return (
    <FormField
      label={label}
      htmlFor={selectId}
      required={required}
      hint={hint}
      error={error}
      className={className}
    >
      <div className={cn('form-field__control', error && 'form-field__control--error')}>
        <select
          id={selectId}
          className={cn('select-field__select', !value && 'select-field__select--empty')}
          required={required}
          value={value}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </FormField>
  );
}
