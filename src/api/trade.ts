import { TRADES_MOCK } from '@/mocks/trades';
import { TRADES_DETAIL_MOCK } from '@/mocks/tradeDetail';
import type { TradeItem, TradeDetail, TradeReviewRequest } from '@/types/trade';

export function getTrades(): Promise<TradeItem[]> {
  return Promise.resolve(TRADES_MOCK.map((item) => ({ ...item })));
}

export const fetchTradeDetail = async (id: string): Promise<TradeDetail> => {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const detailData = TRADES_DETAIL_MOCK[id];

  if (!detailData) {
    throw new Error('해당 거래 상세 정보를 찾을 수 없습니다.');
  }

  return detailData;
};

export const submitTradeReview = async (reviewData: TradeReviewRequest): Promise<boolean> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const tradeItem = TRADES_MOCK.find((t) => t.id === reviewData.tradeId);
  if (tradeItem) {
    tradeItem.hasReviewed = true;
  }
  const detailItem = TRADES_DETAIL_MOCK[reviewData.tradeId];
  if (detailItem) {
    detailItem.hasReviewed = true;
  }

  return true;
};
