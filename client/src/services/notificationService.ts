import api from "./apiService";
import { AppNotification } from "@/types";

export const notificationService = {
  getAll() {
    return api.get<AppNotification[]>('/notification/all')
  },
  
  delete(id: number) {
    return api.delete(`/notification/${id}`);
  },
  deleteAll() {
    return api.delete('/notification/all');
  }
};
