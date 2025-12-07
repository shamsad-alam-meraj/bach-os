import { apiClient, ApiResponse } from '@/lib/api-client';

export interface GenerateMarketScheduleRequest {
  messId: string;
  prompt: string;
  month: number;
  year: number;
}

export interface MarketScheduleResponse {
  schedule: { date: string; member: string }[];
  explanation: string;
  confidence: number;
}

export interface GenerateMealPlanRequest {
  prompt: string;
}

export interface MealPlanResponse {
  mealPlan: string;
}

export const aiService = {
  async generateMarketSchedule(data: GenerateMarketScheduleRequest): Promise<ApiResponse<MarketScheduleResponse>> {
    return apiClient.post<MarketScheduleResponse>('/ai/market-schedule', data);
  },

  async generateMealPlan(data: GenerateMealPlanRequest): Promise<ApiResponse<MealPlanResponse>> {
    return apiClient.post<MealPlanResponse>('/ai/meal-plan', data);
  },
};