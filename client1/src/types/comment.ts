import { Post, User, Reply } from ".";

export interface PostComment {
  id: number;
  body: string;
  edited: boolean;
  userId: number;
  postId: number;

  post?: Post;
  user?: User;
  replies?: Reply[];
}

export type CommentCreate = Partial<PostComment>;
