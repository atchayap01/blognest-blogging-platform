import { apiRequest } from './api';
import { User, Post, Comment, DashboardStats } from '../types';

export const userService = {
  async getUserById(id: string): Promise<{
    success: boolean;
    user: User;
    postsCount: number;
    posts: Post[];
  }> {
    return apiRequest<{
      success: boolean;
      user: User;
      postsCount: number;
      posts: Post[];
    }>(`/users/${id}`);
  },

  async updateUser(
    id: string,
    data: { name?: string; bio?: string; avatar?: string }
  ): Promise<{ success: boolean; message: string; user: User }> {
    return apiRequest<{ success: boolean; message: string; user: User }>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async getDashboardStats(): Promise<{
    success: boolean;
    stats: DashboardStats;
    posts: Post[];
    recentComments: (Comment & { post: { _id: string; title: string } })[];
  }> {
    return apiRequest<{
      success: boolean;
      stats: DashboardStats;
      posts: Post[];
      recentComments: (Comment & { post: { _id: string; title: string } })[];
    }>('/users/me/dashboard');
  },

  async getSystemStatus(): Promise<{
    status: string;
    timestamp: string;
    service: string;
    database: {
      connected: boolean;
      isAtlas: boolean;
      databaseName: string;
      host: string;
    };
  }> {
    return apiRequest('/status');
  },
};
