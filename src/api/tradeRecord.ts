import { ApiError } from '@/api/client';
import { CHAT_ROOM_DETAILS_MOCK } from '@/mocks/chatRoomDetails';
import type { SaveTradeRecordRequest, TradeRecordInfo } from '@/types/tradeRecord';

export function getTradeRecordInfo(tradeId: string): Promise<TradeRecordInfo> {
  const room = CHAT_ROOM_DETAILS_MOCK.find((item) => item.tradeId === tradeId);
  if (!room) return Promise.reject(new ApiError(404, '거래를 찾을 수 없어요'));
  return Promise.resolve({
    tradeId,
    roomId: room.id,
    postTitle: room.post.title,
    price: room.post.price,
    tradeStatus: room.tradeStatus,
    myRole: room.myRole,
  });
}

export function saveTradeRecord(tradeId: string, request: SaveTradeRecordRequest): Promise<void> {
  void tradeId;
  void request;
  return Promise.resolve();
}
