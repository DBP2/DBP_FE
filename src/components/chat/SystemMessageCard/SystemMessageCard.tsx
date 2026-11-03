import type { ReactNode } from 'react';

import checkIcon from '@/assets/images/check_blue.svg';
import type { SystemMessage, SystemMessageType } from '@/types/chat';

import './SystemMessageCard.css';

const SYSTEM_TEXT: Record<SystemMessageType, ReactNode> = {
  TRADE_ACCEPTED: (
    <>
      판매자가 거래를 <strong className="system-message-card__point">수락</strong>했어요
    </>
  ),
  TRADE_COMPLETED: (
    <>
      거래가 <strong className="system-message-card__point">완료</strong>되었어요
    </>
  ),
  SAFE_ZONE_RECORDED: (
    <>
      <strong className="system-message-card__point">Safe Zone 기록</strong>이 저장되었어요
    </>
  ),
};

interface SystemMessageCardProps {
  message: SystemMessage;
}

export default function SystemMessageCard({ message }: SystemMessageCardProps) {
  return (
    <div className="system-message-card">
      <span className="system-message-card__icon">
        <img src={checkIcon} alt="" width={18} height={18} />
      </span>
      <div className="system-message-card__text">
        <p>{SYSTEM_TEXT[message.systemType]}</p>
        {message.placeName && (
          <p className="system-message-card__place">
            <span className="system-message-card__place-label">거래 장소</span>
            {message.placeName}
          </p>
        )}
      </div>
    </div>
  );
}
