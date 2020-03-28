import { BaseModel } from './base.model';
import { UserModel } from './user.model';
import { Model } from 'objection';

export class PostModel extends BaseModel {
  static tableName = 'posts';

  title: string;
  body: string;
  category: string;
  thumbnail: string;
  verified: boolean;
  userId: number;

  user: UserModel;

  static relationMappings = {
    user: {
      modelClass: UserModel,
      relation: Model.BelongsToOneRelation,
      join: {
        from: 'posts.userId',
        to: 'users.id'
      }
    }
  }
}
