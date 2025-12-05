import { apiClient, ApiResponse } from '@/lib/api-client';
import { Meal, PaginatedResponse } from '@/types/api';

export interface AddMealRequest {
  messId: string;
  userId: string;
  breakfast: number;
  lunch: number;
  dinner: number;
  date: string;
  status: 'taken' | 'skipped' | 'guest' | 'offday';
  mealType: 'regular' | 'offday' | 'holiday';
}

export interface BulkAddMealsRequest {
  messId: string;
  meals: Array<{
    userId: string;
    breakfast: number;
    lunch: number;
    dinner: number;
    date: string;
    status: 'taken' | 'skipped' | 'guest' | 'offday';
    mealType: 'regular' | 'offday' | 'holiday';
  }>;
}

export interface GetMealsParams {
  messId?: string;
  userId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface UpdateMealRequest {
  breakfast?: number;
  lunch?: number;
  dinner?: number;
  status?: 'taken' | 'skipped' | 'guest' | 'offday';
  mealType?: 'regular' | 'offday' | 'holiday';
}

export const mealsService = {
  async addMeal(data: AddMealRequest): Promise<ApiResponse<Meal>> {
    return apiClient.post<Meal>('/meals', data);
  },

  async bulkAddMeals(data: BulkAddMealsRequest): Promise<ApiResponse<Meal[]>> {
    return apiClient.post<Meal[]>('/meals/bulk', data);
  },

  async getMeals(params: GetMealsParams): Promise<ApiResponse<PaginatedResponse<Meal>>> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) queryParams.append(key, String(value));
    });
    return apiClient.get<PaginatedResponse<Meal>>(`/meals?${queryParams}`);
  },

  async updateMeal(mealId: string, data: UpdateMealRequest): Promise<ApiResponse<Meal>> {
    return apiClient.put<Meal>(`/meals/${mealId}`, data);
  },

  async deleteMeal(mealId: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/meals/${mealId}`);
  },
};