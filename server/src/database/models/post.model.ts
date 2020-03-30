import { BaseModel } from './base.model';
import { Model } from 'objection';
import { UserModel } from './user.model';
import { FileModel } from './file.model';

export class PostModel extends BaseModel {
  static tableName = 'posts';

  title: string;
  body: string;
  category: string;
  thumbnail: string;
  verified: boolean;
  userId: number;

  static relationMappings = () => ({
    user: {
      modelClass: UserModel,
      relation: Model.BelongsToOneRelation,
      join: {
        from: 'posts.userId',
        to: 'users.id',
      },
    },
    files: {
      modelClass: FileModel,
      relation: Model.HasManyRelation,
      join: {
        from: 'posts.id',
        to: 'files.postId',
      },
    },
  });
}
