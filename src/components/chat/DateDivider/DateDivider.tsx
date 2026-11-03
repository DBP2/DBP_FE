import { formatChatDate } from '@/utils/formatChatDate';

import './DateDivider.css';

interface DateDividerProps {
  date: string;
}

export default function DateDivider({ date }: DateDividerProps) {
  return (
    <div className="date-divider">
      <span className="date-divider__label">{formatChatDate(date)}</span>
    </div>
  );
}
