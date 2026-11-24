import { create } from 'zustand';
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware';

import type { AuthUser } from '@/types/auth';

interface AuthState {
  user: AuthUser | null;
  keepLogin: boolean;
  login: (user: AuthUser, keepLogin: boolean) => void;
  logout: () => void;
}

// '로그인 상태 유지'를 선택하면 localStorage, 아니면 브라우저를 닫을 때 지워지는 sessionStorage에 저장
const authStorage: StateStorage = {
  getItem: (name) => localStorage.getItem(name) ?? sessionStorage.getItem(name),
  setItem: (name, value) => {
    const { state } = JSON.parse(value) as { state: Pick<AuthState, 'keepLogin'> };
    const [target, other] = state.keepLogin
      ? [localStorage, sessionStorage]
      : [sessionStorage, localStorage];
    target.setItem(name, value);
    other.removeItem(name);
  },
  removeItem: (name) => {
    localStorage.removeItem(name);
    sessionStorage.removeItem(name);
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      keepLogin: false,
      login: (user, keepLogin) => set({ user, keepLogin }),
      logout: () => set({ user: null, keepLogin: false }),
    }),
    {
      name: 'campusmarket-auth',
      storage: createJSONStorage(() => authStorage),
      partialize: ({ user, keepLogin }) => ({ user, keepLogin }),
    },
  ),
);
