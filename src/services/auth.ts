import { apiClient, ApiResponse } from '@/lib/api-client';
import { User } from '@/types/api';
import { BASE_URL } from '@/utils/baseUrl';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export const authService = {
  async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    return apiClient.post<AuthResponse>('/auth/login', credentials);
  },

  async signup(data: SignupRequest): Promise<ApiResponse<AuthResponse>> {
    return apiClient.post<AuthResponse>('/auth/signup', data);
  },

  googleLogin(): void {
    window.location.href = `${BASE_URL}api/auth/google`;
  },
};
