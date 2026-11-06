// 거래별 신청일과 Safe Zone 사진 기록 수 (신고 시 증빙으로 자동 첨부)
export const REPORT_TRADES_MOCK: Record<string, { requestedAt: string; photoCount: number }> = {
  'trade-1': { requestedAt: '2026-09-26T14:10:00+09:00', photoCount: 2 },
  'trade-2': { requestedAt: '2026-09-28T10:00:00+09:00', photoCount: 0 },
  'trade-3': { requestedAt: '2026-10-02T18:30:00+09:00', photoCount: 1 },
  'trade-4': { requestedAt: '2026-09-18T12:00:00+09:00', photoCount: 2 },
};
