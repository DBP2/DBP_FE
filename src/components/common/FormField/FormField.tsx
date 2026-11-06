import type { ReactNode } from 'react';

import { cn } from '@/utils/cn';

import './FormField.css';

interface FormFieldProps {
  label: string;
  htmlFor: string;
  required?: boolean;
  hint?: string;
  error?: string;
  className?: string;
  children: ReactNode;
}

export default function FormField({
  label,
  htmlFor,
  required = false,
  hint,
  error,
  className,
  children,
}: FormFieldProps) {
  const message = error ?? hint;

  return (
    <div className={cn('form-field', className)}>
      <label className="form-field__label" htmlFor={htmlFor}>
        {label}
        {required && <span className="form-field__required"> *</span>}
      </label>
      {children}
      {message && (
        <p
          id={`${htmlFor}-message`}
          className={cn('form-field__message', error && 'form-field__message--error')}
        >
          {message}
        </p>
      )}
    </div>
  );
}
