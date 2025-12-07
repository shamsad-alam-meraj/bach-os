import { apiClient, ApiResponse } from '@/lib/api-client';
import { Deposit, PaginatedResponse } from '@/types/api';

export interface AddDepositRequest {
  messId: string;
  userId: string;
  amount: number;
  date: string;
  description?: string;
}

export interface GetDepositsParams {
  messId?: string;
  userId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export const depositsService = {
  async getDeposits(params: GetDepositsParams): Promise<ApiResponse<PaginatedResponse<Deposit>>> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) queryParams.append(key, String(value));
    });
    return apiClient.get<PaginatedResponse<Deposit>>(`/deposits?${queryParams}`);
  },

  async addDeposit(data: AddDepositRequest): Promise<ApiResponse<Deposit>> {
    return apiClient.post<Deposit>('/deposits', data);
  },
};