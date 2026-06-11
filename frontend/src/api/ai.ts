import client from './client';
import type { ApiResponse } from '../types';

interface AiSession {
  id: number;
  title: string;
  sessionType: string;
  summary: string;
  createdAt: string;
}

interface AiMessage {
  id: number;
  role: string;
  content: string;
  msgType: string;
  metadata: string;
  createdAt: string;
}

export const createSession = (data: { title?: string; sessionType?: string }) =>
  client.post<ApiResponse<AiSession>>('/ai/sessions', data);

export const getMySessions = () =>
  client.get<ApiResponse<AiSession[]>>('/ai/sessions');

export const getSessionMessages = (sessionId: number) =>
  client.get<ApiResponse<AiMessage[]>>(`/ai/sessions/${sessionId}/messages`);

export const sendMessage = (sessionId: number, content: string) =>
  client.post<ApiResponse<AiMessage>>(`/ai/sessions/${sessionId}/messages`, { content });
