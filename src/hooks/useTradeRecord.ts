import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getTradeRecordInfo, saveTradeRecord } from '@/api/tradeRecord';
import { QUERY_KEYS } from '@/constants/queryKeys';
import type { SaveTradeRecordRequest } from '@/types/tradeRecord';

export function useTradeRecordInfo(tradeId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.tradeRecordInfo(tradeId),
    queryFn: () => getTradeRecordInfo(tradeId),
  });
}

export function useSaveTradeRecord(tradeId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: SaveTradeRecordRequest) => saveTradeRecord(tradeId, request),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['chatMessages'] });
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.chatRooms });
    },
  });
}
