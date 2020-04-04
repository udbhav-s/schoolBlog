import { BaseModel } from './base.model';
import { Model } from 'objection';
import { UserModel } from './user.model';
import { PostModel } from './post.model';
import { ReplyModel } from './reply.model';
import { Levels } from 'src/common/util/level.enum';

export class CommentModel extends BaseModel {
  static tableName = 'comments';

  body!: string;
  edited!: boolean;
  userId!: number;
  postId!: number;

  post?: PostModel;
  user?: UserModel;
  replies?: ReplyModel[];

  canDelete(user: UserModel): boolean {
    return this.userId == user.id || user.level >= Levels.Moderator;
  }

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

    replies: {
      modelClass: ReplyModel,
      relation: Model.HasManyRelation,
      join: {
        from: 'comments.id',
        to: 'replies.commentId',
      },
    },
  });
}
