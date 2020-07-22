import { Post, User, Reply } from ".";

export interface PostComment {
  id: number;
  body: string;
  edited: boolean;
  userId: number;
  postId: number;
  createdAt: string;

  post?: Post;
  user?: User;
  replies?: Reply[];
}

export type CommentCreate = Partial<PostComment>;
