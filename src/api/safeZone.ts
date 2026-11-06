import { SAFE_ZONES_MOCK } from '@/mocks/safeZones';
import type { SafeZone } from '@/types/safeZone';

export function getSafeZones(): Promise<SafeZone[]> {
  return Promise.resolve(SAFE_ZONES_MOCK);
}
