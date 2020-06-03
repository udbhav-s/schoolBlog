import api from "./apiService";
import { ApiResponse } from "@/types";

export const fileService = {
  uploadFile(postId: number, file: File, type: string) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);
    return api.post<ApiResponse<string>>(
      `/file/upload/${postId}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/formdata'
        }
      }
    );
  }
};
