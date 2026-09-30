import { apiRequest } from './api';
import { Post, PostsResponse, CategoryInfo } from '../types';

export interface GetPostsParams {
  search?: string;
  category?: string;
  tag?: string;
  author?: string;
  sort?: 'newest' | 'oldest' | 'popular';
  page?: number;
  limit?: number;
}

export const postService = {
  async getPosts(params: GetPostsParams = {}): Promise<PostsResponse> {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.category) query.append('category', params.category);
    if (params.tag) query.append('tag', params.tag);
    if (params.author) query.append('author', params.author);
    if (params.sort) query.append('sort', params.sort);
    if (params.page) query.append('page', params.page.toString());
    if (params.limit) query.append('limit', params.limit.toString());

    const qs = query.toString();
    return apiRequest<PostsResponse>(`/posts${qs ? `?${qs}` : ''}`);
  },

  async getPostById(id: string): Promise<{ success: boolean; post: Post }> {
    return apiRequest<{ success: boolean; post: Post }>(`/posts/${id}`);
  },

  async getCategories(): Promise<{ success: boolean; categories: CategoryInfo[] }> {
    return apiRequest<{ success: boolean; categories: CategoryInfo[] }>('/posts/categories');
  },

  async createPost(data: {
    title: string;
    content: string;
    excerpt?: string;
    featuredImage?: string;
    category: string;
    tags?: string[] | string;
  }): Promise<{ success: boolean; message: string; post: Post }> {
    return apiRequest<{ success: boolean; message: string; post: Post }>('/posts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updatePost(
    id: string,
    data: {
      title?: string;
      content?: string;
      excerpt?: string;
      featuredImage?: string;
      category?: string;
      tags?: string[] | string;
    }
  ): Promise<{ success: boolean; message: string; post: Post }> {
    return apiRequest<{ success: boolean; message: string; post: Post }>(`/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deletePost(id: string): Promise<{ success: boolean; message: string }> {
    return apiRequest<{ success: boolean; message: string }>(`/posts/${id}`, {
      method: 'DELETE',
    });
  },
};
