import type { ReportTypeOption as ReportTypeOptionData } from '@/constants/report';
import type { ReportType } from '@/types/report';
import { cn } from '@/utils/cn';

import './ReportTypeOption.css';

interface ReportTypeOptionProps {
  option: ReportTypeOptionData;
  name: string;
  checked: boolean;
  onChange: (value: ReportType) => void;
}

export default function ReportTypeOption({
  option,
  name,
  checked,
  onChange,
}: ReportTypeOptionProps) {
  return (
    <label className={cn('report-type-option', checked && 'report-type-option--checked')}>
      <input
        type="radio"
        className="report-type-option__input"
        name={name}
        value={option.value}
        checked={checked}
        onChange={() => onChange(option.value)}
      />
      <span className="report-type-option__radio" aria-hidden="true" />
      <span className="report-type-option__text">
        <span className="report-type-option__label">{option.label}</span>
        <span className="report-type-option__description">{option.description}</span>
      </span>
    </label>
  );
}
