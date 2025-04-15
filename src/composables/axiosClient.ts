import axios from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_ENDPOINT,
  headers: {
    'Content-Type': 'application/json',
  },
});

interface CustomAxiosConfig extends InternalAxiosRequestConfig {
  skipAuth?: boolean;
}

apiClient.interceptors.request.use((config) => {
  // Custom flag you pass in any request
  const customConfig = config as CustomAxiosConfig;

  if (!customConfig.skipAuth) {
    try {
      const token = JSON.parse(localStorage.getItem('auth/token') || '');
      if (token) {
        customConfig.headers = customConfig.headers || {};
        customConfig.headers['Authorization'] = `Bearer ${token}`;
      }
    } catch {
      return customConfig;
    }
  }

  return customConfig;
});

export { apiClient };
