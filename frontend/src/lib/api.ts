import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import mockData from './mock-data.json';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

const createMockResponse = (config: any, data: any) => ({
  data,
  status: 200,
  statusText: 'OK',
  headers: {},
  config,
  request: {}
});

const resolveMockResponse = (config: any) => {
  const url = config.url || '';
  const method = config.method?.toLowerCase();

  if (url === '/auth/login' && method === 'post') {
    return createMockResponse(config, (mockData as any).auth.login);
  }

  if (url === '/auth/me' && method === 'get') {
    return createMockResponse(config, (mockData as any).auth.me);
  }

  if (url === '/dashboard/kpis' && method === 'get') {
    return createMockResponse(config, (mockData as any).dashboard.kpis);
  }

  if (url === '/dashboard/exceptions' && method === 'get') {
    return createMockResponse(config, (mockData as any).dashboard.exceptions);
  }

  if (url === '/inventory/' && method === 'get') {
    return createMockResponse(config, (mockData as any).inventory);
  }

  if (url === '/transfers/' && method === 'get') {
    return createMockResponse(config, (mockData as any).transfers);
  }

  if (url === '/transfers/' && method === 'post') {
    const newTransfer = {
      id: (mockData as any).transfers.length + 1,
      ...config.data,
      created_at: new Date().toISOString(),
      status: 'PENDING_APPROVAL'
    };
    return createMockResponse(config, newTransfer);
  }

  if (url === '/audit/' && method === 'get') {
    return createMockResponse(config, (mockData as any).audit);
  }

  if (url === '/users/' && method === 'get') {
    return createMockResponse(config, (mockData as any).users);
  }

  if (url === '/health/' && method === 'get') {
    return createMockResponse(config, (mockData as any).health);
  }

  const customerLookupMatch = url.match(/\/issuance\/customer-lookup\/(.+)/);
  if (customerLookupMatch && method === 'get') {
    const id = customerLookupMatch[1];
    const customer = (mockData as any).issuance.customers[id];
    if (customer) {
      return createMockResponse(config, customer);
    }
    throw new Error('Customer not found');
  }

  if (url === '/issuance/issue' && method === 'post') {
    return createMockResponse(config, {
      serial_number: config.data.serial_number,
      customer_name: config.data.customer_name,
      account_number: config.data.account_number,
      issued_at: new Date().toISOString()
    });
  }

  return null;
};

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
  async (error) => {
    const status = error.response?.status;
    const data = error.response?.data;
    const url = error.config?.url;
    const method = error.config?.method;
    console.error(
      `[API Error] ${method?.toUpperCase()} ${url} -> ${status ?? 'NETWORK'}`,
      { message: error.message, code: error.code, data, headers: error.response?.headers }
    );

    if (!error.response || error.response.status >= 500 || error.code === 'ERR_NETWORK') {
      console.warn(`[API Fallback] Using mock data for ${method?.toUpperCase()} ${url}`);
      try {
        const mockResponse = resolveMockResponse(error.config);
        if (mockResponse) {
          return Promise.resolve(mockResponse as any);
        }
      } catch (mockErr: any) {
        return Promise.reject({ response: { status: 404, data: { detail: mockErr.message } } });
      }
    }

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
