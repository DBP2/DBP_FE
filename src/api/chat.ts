import { request } from '@/api/client';
import type { ChatMessage, ChatRoom, ChatRoomDetail, UserMessage } from '@/types/chat';

export function openChatRoom(postId: string): Promise<{ id: string }> {
  return request<{ id: string }>('/chats', {
    method: 'POST',
    body: JSON.stringify({ postId }),
  });
}

export function getChatRooms(): Promise<ChatRoom[]> {
  return request<ChatRoom[]>('/chats');
}

export function getChatRoom(roomId: string): Promise<ChatRoomDetail> {
  return request<ChatRoomDetail>(`/chats/${roomId}`);
}

export function getChatMessages(roomId: string): Promise<ChatMessage[]> {
  return request<ChatMessage[]>(`/chats/${roomId}/messages`);
}

export function sendTextMessage(roomId: string, content: string): Promise<UserMessage> {
  return request<UserMessage>(`/chats/${roomId}/messages`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  });
}

export function sendImageMessage(roomId: string, file: File): Promise<UserMessage> {
  const formData = new FormData();
  formData.append('image', file);
  return request<UserMessage>(`/chats/${roomId}/images`, {
    method: 'POST',
    body: formData,
  });
}

export function readChatRoom(roomId: string): Promise<void> {
  return request<void>(`/chats/${roomId}/read`, { method: 'POST' });
}
