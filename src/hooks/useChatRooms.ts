import { useQuery } from '@tanstack/react-query';

import { getChatRooms } from '@/api/chat';

export function useChatRooms() {
  return useQuery({
    queryKey: ['chatRooms'],
    queryFn: getChatRooms,
  });
}
