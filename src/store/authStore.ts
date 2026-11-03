import { create } from 'zustand';

import { MY_USER_ID } from '@/mocks/user';

interface AuthState {
  userId: string;
}

export const useAuthStore = create<AuthState>(() => ({
  userId: MY_USER_ID,
}));
