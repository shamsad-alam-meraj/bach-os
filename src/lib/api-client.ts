import { BASE_URL } from '@/utils/baseUrl';
import { isOnline, saveOfflineData } from './offline-storage';

const API_BASE_URL = `${BASE_URL}api`;

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  offline?: boolean;
}

const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

export const apiClient = {
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        return { error: error.error || 'Request failed' };
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      return { error: (error as Error).message };
    }
  },

  async post<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    try {
      // Check if online
      if (!isOnline()) {
        // Save to offline storage for later sync
        if (endpoint.includes('/meals')) {
          await saveOfflineData('meal', body);
        } else if (endpoint.includes('/expenses')) {
          await saveOfflineData('expense', body);
        }
        return { data: body as T, offline: true };
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const error = await response.json();
        return { error: error.error || 'Request failed' };
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      // Save to offline storage on network error
      if (endpoint.includes('/meals')) {
        await saveOfflineData('meal', body);
      } else if (endpoint.includes('/expenses')) {
        await saveOfflineData('expense', body);
      }
      return { data: body as T, offline: true };
    }
  },

  async put<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const error = await response.json();
        return { error: error.error || 'Request failed' };
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      return { error: (error as Error).message };
    }
  },

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        return { error: error.error || 'Request failed' };
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      return { error: (error as Error).message };
    }
  },
};
