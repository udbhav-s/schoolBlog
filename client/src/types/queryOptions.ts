export interface QueryOptions {
  orderBy?: string;
  order?: string;
  limit: number;
  offset: number;
}

export interface PostQueryOptions extends QueryOptions {
  verified?: boolean | string;
  published?: boolean;
  userId?: number;
  categoryId?: number;
  search?: string;
}

export interface CommentQueryOptions extends QueryOptions {
  postId?: number;
}

export interface ReplyQueryOptions extends QueryOptions {
  commentId?: number;
}