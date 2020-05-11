import { User, PostComment } from ".";

export interface Reply {
  body: string;
  edited: boolean;
  userId: number;
  commentId: number;

  comment?: PostComment;
  user?: User;
}

export type ReplyCreate = Partial<Reply>;
