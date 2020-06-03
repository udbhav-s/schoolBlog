import { User } from ".";
import { Category } from "./category";

export interface Post {
  id: number;
  title: string;
  body?: string;
  thumbnail?: string;
  published: boolean;
  verified: boolean;
  userId: number;
  createdAt: string;

  user?: User;
  category?: Category;
}

export type PostCreate = Partial<Post>;
