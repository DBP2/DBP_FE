import type { ChatRole, TradeStatus } from '@/types/chat';

export type TradeAction = 'DROP_OFF' | 'PICK_UP';

export interface TradeRecordInfo {
  tradeId: string;
  roomId: string;
  postTitle: string;
  price: number;
  tradeStatus: TradeStatus;
  myRole: ChatRole;
}

export interface SaveTradeRecordRequest {
  safeZoneId: string;
  action: TradeAction;
  photos: File[];
}
