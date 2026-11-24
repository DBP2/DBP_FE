import { cn } from '@/utils/cn';

import './SignupStep.css';

interface SignupStepProps {
  current: number;
  total: number;
  label: string;
  className?: string;
}

export default function SignupStep({ current, total, label, className }: SignupStepProps) {
  return (
    <div className={cn('signup-step', className)}>
      <p className="signup-step__label">
        <span className="signup-step__count">
          {current} / {total}
        </span>
        {` · ${label}`}
      </p>
      <div
        className="signup-step__track"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={current}
        aria-label="회원가입 진행 단계"
      >
        <div className="signup-step__bar" style={{ width: `${(current / total) * 100}%` }} />
      </div>
    </div>
  );
}
