export type ReportType = 'FRAUD' | 'MANNER';

export interface ReportTrade {
  id: string;
  postTitle: string;
  requestedAt: string;
  photoCount: number;
}

export interface ReportTarget {
  id: string;
  name: string;
  trade: ReportTrade | null;
}

export interface ReportRequest {
  targetId: string;
  tradeId: string | null;
  type: ReportType;
  reason: string;
}
