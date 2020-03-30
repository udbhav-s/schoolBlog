import { BaseModel } from './base.model';
import { Model } from 'objection';
import { UserModel } from './user.model';
import { PostModel } from './post.model';

export class CommentModel extends BaseModel {
  static tableName = 'comments';

  body: string;
  edited: boolean;
  userId: number;
  postId: number;

  static modifiers = {
    ...BaseModel.modifiers,
  };

  static relationMappings = () => ({
    user: {
      modelClass: UserModel,
      relation: Model.BelongsToOneRelation,
      join: {
        from: 'comments.userId',
        to: 'users.id',
      },
    },

    post: {
      modelClass: PostModel,
      relation: Model.BelongsToOneRelation,
      join: {
        from: 'comments.postId',
        to: 'posts.id',
      },
    },
  });
}
