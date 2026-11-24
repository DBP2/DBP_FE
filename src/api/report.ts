import { ApiError } from '@/api/client';
import { REPORT_TRADES_MOCK, REPORT_USERS_MOCK } from '@/mocks/reportTrades';
import type { ReportRequest, ReportTarget } from '@/types/report';

export function getReportTarget(userId: string, tradeId: string | null): Promise<ReportTarget> {
  const name = REPORT_USERS_MOCK[userId];
  if (!name) return Promise.reject(new ApiError(404, '신고 대상을 찾을 수 없어요'));

  const record = tradeId ? REPORT_TRADES_MOCK[tradeId] : undefined;

  return Promise.resolve({
    id: userId,
    name,
    trade:
      tradeId && record && record.userId === userId
        ? {
            id: tradeId,
            postTitle: record.postTitle,
            requestedAt: record.requestedAt,
            photoCount: record.photoCount,
          }
        : null,
  });
}

export function submitReport(_request: ReportRequest): Promise<void> {
  return Promise.resolve();
}
