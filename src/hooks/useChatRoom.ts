import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  getChatMessages,
  getChatRoom,
  readChatRoom,
  sendImageMessage,
  sendTextMessage,
} from '@/api/chat';
import { QUERY_KEYS } from '@/constants/queryKeys';
import type { ChatMessage, UserMessage } from '@/types/chat';

export function useChatRoom(roomId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.chatRoom(roomId),
    queryFn: () => getChatRoom(roomId),
  });
}

export function useChatMessages(roomId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.chatMessages(roomId),
    queryFn: () => getChatMessages(roomId),
  });
}

const useAppendMessage = (roomId: string) => {
  const queryClient = useQueryClient();
  return (message: UserMessage) => {
    queryClient.setQueryData<ChatMessage[]>(QUERY_KEYS.chatMessages(roomId), (prev = []) => [
      ...prev,
      message,
    ]);
    void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.chatRooms, exact: true });
  };
};

export function useSendTextMessage(roomId: string) {
  const appendMessage = useAppendMessage(roomId);
  return useMutation({
    mutationFn: (content: string) => sendTextMessage(roomId, content),
    onSuccess: appendMessage,
  });
}

export function useSendImageMessage(roomId: string) {
  const appendMessage = useAppendMessage(roomId);
  return useMutation({
    mutationFn: (file: File) => sendImageMessage(roomId, file),
    onSuccess: appendMessage,
  });
}

export function useReadChatRoom(roomId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => readChatRoom(roomId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.chatRooms, exact: true });
    },
  });
}
