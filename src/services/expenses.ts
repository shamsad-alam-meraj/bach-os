import { apiClient } from '@/lib/api-client';

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  memberId: string;
}

export const expensesService = {
  async getExpenses() {
    return apiClient.get<Expense[]>('/expenses');
  },

  async getExpense(id: string) {
    return apiClient.get<Expense>(`/expenses/${id}`);
  },

  async createExpense(expense: Omit<Expense, 'id'>) {
    return apiClient.post<Expense>('/expenses', expense);
  },

  async updateExpense(id: string, expense: Partial<Expense>) {
    return apiClient.put<Expense>(`/expenses/${id}`, expense);
  },

  async deleteExpense(id: string) {
    return apiClient.delete(`/expenses/${id}`);
  },
};
