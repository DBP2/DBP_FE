export type ChatRole = 'buyer' | 'seller';

export type TradeStatus = 'requested' | 'accepted' | 'done';

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

export interface ChatRoomPartner extends ChatPartner {
  trustGrade: string | null;
}

export interface ChatRoomPost {
  id: string;
  title: string;
  price: number;
  thumbnailUrl: string;
}

export interface ChatRoomDetail {
  id: string;
  tradeId: string;
  tradeStatus: TradeStatus;
  myRole: ChatRole;
  partner: ChatRoomPartner;
  post: ChatRoomPost;
}

export type SystemMessageType = 'TRADE_ACCEPTED' | 'TRADE_COMPLETED' | 'SAFE_ZONE_RECORDED';

interface BaseMessage {
  id: string;
  createdAt: string;
}

export interface TextMessage extends BaseMessage {
  type: 'TEXT';
  senderId: string;
  content: string;
}

export interface ImageMessage extends BaseMessage {
  type: 'IMAGE';
  senderId: string;
  imageUrl: string;
}

export interface SystemMessage extends BaseMessage {
  type: 'SYSTEM';
  systemType: SystemMessageType;
  placeName: string | null;
}

export type UserMessage = TextMessage | ImageMessage;

export type ChatMessage = UserMessage | SystemMessage;
