import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

import { cn } from '@/utils/cn';

import './BottomSheet.css';

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  closeOnDimClick?: boolean;
  className?: string;
}

export default function BottomSheet({
  open,
  onClose,
  children,
  closeOnDimClick = true,
  className,
}: BottomSheetProps) {
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="bottom-sheet">
      <div className="bottom-sheet__dim" onClick={closeOnDimClick ? onClose : undefined} />
      <div className={cn('bottom-sheet__panel', className)} role="dialog" aria-modal="true">
        <span className="bottom-sheet__handle" />
        {children}
      </div>
    </div>,
    document.body,
  );
}
