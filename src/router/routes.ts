export const ROUTES = {
  HOME: '/',
  TRADE: '/trade',
  CHAT: '/chat',
  CHAT_ROOM: '/chat/:roomId',
  MY: '/my',
} as const;

export const getChatRoomPath = (roomId: string) => `/chat/${roomId}`;
