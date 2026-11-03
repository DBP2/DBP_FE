import bookGreen from '@/mocks/images/book-green.svg';
import bookMustard from '@/mocks/images/book-mustard.svg';
import bookNavy from '@/mocks/images/book-navy.svg';
import bookPlum from '@/mocks/images/book-plum.svg';
import type { ChatRoomDetail } from '@/types/chat';

export const CHAT_ROOM_DETAILS_MOCK: ChatRoomDetail[] = [
  {
    id: '1',
    tradeId: 'trade-1',
    tradeStatus: 'accepted',
    myRole: 'buyer',
    partner: { id: 'user-2', name: '김지훈', isVerified: true, trustGrade: 'A' },
    post: { id: 'post-1', title: '경제학원론 7판 (맨큐)', price: 15000, thumbnailUrl: bookNavy },
  },
  {
    id: '2',
    tradeId: 'trade-2',
    tradeStatus: 'requested',
    myRole: 'buyer',
    partner: { id: 'user-3', name: '박서연', isVerified: false, trustGrade: 'B' },
    post: { id: 'post-2', title: '회계원리 교재 세트', price: 12000, thumbnailUrl: bookMustard },
  },
  {
    id: '3',
    tradeId: 'trade-3',
    tradeStatus: 'accepted',
    myRole: 'seller',
    partner: { id: 'user-4', name: '최하은', isVerified: false, trustGrade: null },
    post: { id: 'post-3', title: '데이터베이스 개론 3판', price: 9000, thumbnailUrl: bookGreen },
  },
  {
    id: '4',
    tradeId: 'trade-4',
    tradeStatus: 'done',
    myRole: 'seller',
    partner: { id: 'user-1', name: '이민서', isVerified: false, trustGrade: 'A' },
    post: { id: 'post-4', title: '미시경제학 2판', price: 8000, thumbnailUrl: bookPlum },
  },
];
