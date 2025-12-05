import { apiClient, ApiResponse } from '@/lib/api-client';
import { Expense, PaginatedResponse } from '@/types/api';

export interface AddExpenseRequest {
  messId: string;
  description: string;
  amount: number;
  category: 'food' | 'utilities' | 'maintenance' | 'other';
  expensedBy: string;
  date: string;
}

export interface GetExpensesParams {
  messId?: string;
  category?: 'food' | 'utilities' | 'maintenance' | 'other';
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export const expensesService = {
  async getExpenses(params: GetExpensesParams): Promise<ApiResponse<PaginatedResponse<Expense>>> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) queryParams.append(key, String(value));
    });
    return apiClient.get<PaginatedResponse<Expense>>(`/expenses?${queryParams}`);
  },

  async getExpense(id: string): Promise<ApiResponse<Expense>> {
    return apiClient.get<Expense>(`/expenses/${id}`);
  },

  async createExpense(data: AddExpenseRequest): Promise<ApiResponse<Expense>> {
    return apiClient.post<Expense>('/expenses', data);
  },

  async updateExpense(id: string, expense: Partial<AddExpenseRequest>): Promise<ApiResponse<Expense>> {
    return apiClient.put<Expense>(`/expenses/${id}`, expense);
  },

  async deleteExpense(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/expenses/${id}`);
  },
};