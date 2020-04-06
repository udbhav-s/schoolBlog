import { Model } from 'objection';
import { BaseModel } from './base.model';
import { PostModel } from './post.model';

export class CategoryModel extends BaseModel {
  static tableName = 'categories';

  name!: string;

  posts: PostModel[];

  static relationMappings = () => ({
    posts: {
      modelClass: PostModel,
      relation: Model.HasManyRelation,
      join: {
        from: 'categories.id',
        to: 'posts.categoryId',
      },
    },
  });
}
