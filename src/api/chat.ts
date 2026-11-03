import { CHAT_ROOMS_MOCK } from '@/mocks/chatRooms';
import type { ChatRoom } from '@/types/chat';

export function getChatRooms(): Promise<ChatRoom[]> {
  const sorted = [...CHAT_ROOMS_MOCK].sort(
    (a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime(),
  );
  return Promise.resolve(sorted);
}
