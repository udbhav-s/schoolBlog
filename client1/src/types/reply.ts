import { User, PostComment } from ".";

export interface Reply {
  id: number;
  body: string;
  edited: boolean;
  userId: number;
  commentId: number;

  comment?: PostComment;
  user?: User;
}

export type ReplyCreate = Partial<Reply>;
