import { create } from 'zustand';

interface User {
  name: string;
  id: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  login: (name: string, id: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  login: (name, id) => set({ 
    isAuthenticated: true, 
    user: { name, id } 
  }),
  logout: () => set({ 
    isAuthenticated: false, 
    user: null 
  }),
}));
