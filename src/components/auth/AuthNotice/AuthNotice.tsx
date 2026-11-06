import type { ReactNode } from 'react';

import shieldIcon from '@/assets/images/shield_icon.svg';
import { cn } from '@/utils/cn';

import './AuthNotice.css';

interface AuthNoticeProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export default function AuthNotice({ title, children, className }: AuthNoticeProps) {
  return (
    <div className={cn('auth-notice', className)}>
      <img className="auth-notice__icon" src={shieldIcon} alt="" width={18} height={18} />
      <div>
        {title && <p className="auth-notice__title">{title}</p>}
        <p className="auth-notice__text">{children}</p>
      </div>
    </div>
  );
}
