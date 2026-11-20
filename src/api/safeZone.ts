import { request } from '@/api/client';
import type { SafeZone, SafeZoneVerification, VerifySafeZoneRequest } from '@/types/safeZone';

export function getSafeZones(): Promise<SafeZone[]> {
  return request<SafeZone[]>('/safe-zones');
}

export function verifySafeZone(
  tradeId: string,
  verifyRequest: VerifySafeZoneRequest,
): Promise<SafeZoneVerification> {
  return request<SafeZoneVerification>(`/trades/${tradeId}/safe-zone/verify`, {
    method: 'POST',
    body: JSON.stringify(verifyRequest),
  });
}
