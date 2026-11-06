export const QUERY_KEYS = {
  chatRooms: ['chatRooms'] as const,
  chatRoom: (roomId: string) => ['chatRooms', roomId] as const,
  chatMessages: (roomId: string) => ['chatMessages', roomId] as const,
  reportTarget: (userId: string, tradeId: string | null) =>
    ['reportTarget', userId, tradeId] as const,
};
