import { apiClient } from '@/lib/api-client';

export interface Member {
  id: string;
  name: string;
  email: string;
  phone?: string;
  joinedAt: string;
}

export const membersService = {
  async getMembers() {
    return apiClient.get<Member[]>('/members');
  },

  async getMember(id: string) {
    return apiClient.get<Member>(`/members/${id}`);
  },

  async createMember(member: Omit<Member, 'id' | 'joinedAt'>) {
    return apiClient.post<Member>('/members', member);
  },

  async updateMember(id: string, member: Partial<Member>) {
    return apiClient.put<Member>(`/members/${id}`, member);
  },

  async deleteMember(id: string) {
    return apiClient.delete(`/members/${id}`);
  },
};