import { apiClient, ApiResponse } from '@/lib/api-client';
import { Plan, Subscription } from '@/types/api';

export interface CreateSubscriptionRequest {
  messId: string;
  planId: string;
  couponCode?: string;
  paymentMethod: 'sslcommerz' | 'stripe' | 'bank_transfer' | 'cash';
  autoRenew: boolean;
}

export const subscriptionsService = {
  async getPlans(): Promise<ApiResponse<Plan[]>> {
    return apiClient.get<Plan[]>('/subscriptions/plans');
  },

  async createSubscription(data: CreateSubscriptionRequest): Promise<ApiResponse<Subscription>> {
    return apiClient.post<Subscription>('/subscriptions', data);
  },

  async getMessSubscriptions(messId: string): Promise<ApiResponse<Subscription[]>> {
    return apiClient.get<Subscription[]>(`/subscriptions/mess/${messId}`);
  },

  async cancelSubscription(subscriptionId: string): Promise<ApiResponse<void>> {
    return apiClient.put<void>(`/subscriptions/${subscriptionId}/cancel`, {});
  },
};