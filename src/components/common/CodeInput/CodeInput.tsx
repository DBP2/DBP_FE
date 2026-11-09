import { useState } from 'react';

import { cn } from '@/utils/cn';

import './CodeInput.css';

interface CodeInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  hasError?: boolean;
  autoFocus?: boolean;
  label: string;
  className?: string;
}

export default function CodeInput({
  value,
  onChange,
  length = 6,
  hasError = false,
  autoFocus = false,
  label,
  className,
}: CodeInputProps) {
  const [isFocused, setIsFocused] = useState(autoFocus);
  const cells = Array.from({ length }, (_, index) => value.charAt(index));
  const activeIndex = Math.min(value.length, length - 1);
  const isComplete = value.length === length;

  return (
    <div className={cn('code-input', hasError && 'code-input--error', className)}>
      <input
        className="code-input__field"
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        pattern="[0-9]*"
        maxLength={length}
        value={value}
        autoFocus={autoFocus}
        aria-label={label}
        onChange={(event) => onChange(event.target.value.replace(/\D/g, '').slice(0, length))}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      {cells.map((digit, index) => {
        const isActive = isFocused && index === activeIndex;
        return (
          <span
            key={index}
            className={cn(
              'code-input__cell',
              digit && 'code-input__cell--filled',
              isActive && 'code-input__cell--active',
            )}
            aria-hidden="true"
          >
            {digit}
            {isActive && !isComplete && <span className="code-input__caret" />}
          </span>
        );
      })}
    </div>
  );
}
