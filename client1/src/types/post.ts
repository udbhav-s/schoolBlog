import { User } from ".";
import { Category } from "./category";

export interface Post {
  title: string;
  body?: string;
  thumbnail?: string;
  verified: boolean;
  userId: number;
  createdAt: string;

  user?: User;
  category?: Category;
}

export type PostCreate = Partial<Post>;
