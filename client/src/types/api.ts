export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiError {
  error: string;
  message: string;
  status: number;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;
