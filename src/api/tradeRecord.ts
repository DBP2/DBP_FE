import { ApiError } from '@/api/client';
import { CHAT_ROOM_DETAILS_MOCK } from '@/mocks/chatRoomDetails';
import { SAFE_ZONES_MOCK } from '@/mocks/safeZones';
import type { SaveTradeRecordRequest, TradeRecord, TradeRecordInfo } from '@/types/tradeRecord';

const recordStore = new Map<string, TradeRecord>();

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

export function getMyTradeRecord(tradeId: string): Promise<TradeRecord | null> {
  return Promise.resolve(recordStore.get(tradeId) ?? null);
}

export function saveTradeRecord(
  tradeId: string,
  request: SaveTradeRecordRequest,
): Promise<TradeRecord> {
  const safeZone = SAFE_ZONES_MOCK.find((zone) => zone.id === request.safeZoneId);
  if (!safeZone) return Promise.reject(new ApiError(400, '장소 정보가 올바르지 않아요'));
  const record: TradeRecord = {
    id: crypto.randomUUID(),
    tradeId,
    safeZone,
    lockerNumber: '3번 칸',
    action: request.action,
    photoUrls: request.photos.map((photo) => URL.createObjectURL(photo)),
    recordedAt: new Date().toISOString(),
  };
  recordStore.set(tradeId, record);
  return Promise.resolve(record);
}
