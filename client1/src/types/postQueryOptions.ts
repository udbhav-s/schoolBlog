import { QueryOptions } from "./queryOptions";

export interface PostQueryOptions extends QueryOptions {
  verified?: boolean;
  userId?: number;
  categoryId?: number;
  search?: string;
}
