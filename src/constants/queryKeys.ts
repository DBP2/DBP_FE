export const QUERY_KEYS = {
  chatRooms: ['chatRooms'] as const,
  chatRoom: (roomId: string) => ['chatRooms', roomId] as const,
  chatMessages: (roomId: string) => ['chatMessages', roomId] as const,
  safeZones: ['safeZones'] as const,
  posts: ['posts'] as const,
  tradeRecordInfo: (tradeId: string) => ['tradeRecordInfo', tradeId] as const,
};
