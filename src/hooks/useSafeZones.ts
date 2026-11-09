import { useQuery } from '@tanstack/react-query';

import { getSafeZones } from '@/api/safeZone';
import { QUERY_KEYS } from '@/constants/queryKeys';

export function useSafeZones() {
  return useQuery({
    queryKey: QUERY_KEYS.safeZones,
    queryFn: getSafeZones,
    staleTime: Infinity,
  });
}
