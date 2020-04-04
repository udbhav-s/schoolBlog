import { BaseModel } from './base.model';
import { Model } from 'objection';
import { UserModel } from './user.model';
import { CommentModel } from './comment.model';
import { Levels } from 'src/common/util/level.enum';

export class ReplyModel extends BaseModel {
  static tableName = 'replies';

  body!: string;
  edited!: boolean;
  userId!: number;
  commentId!: number;

  comment?: CommentModel;
  user?: UserModel;

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
        from: 'replies.userId',
        to: 'users.id',
      },
    },

    comment: {
      modelClass: CommentModel,
      relation: Model.BelongsToOneRelation,
      join: {
        from: 'replies.commentId',
        to: 'comments.id',
      },
    },
  });
}
