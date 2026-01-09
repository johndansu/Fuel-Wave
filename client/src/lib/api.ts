import axios from 'axios';
import type { 
  AuthResponse, 
  EntriesResponse, 
  WorkEntry, 
  WorkEntryInput, 
  SearchResponse, 
  Insights,
  WorkMoment,
  WorkMomentInput,
  MomentsResponse,
  TimelineResponse,
  Thread,
  ThreadsResponse
} from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  register: async (email: string, password: string): Promise<AuthResponse> => {
    const { data } = await api.post('/auth/register', { email, password });
    return data;
  },
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const { data } = await api.post('/auth/login', { email, password });
    return data;
  },
  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },
};

export const entriesApi = {
  create: async (entry: WorkEntryInput): Promise<WorkEntry> => {
    const { data } = await api.post('/entries', entry);
    return data;
  },
  getAll: async (params?: {
    date?: string;
    startDate?: string;
    endDate?: string;
    category?: string;
    limit?: number;
    offset?: number;
  }): Promise<EntriesResponse> => {
    const { data } = await api.get('/entries', { params });
    return data;
  },
  getById: async (id: string): Promise<WorkEntry> => {
    const { data } = await api.get(`/entries/${id}`);
    return data;
  },
  update: async (id: string, entry: Partial<WorkEntryInput>): Promise<WorkEntry> => {
    const { data } = await api.put(`/entries/${id}`, entry);
    return data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/entries/${id}`);
  },
};

export const searchApi = {
  search: async (q: string, category?: string, limit?: number): Promise<SearchResponse> => {
    const { data } = await api.get('/search', { params: { q, category, limit } });
    return data;
  },
};

export const insightsApi = {
  get: async (period?: 'week' | 'month'): Promise<Insights> => {
    const { data } = await api.get('/insights', { params: { period } });
    return data;
  },
};

// New MVP API - Work Moments
export const momentsApi = {
  create: async (moment: WorkMomentInput): Promise<WorkMoment> => {
    const { data } = await api.post('/moments', moment);
    return data;
  },
  getAll: async (params?: {
    date?: string;
    state_after?: string;
    energy_cost?: string;
    limit?: number;
    offset?: number;
  }): Promise<MomentsResponse> => {
    const { data } = await api.get('/moments', { params });
    return data;
  },
  getToday: async (): Promise<{ moments: WorkMoment[] }> => {
    const { data } = await api.get('/moments/today');
    return data;
  },
  getTimeline: async (days?: number): Promise<TimelineResponse> => {
    const { data } = await api.get('/moments/timeline', { params: { days } });
    return data;
  },
  getById: async (id: string): Promise<WorkMoment> => {
    const { data } = await api.get(`/moments/${id}`);
    return data;
  },
  update: async (id: string, moment: Partial<WorkMomentInput>): Promise<WorkMoment> => {
    const { data } = await api.put(`/moments/${id}`, moment);
    return data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/moments/${id}`);
  },
};

// New MVP API - Threads
export const threadsApi = {
  create: async (name: string, moment_id?: string): Promise<Thread> => {
    const { data } = await api.post('/threads', { name, moment_id });
    return data;
  },
  getAll: async (params?: {
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<ThreadsResponse> => {
    const { data } = await api.get('/threads', { params });
    return data;
  },
  getActive: async (): Promise<{ threads: Thread[] }> => {
    const { data } = await api.get('/threads/active');
    return data;
  },
  getById: async (id: string): Promise<Thread> => {
    const { data } = await api.get(`/threads/${id}`);
    return data;
  },
  update: async (id: string, updates: { name?: string; status?: 'active' | 'dormant' }): Promise<Thread> => {
    const { data } = await api.put(`/threads/${id}`, updates);
    return data;
  },
  linkMoment: async (threadId: string, momentId: string): Promise<void> => {
    await api.post(`/threads/${threadId}/moments`, { moment_id: momentId });
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/threads/${id}`);
  },
};

export default api;
