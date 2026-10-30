export type ChatRole = 'buyer' | 'seller';

export type TradeStatus = 'ongoing' | 'done';

export interface ChatPartner {
  id: string;
  name: string;
  isVerified: boolean;
}

export interface ChatRoom {
  id: string;
  partner: ChatPartner;
  myRole: ChatRole;
  tradeStatus: TradeStatus;
  postTitle: string;
  thumbnailUrl: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}
