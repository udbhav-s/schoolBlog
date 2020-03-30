import { BaseModel } from './base.model';
import { Model, QueryBuilder } from 'objection';
import { UserModel } from './user.model';
import { FileModel } from './file.model';
import { CommentModel } from './comment.model';

export class PostModel extends BaseModel {
  static tableName = 'posts';

  title: string;
  body: string;
  category: string;
  thumbnail: string;
  verified: boolean;
  userId: number;

  static modifiers = {
    verifiedOrByUser(query: QueryBuilder<PostModel>, userId: number) {
      query.where({ verified: true }).orWhere({ userId });
    },
    ...BaseModel.modifiers,
  };

  static relationMappings = () => ({
    user: {
      modelClass: UserModel,
      relation: Model.BelongsToOneRelation,
      join: {
        from: 'posts.userId',
        to: 'users.id',
      },
    },

    comments: {
      modelClass: CommentModel,
      relation: Model.HasManyRelation,
      join: {
        from: 'posts.id',
        to: 'comments.postId'
      }
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
