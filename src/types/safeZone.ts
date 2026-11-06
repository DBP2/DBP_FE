export interface SafeZone {
  id: string;
  name: string;
  location: string;
  operatingHours: string;
}

export interface VerifySafeZoneRequest {
  type: 'QR' | 'CODE';
  value: string;
}

export interface SafeZoneVerification {
  safeZone: SafeZone;
  verifiedAt: string;
}
