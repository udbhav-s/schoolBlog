import api from "./apiService";
import { ApiResponse, Category } from "@/types";

export const categoryService = {
  getById(id: number) {
    return api.get<ApiResponse<Category>>(`/category/${id}`);
  },
  getAll() {
    return api.get<ApiResponse<Category[]>>("/category/all");
  },

  create(data: Category) {
    return api.post<ApiResponse<Category>>("/category/create", data);
  },
  update(id: number, data: Category) {
    return api.post<ApiResponse<Category>>(`/category/update/${id}`, data);
  },
  delete(id: number) {
    return api.delete<ApiResponse<number>>(`/category/${id}`);
  }
};
