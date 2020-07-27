import { User } from ".";
import { Category } from "./category";

export interface Post {
  id: number;
  title: string;
  body?: string;
  published: boolean;
  verified: boolean;
  userId: number;
  categoryId: number;
  createdAt: string;
  numberOfLikes: number;
  isLiked: boolean;

  thumbnail?: string;
  attachments?: string[];
  user?: User;
  category?: Category;
}

export type PostCreate = Partial<Post>;
