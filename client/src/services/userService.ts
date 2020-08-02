import api from "./apiService";
import { User, QueryOptions } from "@/types";

export const userService = {
  getCurrent() {
    return api.get<User>("/user/current");
  },
  getById(id: number) {
    return api.get<User>(`/user/${id}`);
  },
  getAll(options?: QueryOptions) {
    return api.get<User[]>(`/user/all`, { params: options });
  },
  logout() {
    return api.get("/user/logout");
  },
  setLevel(id: number, level: number) {
    return api.post<User>(`/user/level/${id}`, { level });
  }
};
