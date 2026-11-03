import type { ReactNode } from 'react';
import { useNavigate } from 'react-router';

import backIcon from '@/assets/images/backBtn.svg';
import { cn } from '@/utils/cn';

import './PageHeader.css';

interface PageHeaderProps {
  title?: ReactNode;
  subtitle?: ReactNode;
  right?: ReactNode;
  onBack?: () => void;
  className?: string;
}

export default function PageHeader({ title, subtitle, right, onBack, className }: PageHeaderProps) {
  const navigate = useNavigate();
  const handleBack = onBack ?? (() => navigate(-1));

  return (
    <header className={cn('page-header', className)}>
      <button
        type="button"
        className="page-header__button"
        onClick={handleBack}
        aria-label="뒤로가기"
      >
        <img src={backIcon} alt="" width={24} height={24} />
      </button>
      <div className="page-header__center">
        {title && <h1 className="page-header__title">{title}</h1>}
        {subtitle && <p className="page-header__subtitle">{subtitle}</p>}
      </div>
      <div className="page-header__right">{right}</div>
    </header>
  );
}
