import { BASE_URL } from '@/utils/baseUrl';
import { isOnline, saveOfflineData } from './offline-storage';

/**
 * Base URL for API endpoints
 */
const API_BASE_URL = `${BASE_URL}api`;

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
  offline?: boolean;
  success: boolean;
}

/**
 * Get authentication token from localStorage
 * Returns null if running on server or no token exists
 */
const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

/**
 * API client for making HTTP requests to the backend
 * Handles authentication, offline support, and error handling
 */
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
        let errorMessage = 'Request failed';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch {
          // If parsing fails, use default message
        }
        return {
          error: { message: errorMessage, status: response.status },
          success: false,
        };
      }

      const data = await response.json();
      return { data: data.data, success: true };
    } catch (error) {
      return {
        error: { message: (error as Error).message, code: 'NETWORK_ERROR' },
        success: false,
      };
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
        return { data: body as T, offline: true, success: true };
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
        let errorMessage = 'Request failed';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch {
          // If parsing fails, use default message
        }
        return {
          error: { message: errorMessage, status: response.status },
          success: false,
        };
      }

      const data = await response.json();
      return { data, success: true };
    } catch (error) {
      // Save to offline storage on network error
      if (endpoint.includes('/meals')) {
        await saveOfflineData('meal', body);
      } else if (endpoint.includes('/expenses')) {
        await saveOfflineData('expense', body);
      }
      return { data: body as T, offline: true, success: true };
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
        let errorMessage = 'Request failed';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch {
          // If parsing fails, use default message
        }
        return {
          error: { message: errorMessage, status: response.status },
          success: false,
        };
      }

      const data = await response.json();
      return { data, success: true };
    } catch (error) {
      return {
        error: { message: (error as Error).message, code: 'NETWORK_ERROR' },
        success: false,
      };
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
        let errorMessage = 'Request failed';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch {
          // If parsing fails, use default message
        }
        return {
          error: { message: errorMessage, status: response.status },
          success: false,
        };
      }

      const data = await response.json();
      return { data, success: true };
    } catch (error) {
      return {
        error: { message: (error as Error).message, code: 'NETWORK_ERROR' },
        success: false,
      };
    }
  },
};
