import { apiClient, ApiResponse } from '@/lib/api-client';
import { User } from '@/types/api';

export interface Member {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'user' | 'manager' | 'admin';
  messId?: string;
  joinedAt: string;
}

export const membersService = {
  async getMembers(messId: string): Promise<ApiResponse<User[]>> {
    return apiClient.get<User[]>(`/mess/${messId}`).then(res => {
      if (res.success && res.data) {
        return { success: true, data: (res.data as any).members || [] };
      }
      return res;
    });
  },

  async getMember(id: string): Promise<ApiResponse<User>> {
    // Since individual member endpoint doesn't exist in new API,
    // we'll need to get all members and find the specific one
    // This is a limitation of the new API design
    throw new Error('Individual member retrieval not supported in new API');
  },

  async createMember(messId: string, email: string): Promise<ApiResponse<User>> {
    return apiClient.post<User>(`/mess/${messId}/members`, { email });
  },

  async updateMember(id: string, member: Partial<Member>): Promise<ApiResponse<User>> {
    // Update member through mess endpoint - this might need adjustment
    // For now, we'll assume the member belongs to the current user's mess
    // This needs to be handled differently in the UI
    throw new Error('Member update not directly supported in new API');
  },

  async deleteMember(messId: string, userId: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/mess/${messId}/members/${userId}`);
  },
};