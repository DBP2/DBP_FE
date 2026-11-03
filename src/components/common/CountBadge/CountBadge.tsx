import { cn } from '@/utils/cn';

import './CountBadge.css';

interface CountBadgeProps {
  count: number;
  max?: number;
  className?: string;
}

export default function CountBadge({ count, max = 99, className }: CountBadgeProps) {
  if (count <= 0) return null;

  return (
    <span className={cn('count-badge', className)} aria-label={`안 읽은 메시지 ${count}개`}>
      <span className="count-badge__text">{count > max ? `${max}+` : count}</span>
    </span>
  );
}
