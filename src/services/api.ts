import axios from 'axios';

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

export default api;