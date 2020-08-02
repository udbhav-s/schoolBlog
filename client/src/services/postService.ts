import api from "./apiService";
import { Post, PostCreate, PostQueryOptions } from "@/types";

export const postService = {
  getById(id: number) {
    return api.get<Post>(`/post/${id}`);
  },
  getEditMode(id: number) {
    return api.get<Post>(`/post/edit/${id}`);
  },
  getAll(options: PostQueryOptions) {
    return api.get<Post[]>("/post/all", { params: options });
  },

  create() {
    return api.post<Post>("/post/create");
  },
  update(id: number, data: PostCreate) {
    return api.post<Post>(`/post/update/${id}`, data);
  },
  delete(id: number) {
    return api.delete<number>(`/post/${id}`);
  },

  like(id: number) {
    return api.post<any>(`/post/like/${id}`);
  },
  unlike(id: number) {
    return api.post<any>(`/post/unlike/${id}`);
  },

  verify(id: number) {
    return api.post<Post>(`/post/verify/${id}`);
  },
  unverify(id: number) {
    return api.post<Post>(`/post/unverify/${id}`);
  },
  publish(id: number) {
    return api.post<Post>(`/post/publish/${id}`);
  }
};
