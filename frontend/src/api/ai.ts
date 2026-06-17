import client from './client';
import type { ApiResponse, AiSession, AiMessage } from '../types';

export const createSession = (data: { title?: string; sessionType?: string }) =>
  client.post<ApiResponse<AiSession>>('/ai/sessions', data).then(r => r.data);

export const getMySessions = () =>
  client.get<ApiResponse<AiSession[]>>('/ai/sessions').then(r => r.data);

export const getSessionMessages = (sessionId: number) =>
  client.get<ApiResponse<AiMessage[]>>(`/ai/sessions/${sessionId}/messages`).then(r => r.data);

export const sendMessage = (sessionId: number, content: string) =>
  client.post<ApiResponse<AiMessage>>(`/ai/sessions/${sessionId}/messages`, { content }).then(r => r.data);
