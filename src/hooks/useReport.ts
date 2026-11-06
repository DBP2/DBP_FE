import { useMutation, useQuery } from '@tanstack/react-query';

import { getReportTarget, submitReport } from '@/api/report';
import { QUERY_KEYS } from '@/constants/queryKeys';
import type { ReportRequest } from '@/types/report';

export function useReportTarget(userId: string, tradeId: string | null) {
  return useQuery({
    queryKey: QUERY_KEYS.reportTarget(userId, tradeId),
    queryFn: () => getReportTarget(userId, tradeId),
  });
}

export function useSubmitReport() {
  return useMutation({
    mutationFn: (request: ReportRequest) => submitReport(request),
  });
}
