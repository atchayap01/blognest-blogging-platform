import { apiRequest } from './api';
import { Comment } from '../types';

export const commentService = {
  async getCommentsByPost(postId: string): Promise<{
    success: boolean;
    count: number;
    comments: Comment[];
  }> {
    return apiRequest<{
      success: boolean;
      count: number;
      comments: Comment[];
    }>(`/posts/${postId}/comments`);
  },

  async createComment(
    postId: string,
    content: string
  ): Promise<{
    success: boolean;
    message: string;
    comment: Comment;
    commentCount: number;
  }> {
    return apiRequest<{
      success: boolean;
      message: string;
      comment: Comment;
      commentCount: number;
    }>(`/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  },

  async deleteComment(
    commentId: string
  ): Promise<{
    success: boolean;
    message: string;
    commentCount: number;
  }> {
    return apiRequest<{
      success: boolean;
      message: string;
      commentCount: number;
    }>(`/comments/${commentId}`, {
      method: 'DELETE',
    });
  },
};
