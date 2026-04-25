import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers['X-Request-ID'] = Math.random().toString(36).substring(7);
  console.log(
    `[API Request] ${config.method?.toUpperCase()} ${config.url}`,
    { baseURL: config.baseURL, headers: config.headers, data: config.data }
  );
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log(
      `[API Response] ${response.config.method?.toUpperCase()} ${response.config.url} -> ${response.status}`,
      { data: response.data }
    );
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const data = error.response?.data;
    const url = error.config?.url;
    const method = error.config?.method;
    console.error(
      `[API Error] ${method?.toUpperCase()} ${url} -> ${status ?? 'NETWORK'}`,
      { message: error.message, code: error.code, data, headers: error.response?.headers }
    );
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      if (window.location.pathname !== '/login') {
        window.location.href = '/login?reason=session_expired';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
