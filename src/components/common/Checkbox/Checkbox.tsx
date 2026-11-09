import { useId, type InputHTMLAttributes, type ReactNode } from 'react';

import checkIcon from '@/assets/images/check_white.svg';
import { cn } from '@/utils/cn';

import './Checkbox.css';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  children: ReactNode;
}

export default function Checkbox({ children, className, id, ...props }: CheckboxProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <label className={cn('checkbox', className)} htmlFor={inputId}>
      <input id={inputId} type="checkbox" className="checkbox__input" {...props} />
      <span className="checkbox__box" aria-hidden="true">
        <img src={checkIcon} alt="" width={14} height={14} />
      </span>
      <span className="checkbox__label">{children}</span>
    </label>
  );
}
