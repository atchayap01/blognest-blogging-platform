export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  bio?: string;
  avatar?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Post {
  _id: string;
  title: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  category: string;
  tags: string[];
  author: User;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id: string;
  content: string;
  author: User;
  post: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CategoryInfo {
  name: string;
  count: number;
}

export interface PostsResponse {
  success: boolean;
  count: number;
  total: number;
  page: number;
  totalPages: number;
  posts: Post[];
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  token: string;
  user: User;
}

export interface DashboardStats {
  totalPosts: number;
  totalCommentsReceived: number;
}

export interface DatabaseStatus {
  connected: boolean;
  isAtlas: boolean;
  databaseName: string;
  host: string;
}
