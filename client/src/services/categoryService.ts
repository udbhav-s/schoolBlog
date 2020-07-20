import api from "./apiService";
import { ApiResponse, Category, CategoryCreate } from "@/types";

export const categoryService = {
  getById(id: number) {
    return api.get<ApiResponse<Category>>(`/category/${id}`);
  },
  getAll() {
    return api.get<ApiResponse<Category[]>>("/category/all");
  },

  create(data: CategoryCreate) {
    return api.post<ApiResponse<Category>>("/category/create", data);
  },
  update(id: number, data: CategoryCreate) {
    return api.post<ApiResponse<Category>>(`/category/update/${id}`, data);
  },
  delete(id: number) {
    return api.delete<ApiResponse<number>>(`/category/${id}`);
  }
};
