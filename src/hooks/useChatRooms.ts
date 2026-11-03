import { useQuery } from '@tanstack/react-query';

import { getChatRooms } from '@/api/chat';
import { QUERY_KEYS } from '@/constants/queryKeys';

export function useChatRooms() {
  return useQuery({
    queryKey: QUERY_KEYS.chatRooms,
    queryFn: getChatRooms,
  });
}
