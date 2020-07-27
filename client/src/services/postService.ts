import api from "./apiService";
import { Post, PostCreate, ApiResponse, PostQueryOptions } from "@/types";

export const postService = {
  getById(id: number) {
    return api.get<ApiResponse<Post>>(`/post/${id}`);
  },
  getEditMode(id: number) {
    return api.get<ApiResponse<Post>>(`/post/edit/${id}`);
  },
  getAll(options: PostQueryOptions) {
    return api.get<ApiResponse<Post[]>>("/post/all", { params: options });
  },

  create() {
    return api.post<ApiResponse<Post>>("/post/create");
  },
  update(id: number, data: PostCreate) {
    return api.post<ApiResponse<Post>>(`/post/update/${id}`, data);
  },
  delete(id: number) {
    return api.delete<ApiResponse<number>>(`/post/${id}`);
  },

  like(id: number) {
    return api.post<ApiResponse<any>>(`/post/like/${id}`);
  },
  unlike(id: number) {
    return api.post<ApiResponse<any>>(`/post/unlike/${id}`);
  },

  verify(id: number) {
    return api.post<ApiResponse<Post>>(`/post/verify/${id}`);
  },
  unverify(id: number) {
    return api.post<ApiResponse<Post>>(`/post/unverify/${id}`);
  },
  publish(id: number) {
    return api.post<ApiResponse<Post>>(`/post/publish/${id}`);
  }
};
