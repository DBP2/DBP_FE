import { ApiError } from '@/api/client';
import { CHAT_ROOM_DETAILS_MOCK } from '@/mocks/chatRoomDetails';
import { REPORT_TRADES_MOCK } from '@/mocks/reportTrades';
import type { ReportRequest, ReportTarget } from '@/types/report';

export function getReportTarget(userId: string, tradeId: string | null): Promise<ReportTarget> {
  const room = CHAT_ROOM_DETAILS_MOCK.find((item) => item.partner.id === userId);
  if (!room) return Promise.reject(new ApiError(404, '신고 대상을 찾을 수 없어요'));

  const tradeRoom = tradeId
    ? CHAT_ROOM_DETAILS_MOCK.find((item) => item.tradeId === tradeId && item.partner.id === userId)
    : undefined;
  const record = tradeRoom ? REPORT_TRADES_MOCK[tradeRoom.tradeId] : undefined;

  return Promise.resolve({
    id: room.partner.id,
    name: room.partner.name,
    trade:
      tradeRoom && record
        ? {
            id: tradeRoom.tradeId,
            postTitle: tradeRoom.post.title,
            requestedAt: record.requestedAt,
            photoCount: record.photoCount,
          }
        : null,
  });
}

export function submitReport(_request: ReportRequest): Promise<void> {
  return Promise.resolve();
}
