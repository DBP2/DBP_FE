export type TrustGrade = 'A' | 'B' | 'C' | 'D';

export interface ReviewKeyword {
  label: string;
  count: number;
}

export interface MyProfile {
  trustGrade: TrustGrade;
  rating: number;
  hasSanction: boolean;
  nextGrade: TrustGrade | null;
  tradesToNextGrade: number;
  gradeProgress: number;
  completedTradeCount: number;
  reviewCount: number;
  onTimeReturnRate: number;
  reviewKeywords: ReviewKeyword[];
  postCount: number;
  wishCount: number;
}
