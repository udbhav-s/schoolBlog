import { BaseModel } from './base.model';
import { Model } from 'objection';
import { PostModel } from './post.model';
import { CommentModel } from './comment.model';

export class UserModel extends BaseModel {
  static tableName = 'users';

  name!: string;
  portalId!: string;
  level!: number;
  type!: string;

  posts?: PostModel[];
  comments?: CommentModel[];

  static relationMappings = () => ({
    posts: {
      modelClass: PostModel,
      relation: Model.HasManyRelation,
      join: {
        from: 'users.id',
        to: 'posts.userId',
      },
    },

    comments: {
      modelClass: CommentModel,
      relation: Model.HasManyRelation,
      join: {
        from: 'users.id',
        to: 'comments.userId',
      },
    },
  });
}
