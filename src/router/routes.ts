export const ROUTES = {
  HOME: '/',
  TRADE: '/trade',
  TRADE_DETAIL: '/trade/:tradeId',
  TRADE_REVIEW: '/trade/:tradeId/review',
  SAFE_ZONE_SCAN: '/trade/:tradeId/scan',
  SAFE_ZONE_CODE: '/trade/:tradeId/scan/code',
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

export const getSafeZoneCodePath = (tradeId: string) => `/trade/${tradeId}/scan/code`;

export const getTradeReviewPath = (tradeId: string) => `/trade/${tradeId}/review`;
