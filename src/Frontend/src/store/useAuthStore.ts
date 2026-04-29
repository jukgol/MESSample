import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserInfo } from '../api/generated-api';

interface AuthState {
  isAuthenticated: boolean;
  user: UserInfo | null;
  token: string | null;
  login: (token: string, user: UserInfo) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      token: null,
      login: (token, user) => set({ 
        isAuthenticated: true, 
        user,
        token
      }),
      logout: () => set({ 
        isAuthenticated: false, 
        user: null,
        token: null
      }),
    }),
    {
      name: 'mes-auth-storage', // 로컬 스토리지에 저장될 이름
    }
  )
);
