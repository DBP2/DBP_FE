import type { ChatRole, TradeStatus } from '@/types/chat';
import type { SafeZone } from '@/types/safeZone';

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

export interface TradeRecord {
  id: string;
  tradeId: string;
  safeZone: SafeZone;
  lockerNumber: string | null;
  action: TradeAction;
  photoUrls: string[];
  recordedAt: string;
}
