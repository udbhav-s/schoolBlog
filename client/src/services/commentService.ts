import api from "./apiService";
import { PostComment, CommentQueryOptions, CommentCreate } from "@/types";

export const commentService = {
  getById(id: number) {
    return api.get<PostComment>(`/comment/${id}`);
  },
  getAll(options: CommentQueryOptions) {
    return api.get<PostComment[]>("/comment/all", {
      params: options
    });
  },

  create(data: CommentCreate) {
    return api.post<PostComment>("/comment/create", data);
  },
  update(id: number, data: CommentCreate) {
    return api.post<PostComment>(`/comment/update/${id}`, data);
  },
  delete(id: number) {
    return api.delete<number>(`/comment/${id}`);
  }
};
