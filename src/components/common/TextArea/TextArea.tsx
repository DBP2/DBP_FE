import type { TextareaHTMLAttributes } from 'react';

import { cn } from '@/utils/cn';

import './TextArea.css';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  value: string;
  maxLength: number;
}

export default function TextArea({ value, maxLength, className, ...props }: TextAreaProps) {
  return (
    <div className={cn('text-area', className)}>
      <textarea className="text-area__input" value={value} maxLength={maxLength} {...props} />
      <span className="text-area__count">
        {value.length}/{maxLength}
      </span>
    </div>
  );
}
