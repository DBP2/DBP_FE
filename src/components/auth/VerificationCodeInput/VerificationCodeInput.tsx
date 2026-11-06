import { useRef } from 'react';

import { cn } from '@/utils/cn';

import './VerificationCodeInput.css';

interface VerificationCodeInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  disabled?: boolean;
  hasError?: boolean;
  className?: string;
}

export default function VerificationCodeInput({
  value,
  onChange,
  length = 6,
  disabled = false,
  hasError = false,
  className,
}: VerificationCodeInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const activeIndex = Math.min(value.length, length - 1);

  return (
    <div
      className={cn('verification-code-input', className)}
      onClick={() => inputRef.current?.focus()}
    >
      <input
        ref={inputRef}
        className="verification-code-input__native"
        value={value}
        onChange={(event) => onChange(event.target.value.replace(/\D/g, '').slice(0, length))}
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={length}
        disabled={disabled}
        aria-label={`인증번호 ${length}자리`}
        aria-invalid={hasError}
        autoFocus
      />
      {Array.from({ length }, (_, index) => (
        <span
          key={index}
          className={cn(
            'verification-code-input__cell',
            index === activeIndex && 'verification-code-input__cell--active',
            hasError && 'verification-code-input__cell--error',
          )}
          aria-hidden="true"
        >
          {value[index]}
        </span>
      ))}
    </div>
  );
}
