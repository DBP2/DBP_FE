import { useId, type InputHTMLAttributes } from 'react';

import FormField from '@/components/common/FormField/FormField';
import { cn } from '@/utils/cn';

import './TextField.css';

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  suffix?: string;
  hint?: string;
  error?: string;
}

export default function TextField({
  label,
  suffix,
  hint,
  error,
  required,
  className,
  id,
  ...props
}: TextFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <FormField
      label={label}
      htmlFor={inputId}
      required={required}
      hint={hint}
      error={error}
      className={className}
    >
      <div className={cn('form-field__control', error && 'form-field__control--error')}>
        <input
          id={inputId}
          className="text-field__input"
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={error || hint ? `${inputId}-message` : undefined}
          {...props}
        />
        {suffix && <span className="text-field__suffix">{suffix}</span>}
      </div>
    </FormField>
  );
}
