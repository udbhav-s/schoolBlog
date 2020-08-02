import api from "./apiService";
import { Category, CategoryCreate } from "@/types";

export const categoryService = {
  getById(id: number) {
    return api.get<Category>(`/category/${id}`);
  },
  getAll() {
    return api.get<Category[]>("/category/all");
  },

  create(data: CategoryCreate) {
    return api.post<Category>("/category/create", data);
  },
  update(id: number, data: CategoryCreate) {
    return api.post<Category>(`/category/update/${id}`, data);
  },
  delete(id: number) {
    return api.delete<number>(`/category/${id}`);
  }
};
