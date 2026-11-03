import Button from '@/components/common/Button/Button';
import { cn } from '@/utils/cn';

import './ErrorState.css';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export default function ErrorState({
  message = '불러오지 못했어요',
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div className={cn('error-state', className)}>
      <p className="error-state__message">{message}</p>
      {onRetry && (
        <Button variant="soft" size="sm" onClick={onRetry}>
          다시 시도
        </Button>
      )}
    </div>
  );
}
