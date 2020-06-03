import api from "./apiService";
import { ApiResponse } from "@/types";

export const fileService = {
  uploadFile(postId: number, file: File, type: string) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);
    formData.append("postId", postId.toString());
    return api.post<ApiResponse<string>>(
      "/file/upload",
      formData,
      {
        headers: {
          'Content-Type': 'multipart/formdata'
        }
      }
    );
  },
  
  deleteFile(filename: string) {
    return api.delete(`/file/${filename}`);
  }
};
