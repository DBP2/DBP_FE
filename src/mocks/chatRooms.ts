import bookGreen from '@/mocks/images/book-green.svg';
import bookMustard from '@/mocks/images/book-mustard.svg';
import bookNavy from '@/mocks/images/book-navy.svg';
import bookPlum from '@/mocks/images/book-plum.svg';
import type { ChatRoom } from '@/types/chat';

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

const ago = (ms: number) => new Date(Date.now() - ms).toISOString();

export const CHAT_ROOMS_MOCK: ChatRoom[] = [
  {
    id: '1',
    partner: { id: 'user-2', name: '김지훈', isVerified: true },
    myRole: 'buyer',
    tradeStatus: 'ongoing',
    postTitle: '경제학원론 7판 (맨큐)',
    thumbnailUrl: bookNavy,
    lastMessage: '3번 칸에 두고 갈게요! 사진도 올려둘게요',
    lastMessageAt: ago(3 * MINUTE),
    unreadCount: 2,
  },
  {
    id: '2',
    partner: { id: 'user-3', name: '박서연', isVerified: false },
    myRole: 'buyer',
    tradeStatus: 'ongoing',
    postTitle: '회계원리 교재 세트',
    thumbnailUrl: bookMustard,
    lastMessage: '내일 오후 3시에 중앙도서관 Safe Zone 괜찮으세요?',
    lastMessageAt: ago(DAY),
    unreadCount: 0,
  },
  {
    id: '3',
    partner: { id: 'user-4', name: '최하은', isVerified: false },
    myRole: 'seller',
    tradeStatus: 'ongoing',
    postTitle: '데이터베이스 개론 3판',
    thumbnailUrl: bookGreen,
    lastMessage: '필기 노트도 같이 드려요 :)',
    lastMessageAt: ago(2 * HOUR),
    unreadCount: 0,
  },
  {
    id: '4',
    partner: { id: 'user-1', name: '이민서', isVerified: false },
    myRole: 'seller',
    tradeStatus: 'done',
    postTitle: '미시경제학 2판',
    thumbnailUrl: bookPlum,
    lastMessage: '잘 받았어요! 리뷰 남길게요',
    lastMessageAt: new Date(new Date().getFullYear(), 8, 20, 14, 0).toISOString(),
    unreadCount: 0,
  },
];
