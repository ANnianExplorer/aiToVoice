import client from './client';
import type { ApiResponse, User } from '../types';

interface AuthResponse {
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
  client.post<ApiResponse<AuthResponse>>('/auth/login', data).then(r => r.data);

export const register = (data: RegisterRequest) =>
  client.post<ApiResponse<AuthResponse>>('/auth/register', data).then(r => r.data);

export const getMe = () =>
  client.get<ApiResponse<User>>('/auth/me').then(r => r.data);
