import { ApiError } from '@/api/client';
import { CHAT_MESSAGES_MOCK } from '@/mocks/chatMessages';
import { CHAT_ROOM_DETAILS_MOCK } from '@/mocks/chatRoomDetails';
import { CHAT_ROOMS_MOCK } from '@/mocks/chatRooms';
import { MY_USER_ID } from '@/mocks/user';
import type { ChatMessage, ChatRoom, ChatRoomDetail, UserMessage } from '@/types/chat';

const messageStore = new Map<string, ChatMessage[]>();

const getStoredMessages = (roomId: string): ChatMessage[] => {
  const stored = messageStore.get(roomId);
  if (stored) return stored;

  const room = CHAT_ROOMS_MOCK.find((item) => item.id === roomId);
  const initial: ChatMessage[] =
    CHAT_MESSAGES_MOCK[roomId] ??
    (room
      ? [
          {
            id: `${roomId}-1`,
            type: 'TEXT',
            senderId: room.partner.id,
            createdAt: room.lastMessageAt,
            content: room.lastMessage,
          },
        ]
      : []);
  messageStore.set(roomId, initial);
  return initial;
};

const updateRoomPreview = (roomId: string, message: UserMessage) => {
  const room = CHAT_ROOMS_MOCK.find((item) => item.id === roomId);
  if (!room) return;
  room.lastMessage = message.type === 'TEXT' ? message.content : '사진을 보냈어요';
  room.lastMessageAt = message.createdAt;
};

export function getChatRooms(): Promise<ChatRoom[]> {
  const sorted = [...CHAT_ROOMS_MOCK].sort(
    (a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime(),
  );
  return Promise.resolve(sorted.map((room) => ({ ...room })));
}

export function getChatRoom(roomId: string): Promise<ChatRoomDetail> {
  const room = CHAT_ROOM_DETAILS_MOCK.find((item) => item.id === roomId);
  if (!room) return Promise.reject(new ApiError(404, '채팅방을 찾을 수 없어요'));
  return Promise.resolve(room);
}

export function getChatMessages(roomId: string): Promise<ChatMessage[]> {
  return Promise.resolve([...getStoredMessages(roomId)]);
}

export function sendTextMessage(roomId: string, content: string): Promise<UserMessage> {
  const message: UserMessage = {
    id: crypto.randomUUID(),
    type: 'TEXT',
    senderId: MY_USER_ID,
    createdAt: new Date().toISOString(),
    content,
  };
  getStoredMessages(roomId).push(message);
  updateRoomPreview(roomId, message);
  return Promise.resolve(message);
}

export function sendImageMessage(roomId: string, file: File): Promise<UserMessage> {
  const message: UserMessage = {
    id: crypto.randomUUID(),
    type: 'IMAGE',
    senderId: MY_USER_ID,
    createdAt: new Date().toISOString(),
    imageUrl: URL.createObjectURL(file),
  };
  getStoredMessages(roomId).push(message);
  updateRoomPreview(roomId, message);
  return Promise.resolve(message);
}

export function readChatRoom(roomId: string): Promise<void> {
  const room = CHAT_ROOMS_MOCK.find((item) => item.id === roomId);
  if (room) room.unreadCount = 0;
  return Promise.resolve();
}
