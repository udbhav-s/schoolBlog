import { BaseModel } from './base.model';
import { Model, QueryBuilder } from 'objection';
import { UserModel } from './user.model';
import { FileModel } from './file.model';
import { CommentModel } from './comment.model';

import { Levels } from 'src/common/util/level.enum';
import { PostGetOptionsDto } from '../../post/dto/postGetOptions.dto';
import { GET_OPTIONS } from '../modifiers';

export class PostModel extends BaseModel {
  static tableName = 'posts';

  title!: string;
  body?: string;
  category?: string;
  thumbnail?: string;
  verified?: boolean;
  userId!: number;

  user?: UserModel;
  comments?: CommentModel[];
  files?: FileModel[];

  // checks whether a user can access the post or not
  // based on verified property
  canAccess(user: UserModel): boolean {
    return (
      this.verified || this.userId == user.id || user.level >= Levels.Moderator
    );
  }

  canDelete(user: UserModel): boolean {
    return this.userId == user.id || user.level >= Levels.Moderator;
  }

  static modifiers = {
    postGetOptions(query: QueryBuilder<PostModel>, options: PostGetOptionsDto) {
      query.modify(GET_OPTIONS, options);

      if (options.verifiedOrUser && options.userId) {
        query.where({ verified: true }).orWhere({ userId: options.userId });
      } else if (options.userId) {
        query.where({ userId: options.userId });
      }

      if (options.verified !== undefined) {
        query.where({ verified: options.verified });
      }
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
        to: 'comments.postId',
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
