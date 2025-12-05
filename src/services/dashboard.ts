import { apiClient, ApiResponse } from '@/lib/api-client';
import { DashboardData, AnalyticsData, ReportData } from '@/types/api';

export interface GetAnalyticsParams {
  startDate?: string;
  endDate?: string;
}

export interface GenerateReportParams {
  type: 'monthly' | 'member' | 'expense';
  month?: number;
  year?: number;
  startDate?: string;
  endDate?: string;
}

export const dashboardService = {
  async getDashboardData(messId: string): Promise<ApiResponse<DashboardData>> {
    return apiClient.get<DashboardData>(`/dashboard/${messId}`);
  },

  async getAnalytics(messId: string, params: GetAnalyticsParams): Promise<ApiResponse<AnalyticsData>> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) queryParams.append(key, String(value));
    });
    return apiClient.get<AnalyticsData>(`/analytics/${messId}?${queryParams}`);
  },

  async generateReport(messId: string, params: GenerateReportParams): Promise<ApiResponse<ReportData>> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) queryParams.append(key, String(value));
    });
    return apiClient.get<ReportData>(`/reports/${messId}?${queryParams}`);
  },
};