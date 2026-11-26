export type TradeType = 'BUY' | 'SELL';
export type TradeStatus = 'REQUESTED' | 'ACCEPTED' | 'SAFE_ZONE' | 'COMPLETED';

export interface TradeItem {
  id: string;
  type: TradeType;
  status: TradeStatus;
  title: string;
  traderName: string;
  price: number;
  imageUrl?: string;
  requestedAt: string;
  hasReviewed?: boolean;
}

export interface ProofRecord {
  id: string;
  title: string;
  uploaderRole: 'SELLER' | 'BUYER';
  timestamp?: string;
}

export interface UserSummary {
  id: string;
  nickname: string;
  department: string;
  trustScore: number;
  isSchoolVerified: boolean;
  profileUrl?: string;
}

export interface TradeDetail extends TradeItem {
  conditionSummary: string;
  location: string;
  createdAt: string;

  myRole: 'BUYER' | 'SELLER';
  seller: UserSummary;
  buyer: UserSummary;

  proofRecords: ProofRecord[];
}

export const TRADE_STATUS_LABEL: Record<TradeStatus, string> = {
  REQUESTED: '수락 대기',
  ACCEPTED: '수락됨',
  SAFE_ZONE: 'Safe Zone 보관',
  COMPLETED: '거래완료',
};

export const getTrustGrade = (score: number): string => {
  if (score >= 4.8) return 'A';
  if (score >= 4.5) return 'B';
  if (score >= 4.0) return 'C';
  return 'D';
};

export interface TradeReviewRequest {
  tradeId: string;
  rating: number;
  tags: string[];
}
