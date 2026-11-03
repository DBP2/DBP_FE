import { MINUTE, ago } from '@/mocks/chatRooms';
import bookNavy from '@/mocks/images/book-navy.svg';
import { MY_USER_ID } from '@/mocks/user';
import type { ChatMessage } from '@/types/chat';

const at = (daysAgo: number, hour: number, minute: number) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
};

export const CHAT_MESSAGES_MOCK: Record<string, ChatMessage[]> = {
  '1': [
    {
      id: '1-1',
      type: 'TEXT',
      senderId: MY_USER_ID,
      createdAt: at(1, 14, 10),
      content: '안녕하세요! 경제학원론 구매 신청했어요. 필기 있는 부분 사진 볼 수 있을까요?',
    },
    { id: '1-2', type: 'IMAGE', senderId: 'user-2', createdAt: at(1, 14, 13), imageUrl: bookNavy },
    {
      id: '1-3',
      type: 'SYSTEM',
      createdAt: at(1, 14, 14),
      systemType: 'TRADE_ACCEPTED',
      placeName: '중앙도서관 앞 Safe Zone',
    },
    {
      id: '1-4',
      type: 'TEXT',
      senderId: 'user-2',
      createdAt: at(1, 14, 15),
      content: '내일 오후 3시쯤 Safe Zone 3번 칸에 두고 갈게요! 두고가기 사진도 올려둘게요.',
    },
    {
      id: '1-5',
      type: 'TEXT',
      senderId: MY_USER_ID,
      createdAt: at(1, 14, 16),
      content: '좋아요, 수업 끝나고 가져갈게요!',
    },
    {
      id: '1-6',
      type: 'TEXT',
      senderId: 'user-2',
      createdAt: ago(3 * MINUTE),
      content: '지금 도착했어요',
    },
    {
      id: '1-7',
      type: 'TEXT',
      senderId: 'user-2',
      createdAt: ago(3 * MINUTE),
      content: '3번 칸에 두고 갈게요! 사진도 올려둘게요',
    },
  ],
};
