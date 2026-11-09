import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTrades, fetchTradeDetail, submitTradeReview } from '@/api/trade';
import type { TradeReviewRequest } from '@/types/trade';

export function useTrades() {
  return useQuery({
    queryKey: ['trades'],
    queryFn: () => getTrades(),
  });
}

export const useTradeDetail = (id: string) => {
  return useQuery({
    queryKey: ['trade', id],
    queryFn: () => fetchTradeDetail(id),
    enabled: !!id,
  });
};

export const useSubmitReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TradeReviewRequest) => submitTradeReview(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['trade', variables.tradeId] });
      queryClient.invalidateQueries({ queryKey: ['trades'] });
    },
  });
};
