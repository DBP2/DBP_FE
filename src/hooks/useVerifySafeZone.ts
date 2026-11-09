import { useMutation } from '@tanstack/react-query';

import { verifySafeZone } from '@/api/safeZone';
import type { VerifySafeZoneRequest } from '@/types/safeZone';

export function useVerifySafeZone(tradeId: string) {
  return useMutation({
    mutationFn: (request: VerifySafeZoneRequest) => verifySafeZone(tradeId, request),
  });
}
