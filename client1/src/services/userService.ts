import api from "./apiService";
import { User, ApiResponse } from "@/types";

export const userService = {
  getCurrent() {
    return api.get<ApiResponse<User>>("/user/current");
  },
  getById(id: number) {
    return api.get<ApiResponse<User>>(`/user/${id}`);
  },
  getAll() {
    return api.get<ApiResponse<User[]>>(`/user/all`);
  },
  logout() {
    return api.get("/user/logout");
  },
  setLevel(id: number, level: number) {
    return api.post<ApiResponse<User>>(`/user/level/${id}`, { level });
  }
};
