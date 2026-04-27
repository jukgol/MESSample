import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  userId: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  login: (userId: string, password?: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      login: (userId) => set({ 
        isAuthenticated: true, 
        user: { userId } 
      }),
      logout: () => set({ 
        isAuthenticated: false, 
        user: null 
      }),
    }),
    {
      name: 'mes-auth-storage', // 로컬 스토리지에 저장될 이름
    }
  )
);
