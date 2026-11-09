import { create } from 'zustand';

import type { SignupRequest, VerificationMail } from '@/types/auth';

interface SignupState {
  request: SignupRequest | null;
  verification: VerificationMail | null;
  startVerification: (request: SignupRequest, verification: VerificationMail) => void;
  updateVerification: (verification: VerificationMail) => void;
  reset: () => void;
}

export const useSignupStore = create<SignupState>((set) => ({
  request: null,
  verification: null,
  startVerification: (request, verification) => set({ request, verification }),
  updateVerification: (verification) => set({ verification }),
  reset: () => set({ request: null, verification: null }),
}));
