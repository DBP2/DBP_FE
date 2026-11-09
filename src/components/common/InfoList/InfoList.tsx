import type { ReactNode } from 'react';

import { cn } from '@/utils/cn';

import './InfoList.css';

export interface InfoListItem {
  label: string;
  value: ReactNode;
}

interface InfoListProps {
  items: InfoListItem[];
  className?: string;
}

export default function InfoList({ items, className }: InfoListProps) {
  return (
    <dl className={cn('info-list', className)}>
      {items.map((item) => (
        <div key={item.label} className="info-list__row">
          <dt className="info-list__label">{item.label}</dt>
          <dd className="info-list__value">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
