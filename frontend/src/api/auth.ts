import client from './client';
import type { ApiResponse } from '../types';

interface AuthResponse {
  token: string;
  refreshToken: string;
  user: {
    id: number;
    username: string;
    email: string;
    avatarUrl: string;
    nickname: string;
    bio: string;
    role: string;
    createdAt: string;
  };
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
  client.post<ApiResponse<AuthResponse>>('/auth/login', data);

export const register = (data: RegisterRequest) =>
  client.post<ApiResponse<AuthResponse>>('/auth/register', data);

export const getMe = () =>
  client.get<ApiResponse<AuthResponse['user']>>('/auth/me');
