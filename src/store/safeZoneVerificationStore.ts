import { create } from 'zustand';

import type { SafeZoneVerification } from '@/types/safeZone';

interface SafeZoneVerificationState {
  tradeId: string | null;
  verification: SafeZoneVerification | null;
  setVerification: (tradeId: string, verification: SafeZoneVerification) => void;
  clearVerification: () => void;
}

export const useSafeZoneVerificationStore = create<SafeZoneVerificationState>((set) => ({
  tradeId: null,
  verification: null,
  setVerification: (tradeId, verification) => set({ tradeId, verification }),
  clearVerification: () => set({ tradeId: null, verification: null }),
}));
