import api from "./apiService";
import { ApiResponse, PostComment, CommentQueryOptions, CommentCreate } from "@/types";

export const commentService = {
  getById(id: number) {
    return api.get<ApiResponse<PostComment>>(`/comment/${id}`);
  },
  getAll(options: CommentQueryOptions) {
    return api.get<ApiResponse<PostComment[]>>("/comment/all", {
      params: options
    });
  },

  create(data: CommentCreate) {
    return api.post<ApiResponse<PostComment>>("/comment/create", data);
  },
  update(id: number, data: CommentCreate) {
    return api.post<ApiResponse<PostComment>>(`/comment/update/${id}`, data);
  },
  delete(id: number) {
    return api.delete<ApiResponse<number>>(`/comment/${id}`);
  }
};
