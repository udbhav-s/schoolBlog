import { ApiResponse, Reply, ReplyQueryOptions, ReplyCreate } from "@/types";
import api from "./apiService";

export const replyService = {
  getById(id: number) {
    return api.get<ApiResponse<Reply>>(`/reply/${id}`);
  },
  getAll(options: ReplyQueryOptions) {
    return api.get<ApiResponse<Reply[]>>("/reply/all", { params: options });
  },

  create(data: ReplyCreate) {
    return api.post<ApiResponse<Reply>>("/reply/create", data);
  },
  update(id: number, data: ReplyCreate) {
    return api.post<ApiResponse<Reply>>(`/reply/update/${id}`, data);
  },
  delete(id: number) {
    return api.delete<ApiResponse<number>>(`/reply/${id}`);
  }
};
