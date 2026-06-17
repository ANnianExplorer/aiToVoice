import client from './client';
import type { User } from '../types';

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: User;
}

interface LoginRequest {
  username: string;
  password: string;
}

interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export const login = (data: LoginRequest) =>
  client.post<AuthResponse>('/auth/login', data).then(r => r.data);

export const register = (data: RegisterRequest) =>
  client.post<AuthResponse>('/auth/register', data).then(r => r.data);

export const getMe = () =>
  client.get<User>('/auth/me').then(r => r.data);
