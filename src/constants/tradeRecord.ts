import type { TagColor } from '@/components/common/Tag/Tag';
import type { TradeStatus } from '@/types/chat';
import type { TradeAction } from '@/types/tradeRecord';

export const TRADE_STATUS_TAG: Record<TradeStatus, { label: string; color: TagColor }> = {
  requested: { label: '요청됨', color: 'blue' },
  accepted: { label: '수락됨', color: 'green' },
  done: { label: '거래완료', color: 'gray' },
};

export const TRADE_ACTION_LABEL: Record<TradeAction, string> = {
  DROP_OFF: '두고가기',
  PICK_UP: '가져가기',
};

export const TRADE_ACTION_PHOTO_LABEL: Record<TradeAction, string> = {
  DROP_OFF: '보관 사진',
  PICK_UP: '수령 사진',
};
