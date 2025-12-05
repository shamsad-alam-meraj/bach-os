import { apiClient, ApiResponse } from '@/lib/api-client';
import { User, PaginatedResponse } from '@/types/api';

export interface UpdateProfileRequest {
  name?: string;
  phone?: string;
  dateOfBirth?: string;
  profileImage?: string;
}

export interface UpdatePreferencesRequest {
  notifications?: boolean;
  language?: string;
  theme?: 'light' | 'dark';
}

export interface SearchUsersParams {
  search?: string;
  role?: 'user' | 'manager' | 'admin';
  messId?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  adminUsers: number;
  managerUsers: number;
  usersWithMess: number;
  usersWithoutMess: number;
  recentRegistrations: number;
}

export const usersService = {
  async getProfile(): Promise<ApiResponse<User>> {
    return apiClient.get<User>('/users/profile');
  },

  async updateProfile(data: UpdateProfileRequest): Promise<ApiResponse<User>> {
    return apiClient.put<User>('/users/profile', data);
  },

  async updatePreferences(data: UpdatePreferencesRequest): Promise<ApiResponse<User>> {
    return apiClient.put<User>('/users/preferences', data);
  },

  async searchUsers(params: SearchUsersParams): Promise<ApiResponse<PaginatedResponse<User>>> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) queryParams.append(key, String(value));
    });
    return apiClient.get<PaginatedResponse<User>>(`/users/search?${queryParams}`);
  },

  async getUserStats(): Promise<ApiResponse<UserStats>> {
    return apiClient.get<UserStats>('/users/stats/overview');
  },
};