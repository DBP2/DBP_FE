import { ApiError } from '@/api/client';
import { SAFE_ZONES_MOCK } from '@/mocks/safeZones';
import type { SafeZone, SafeZoneVerification, VerifySafeZoneRequest } from '@/types/safeZone';

const SCANNED_SAFE_ZONE_MOCK = SAFE_ZONES_MOCK[1];
const INVALID_CODE_MOCK = '000000';

export function getSafeZones(): Promise<SafeZone[]> {
  return Promise.resolve(SAFE_ZONES_MOCK);
}

export function verifySafeZone(
  tradeId: string,
  request: VerifySafeZoneRequest,
): Promise<SafeZoneVerification> {
  void tradeId;
  if (request.type === 'CODE' && request.value === INVALID_CODE_MOCK) {
    return Promise.reject(new ApiError(400, '코드가 맞지 않아요'));
  }
  return Promise.resolve({
    safeZone: SCANNED_SAFE_ZONE_MOCK,
    verifiedAt: new Date().toISOString(),
  });
}
