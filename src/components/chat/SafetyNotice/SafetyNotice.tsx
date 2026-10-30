import shieldIcon from '@/assets/images/shield_icon.svg';
import { cn } from '@/utils/cn';

import './SafetyNotice.css';

interface SafetyNoticeProps {
  className?: string;
}

export default function SafetyNotice({ className }: SafetyNoticeProps) {
  return (
    <div className={cn('safety-notice', className)}>
      <img className="safety-notice__icon" src={shieldIcon} alt="" width={20} height={20} />
      <p className="safety-notice__text">
        외부 메신저·선입금 유도는 사기 신고 대상이에요.
        <br />
        거래는 채팅 안에서 진행해 주세요.
      </p>
    </div>
  );
}
