import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: number;
  username: string;
  email: string;
  avatarUrl: string;
  nickname: string;
  bio: string;
  role: string;
  createdAt: string;
}

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
        // TODO: API call - will be implemented in Task 2.4
        const mockUser = { id: 1, username, email: username + '@test.com', avatarUrl: '', nickname: username, bio: '', role: 'USER', createdAt: new Date().toISOString() };
        set({ user: mockUser, token: 'mock-token', isAuthenticated: true });
        localStorage.setItem('token', 'mock-token');
      },

      register: async (username, email, password) => {
        // TODO: API call - will be implemented in Task 2.4
        const mockUser = { id: 1, username, email, avatarUrl: '', nickname: username, bio: '', role: 'USER', createdAt: new Date().toISOString() };
        set({ user: mockUser, token: 'mock-token', isAuthenticated: true });
        localStorage.setItem('token', 'mock-token');
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
        localStorage.removeItem('token');
      },
    }),
    { name: 'auth-storage' }
  )
);
