import api from "./apiService";
import { User, ApiResponse, Credentials } from "@/types";

export const userService = {
  getCurrent() {
    return api.get<ApiResponse<User>>("/user/current");
  },
  getById(id: number) {
    return api.get<ApiResponse<User>>(`/user/${id}`);
  },
  login(credentials: Credentials) {
    return api.post<ApiResponse<User>>("/user/login", credentials);
  },
  logout() {
    return api.get("/user/logout");
  }
};
