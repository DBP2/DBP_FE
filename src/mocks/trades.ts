import type { TradeItem } from '@/types/trade';

export const TRADES_MOCK: TradeItem[] = [
  {
    id: '1',
    type: 'BUY',
    status: 'ACCEPTED',
    title: '경제학원론 7판 (맨큐)',
    traderName: '김지훈',
    price: 15000,
    requestedAt: '2026-09-26T14:00:00',
    hasReviewed: false,
  },
  {
    id: '2',
    type: 'BUY',
    status: 'REQUESTED',
    title: '무선 이어폰 — 박스 포함',
    traderName: '최하은',
    price: 35000,
    requestedAt: '신청 2시간 전',
    hasReviewed: false,
  },
  {
    id: '3',
    type: 'BUY',
    status: 'COMPLETED',
    title: '스탠드 조명',
    traderName: '이민준',
    price: 12000,
    requestedAt: '2026-09-20T10:00:00',
    hasReviewed: false,
  },
];
