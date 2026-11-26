import { MY_PROFILE_MOCK } from '@/mocks/profile';
import type { MyProfile } from '@/types/profile';

export function getMyProfile(): Promise<MyProfile> {
  return Promise.resolve(MY_PROFILE_MOCK);
}
