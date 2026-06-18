import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';
import * as authApi from '../api/auth';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (username, password) => {
        const res = await authApi.login({ username, password });
        const role = (['USER', 'ADMIN'].includes(res.user.role) ? res.user.role : 'USER') as 'USER' | 'ADMIN';
        set({
          user: { ...res.user, role },
          token: res.token,
          isAuthenticated: true,
        });
      },

      register: async (username, email, password) => {
        const res = await authApi.register({ username, email, password });
        const role = (['USER', 'ADMIN'].includes(res.user.role) ? res.user.role : 'USER') as 'USER' | 'ADMIN';
        set({
          user: { ...res.user, role },
          token: res.token,
          isAuthenticated: true,
        });
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    { name: 'auth-storage' }
  )
);
