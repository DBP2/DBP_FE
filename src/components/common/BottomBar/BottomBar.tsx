import type { ReactNode } from 'react';

import { cn } from '@/utils/cn';

import './BottomBar.css';

interface BottomBarProps {
  errorMessage?: string | null;
  children: ReactNode;
  className?: string;
}

export default function BottomBar({ errorMessage, children, className }: BottomBarProps) {
  return (
    <div className={cn('bottom-bar', className)}>
      {errorMessage && <p className="bottom-bar__error">{errorMessage}</p>}
      {children}
    </div>
  );
}
