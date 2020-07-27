import { BaseModel } from './base.model';

export class PostLikeModel extends BaseModel {
  static tableName = 'postsLikes';

  userId!: number;
  postId!: number;
}
