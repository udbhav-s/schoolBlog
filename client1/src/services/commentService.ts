import api from './apiService';
import { ApiResponse, PostComment, QueryOptions, CommentCreate } from '@/types';

export const commentService = {
  getById(id: number) {
    return api.get<ApiResponse<PostComment>>(`/comment/${id}`)
  },
  getAll(options: QueryOptions) {
    return api.get<ApiResponse<PostComment[]>>('/comment/all', { params: options });
  },
  getByPost(id: number) {
    return api.get(`/comment/post/${id}`)
  },

  create(data: CommentCreate) {
    return api.post<ApiResponse<PostComment>>("/comment/create", data);
  },
  update(id: number, data: CommentCreate) {
    return api.post<ApiResponse<PostComment>>(`/comment/update/${id}`, data)
  },
  delete(id: number) {
    return api.delete<ApiResponse<number>>(`/comment/${id}`);
  }
};