import client from './client';

export interface VoiceExercise {
  id: number;
  title: string;
  description: string;
  type: string;
  difficulty: number;
  audioExamplePath: string | null;
  instructions: string | null;
  durationSec: number | null;
  sortOrder: number;
  createdAt: string;
}

export interface VoiceRecord {
  id: number;
  userId: number;
  songId: number | null;
  audioUrl: string;
  durationSec: number;
  pitchData: string;
  score: number;
  feedbackText: string;
  createdAt: string;
}

export interface AnalysisResult {
  averagePitch: number;
  maxPitch: number;
  minPitch: number;
  stabilityScore: number;
  rhythmScore: number;
  overallScore: number;
  feedback: string;
}

export interface PracticeProgress {
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

export const getExercises = () =>
  client.get<VoiceExercise[]>('/voice/exercises').then(r => r.data);

export const uploadRecord = (file: File, songId?: number) => {
  const formData = new FormData();
  formData.append('file', file);
  if (songId !== undefined) formData.append('songId', songId.toString());
  return client.post<VoiceRecord>('/voice/record', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then(r => r.data);
};

export const getMyRecords = () =>
  client.get<VoiceRecord[]>('/voice/records').then(r => r.data);

export const analyzeRecord = (id: number) =>
  client.post<AnalysisResult>(`/voice/records/${id}/analyze`).then(r => r.data);

export const getMyProgress = () =>
  client.get<PracticeProgress[]>('/voice/progress').then(r => r.data);

export const submitPractice = (exerciseId: number, recordId: number) =>
  client.post<PracticeProgress>(`/voice/progress/${exerciseId}/submit`, null, {
    params: { recordId },
  }).then(r => r.data);
