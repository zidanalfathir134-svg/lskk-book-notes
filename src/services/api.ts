import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const authStorage = localStorage.getItem('lskk-auth');

  if (!authStorage) {
    return config;
  }

  try {
    const parsedAuth = JSON.parse(authStorage) as {
      state?: {
        token?: string | null;
      };
    };

    const token = parsedAuth.state?.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {
    localStorage.removeItem('lskk-auth');
  }

  return config;
});


api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401
    ) {
      const requestUrl = error.config?.url ?? '';
      const isLoginRequest = requestUrl.includes('/auth/login');

      if (!isLoginRequest) {
        useAuthStore.getState().logout();
      }
    }

    return Promise.reject(error);
  },
);

export default api;