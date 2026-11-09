export const ROUTES = {
  HOME: '/',
  SEARCH: '/search',
  POST_DETAIL: '/posts/:postId',
  POST_CREATE: '/posts/new',
  POST_EDIT: '/posts/:postId/edit',
  TRADE: '/trade',
  TRADE_DETAIL: '/trade/:tradeId',
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

export const getPostDetailPath = (postId: string) => `/posts/${postId}`;

export const getPostEditPath = (postId: string) => `/posts/${postId}/edit`;
