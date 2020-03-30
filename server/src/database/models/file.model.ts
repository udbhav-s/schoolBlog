import { Model } from 'objection';
import { BaseModel } from './base.model';
import { PostModel } from './post.model';

export class FileModel extends BaseModel {
  static tableName = 'files';

  filename: string;
  postId: number;

  static relationMappings = () => ({
    post: {
      modelClass: PostModel,
      relation: Model.BelongsToOneRelation,
      join: {
        from: 'files.postId',
        to: 'posts.id',
      },
    },
  });
}
