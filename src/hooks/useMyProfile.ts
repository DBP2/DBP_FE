import { useQuery } from '@tanstack/react-query';

import { getMyProfile } from '@/api/profile';
import { QUERY_KEYS } from '@/constants/queryKeys';

export function useMyProfile() {
  return useQuery({
    queryKey: QUERY_KEYS.myProfile,
    queryFn: getMyProfile,
  });
}
