import type { ReactNode } from 'react';

import { cn } from '@/utils/cn';

import './OptionCard.css';

interface OptionCardProps {
  type?: 'checkbox' | 'radio';
  name?: string;
  title: ReactNode;
  description?: ReactNode;
  right?: ReactNode;
  checked: boolean;
  onChange: () => void;
  layout?: 'inline' | 'stacked';
  className?: string;
}

export default function OptionCard({
  type = 'checkbox',
  name,
  title,
  description,
  right,
  checked,
  onChange,
  layout = 'inline',
  className,
}: OptionCardProps) {
  return (
    <label
      className={cn(
        'option-card',
        `option-card--${layout}`,
        checked && 'option-card--checked',
        className,
      )}
    >
      <input
        className="option-card__input"
        type={type}
        name={name}
        checked={checked}
        onChange={onChange}
      />
      <span className={cn('option-card__control', `option-card__control--${type}`)} />
      <span className="option-card__text">
        <span className="option-card__title">{title}</span>
        {description && <span className="option-card__description">{description}</span>}
      </span>
      {right}
    </label>
  );
}
