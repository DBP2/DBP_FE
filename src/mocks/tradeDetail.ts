import type { TradeDetail } from '@/types/trade';

export const TRADES_DETAIL_MOCK: Record<string, TradeDetail> = {
  '1': {
    id: '1',
    type: 'BUY',
    status: 'ACCEPTED',
    title: '경제학원론 7판 (맨큐)',
    traderName: '김지훈',
    price: 15000,
    imageUrl: 'https://via.placeholder.com/100?text=Economics',
    requestedAt: '2026.09.26',

    conditionSummary: '상태 양호 · 밑줄 없음',
    location: '중앙도서관 앞 Safe Zone',
    createdAt: '2026.09.26',

    myRole: 'BUYER',

    seller: {
      id: 'user_seller_1',
      nickname: '김지훈',
      department: '경영학과',
      trustScore: 4.8,
      isSchoolVerified: true,
    },
    buyer: {
      id: 'user_me',
      nickname: '연우',
      department: '경영학과',
      trustScore: 4.5,
      isSchoolVerified: true,
    },

    proofRecords: [
      {
        id: 'p1',
        title: '상품 등록 사진',
        uploaderRole: 'SELLER',
        timestamp: '09.20 14:02',
      },
      {
        id: 'p2',
        title: '두고가기 사진 (판매자)',
        uploaderRole: 'SELLER',
        timestamp: undefined,
      },
      {
        id: 'p3',
        title: '두고가기 사진 (구매자)',
        uploaderRole: 'BUYER',
        timestamp: undefined,
      },
    ],
  },
  '3': {
    id: '3',
    type: 'BUY',
    status: 'COMPLETED',
    title: '스탠드 조명',
    traderName: '이민준',
    price: 12000,
    imageUrl: 'https://via.placeholder.com/100?text=DeskLamp',
    requestedAt: '2026.09.20',
    hasReviewed: false,

    conditionSummary: 'LED 정상 작동 · 미세 생활기스',
    location: '공학관 1층 Safe Zone · 3번 칸',
    createdAt: '2026.09.20',

    myRole: 'BUYER',

    seller: {
      id: 'user_seller_3',
      nickname: '이민준',
      department: '전자공학과',
      trustScore: 4.9,
      isSchoolVerified: true,
    },
    buyer: {
      id: 'user_me',
      nickname: '연우',
      department: '컴퓨터공학과',
      trustScore: 4.5,
      isSchoolVerified: true,
    },

    proofRecords: [
      {
        id: 'p3_1',
        title: '상품 등록 사진',
        uploaderRole: 'SELLER',
        timestamp: '09.20 10:00',
      },
      {
        id: 'p3_2',
        title: '두고가기 사진 (판매자)',
        uploaderRole: 'SELLER',
        timestamp: '09.20 14:15',
      },
      {
        id: 'p3_3',
        title: '두고가기 사진 (구매자)',
        uploaderRole: 'BUYER',
        timestamp: '09.20 15:42',
      },
    ],
  },
};
