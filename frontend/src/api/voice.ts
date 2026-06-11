import client from './client';
import type { ApiResponse } from '../types';

interface VoiceRecord {
  id: number;
  userId: number;
  songId: number | null;
  filePath: string;
  durationSec: number;
  pitchData: string;
  score: number;
  feedbackText: string;
  createdAt: string;
}

interface AnalysisResult {
  averagePitch: number;
  maxPitch: number;
  minPitch: number;
  stabilityScore: number;
  rhythmScore: number;
  overallScore: number;
  feedback: string;
}

interface PracticeProgress {
  id: number;
  exerciseId: number;
  exerciseTitle: string;
  status: string;
  attemptsCount: number;
  bestScore: number;
  latestScore: number;
  practiceMinutes: number;
  startedAt: string;
  completedAt: string;
}

export const uploadRecord = (file: File, songId?: number) => {
  const formData = new FormData();
  formData.append('file', file);
  if (songId) formData.append('songId', songId.toString());
  return client.post<ApiResponse<VoiceRecord>>('/voice/record', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const getMyRecords = () =>
  client.get<ApiResponse<VoiceRecord[]>>('/voice/records');

export const analyzeRecord = (id: number) =>
  client.post<ApiResponse<AnalysisResult>>(`/voice/records/${id}/analyze`);

export const getMyProgress = () =>
  client.get<ApiResponse<PracticeProgress[]>>('/voice/progress');

export const submitPractice = (exerciseId: number, recordId: number) =>
  client.post<ApiResponse<PracticeProgress>>(`/voice/progress/${exerciseId}/submit`, null, {
    params: { recordId },
  });
