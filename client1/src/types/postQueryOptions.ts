import { QueryOptions } from "./queryOptions";

export interface PostQueryOptions extends QueryOptions {
  verified?: boolean | string;
  userId?: number;
  categoryId?: number;
  search?: string;
}
