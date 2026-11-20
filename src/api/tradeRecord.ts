import { request } from '@/api/client';
import type { SaveTradeRecordRequest, TradeRecord, TradeRecordInfo } from '@/types/tradeRecord';

export function getTradeRecordInfo(tradeId: string): Promise<TradeRecordInfo> {
  return request<TradeRecordInfo>(`/trades/${tradeId}/record-info`);
}

export function getMyTradeRecord(tradeId: string): Promise<TradeRecord | null> {
  return request<TradeRecord | null>(`/trades/${tradeId}/records/me`);
}

export function saveTradeRecord(
  tradeId: string,
  saveRequest: SaveTradeRecordRequest,
): Promise<TradeRecord> {
  const formData = new FormData();
  formData.append('safeZoneId', saveRequest.safeZoneId);
  formData.append('action', saveRequest.action);
  saveRequest.photos.forEach((photo) => formData.append('photos', photo));
  return request<TradeRecord>(`/trades/${tradeId}/records`, {
    method: 'POST',
    body: formData,
  });
}
