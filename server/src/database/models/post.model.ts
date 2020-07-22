import { BaseModel } from './base.model';
import { Model, QueryBuilder } from 'objection';
import { UserModel } from './user.model';
import { FileModel } from './file.model';
import { CommentModel } from './comment.model';
import { CategoryModel } from './category.model';

import { Levels } from 'src/common/util/level.enum';
import { PostGetOptionsDto } from '../../post/dto/postGetOptions.dto';
import { GET_OPTIONS, SEARCH } from '../modifiers';

import { raw } from 'objection';

export class PostModel extends BaseModel {
  static tableName = 'posts';

  title!: string;
  body?: string;
  verified?: boolean;
  published?: boolean;
  userId!: number;

  thumbnail?: string;
  attachments?: string[];
  user?: UserModel;
  comments?: CommentModel[];
  files?: FileModel[];
  category?: CategoryModel;

  // checks whether a user can access the post or not
  canAccess(user: UserModel): boolean {
    return (
      (this.verified && this.published) ||
      this.userId == user.id ||
      (user.level >= Levels.Moderator && this.published)
    );
  }

  canDelete(user: UserModel): boolean {
    return this.userId == user.id ||
    (user.level >= Levels.Moderator && this.published);
  }

  static modifiers = {
    postGetOptions(query: QueryBuilder<PostModel>, options: PostGetOptionsDto) {
      query.modify(GET_OPTIONS, options);

      if (options.verifiedOrUser && options.userId) {
        query.where(function() {
          this.where({ verified: true }).orWhere({ userId: options.userId });
        });
      } else if (options.userId) {
        query.where({ userId: options.userId });
      }

      if (options.published === false) {
        query.where({ published: false });
      } else {
        query.where({ published: true });
      }

      if (options.verified !== undefined) {
        query.where({ verified: options.verified });
      }
      if (options.search) {
        query.modify(SEARCH, options.search);
      }
      if (options.categoryId) {
        query.where({ categoryId: options.categoryId });
      }

      // query.debug();
    },

    search(query: QueryBuilder<PostModel>, str: string) {
      const columns = ['title', 'body'];
      let terms = str.split(/\s+/);
      terms = terms.map(term => term.trim());

      query.where(function() {
        for (const column of columns) {
          for (const term of terms) {
            this.orWhere(
              raw(`LOWER(??) like LOWER('%' || ? || '%')`, column, term),
            );
          }
        }
      })
      // query.debug();
    },

    ...BaseModel.modifiers,
  };

  static afterFind({ result = [] }) {
    return result.map((post: PostModel) => {
      // add thumbnail property
      post.thumbnail = post
        .files
        ?.find(f => f.type === 'thumbnail')
        ?.filename;
      // add attachments array
      post.attachments = post.
        files
        ?.filter(f => f.type === 'attachment')
        ?.map(a => a.filename);
      
      return post;
    });
  }

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

    category: {
      modelClass: CategoryModel,
      relation: Model.BelongsToOneRelation,
      join: {
        from: 'posts.categoryId',
        to: 'categories.id',
      },
    },
  });
}
