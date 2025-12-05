import { apiClient, ApiResponse } from '@/lib/api-client';
import { Mess, User } from '@/types/api';

export interface UpdateMessRequest {
  name?: string;
  description?: string;
  address?: string;
  mealRate?: number;
}

export interface AddMemberRequest {
  email: string;
}

export const messService = {
  async getMessDetails(messId: string): Promise<ApiResponse<Mess>> {
    return apiClient.get<Mess>(`/mess/${messId}`);
  },

  async updateMess(messId: string, data: UpdateMessRequest): Promise<ApiResponse<Mess>> {
    return apiClient.put<Mess>(`/mess/${messId}`, data);
  },

  async addMember(messId: string, data: AddMemberRequest): Promise<ApiResponse<User>> {
    return apiClient.post<User>(`/mess/${messId}/members`, data);
  },

  async removeMember(messId: string, userId: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/mess/${messId}/members/${userId}`);
  },
};