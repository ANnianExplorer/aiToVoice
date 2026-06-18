import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

client.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const stored = localStorage.getItem('auth-storage');
    if (stored) {
      try {
        const { state } = JSON.parse(stored);
        if (state?.token) {
          config.headers.Authorization = `Bearer ${state.token}`;
        }
      } catch { /* ignore parse errors */ }
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

client.interceptors.response.use(
  (response) => response.data,
  (error: AxiosError<{ message?: string }>) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth-storage');
      window.location.href = '/login';
    }
    const message = error.response?.data?.message || '网络错误';
    return Promise.reject(new Error(message));
  }
);

export default client;
