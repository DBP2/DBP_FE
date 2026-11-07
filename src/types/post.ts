export type TradeMethod = 'SAFE_ZONE' | 'DIRECT';

export type ItemCondition = 'HIGH' | 'MEDIUM' | 'LOW';

export interface PostDraft {
  images: File[];
  title: string;
  category: string;
  courseName: string;
  description: string;
  price: number;
  condition: ItemCondition;
  tradeMethods: TradeMethod[];
  availableTime: string;
}

export interface CreatePostRequest extends PostDraft {
  safeZoneIds: string[];
  messageToBuyer: string;
}

export interface CreatePostResponse {
  id: string;
}
