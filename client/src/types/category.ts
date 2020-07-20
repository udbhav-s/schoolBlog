import { Post } from ".";

export interface Category {
  id: number;
  name: string;
  posts?: Post[];
}

export type CategoryCreate = Partial<Category>;
