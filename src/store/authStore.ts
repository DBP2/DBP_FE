import { create } from 'zustand';

import { MY_USER_ID } from '@/mocks/user';

interface AuthState {
  userId: string;
}

export const useAuthStore = create<AuthState>(() => ({
  userId: import.meta.env.VITE_TEMP_USER_ID ?? MY_USER_ID,
}));
