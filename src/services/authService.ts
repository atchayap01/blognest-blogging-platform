import { apiRequest } from './api';
import { AuthResponse, User } from '../types';

export const authService = {
  async register(data: {
    name: string;
    email: string;
    password: string;
    confirmPassword?: string;
  }): Promise<AuthResponse> {
    return apiRequest<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async login(data: { email: string; password: string }): Promise<AuthResponse> {
    return apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getMe(): Promise<{ success: boolean; user: User }> {
    return apiRequest<{ success: boolean; user: User }>('/auth/me');
  },

  async updateProfile(data: {
    name?: string;
    bio?: string;
    avatar?: string;
  }): Promise<{ success: boolean; user: User }> {
    return apiRequest<{ success: boolean; user: User }>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};
