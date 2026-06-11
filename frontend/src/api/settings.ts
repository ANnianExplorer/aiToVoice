import client from './client';
import type { ApiResponse } from '../types';

interface UserSettings {
  theme: string;
  language: string;
  audioOutputDevice: string;
  audioQuality: string;
  crossfadeEnabled: boolean;
  crossfadeDuration: number;
  hotkeyConfig: string;
  lyricFontSize: number;
  lyricDesktopEnabled: boolean;
  notificationEnabled: boolean;
  cacheMaxMb: number;
  autoPlayOnLaunch: boolean;
}

export const getSettings = () =>
  client.get<ApiResponse<UserSettings>>('/settings');

export const updateSettings = (data: Partial<UserSettings>) =>
  client.put<ApiResponse<UserSettings>>('/settings', data);
