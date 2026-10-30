import { cn } from '@/utils/cn';

import './ChipGroup.css';

export interface ChipOption<T extends string> {
  value: T;
  label: string;
}

interface ChipGroupProps<T extends string> {
  options: readonly ChipOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

export default function ChipGroup<T extends string>({
  options,
  value,
  onChange,
  className,
}: ChipGroupProps<T>) {
  return (
    <div className={cn('chip-group', className)}>
      {options.map((option) => {
        const isSelected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            className={cn('chip-group__chip', isSelected && 'chip-group__chip--selected')}
            aria-pressed={isSelected}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
