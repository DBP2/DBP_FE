export const ROUTES = {
  HOME: '/',
  TRADE: '/trade',
  TRADE_DETAIL: '/trade/:tradeId',
  SAFE_ZONE_SCAN: '/trade/:tradeId/scan',
  CHAT: '/chat',
  CHAT_ROOM: '/chat/:roomId',
  MY: '/my',
  REPORT: '/report/:userId',
  POST_SAFE_ZONE: '/posts/new/safe-zone',
} as const;

export const getChatRoomPath = (roomId: string) => `/chat/${roomId}`;

export const getTradeDetailPath = (tradeId: string) => `/trade/${tradeId}`;

export const getReportPath = (userId: string) => `/report/${userId}`;

export const getSafeZoneScanPath = (tradeId: string) => `/trade/${tradeId}/scan`;
