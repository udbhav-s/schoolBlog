import { Global, Module, Provider } from '@nestjs/common';
import * as Knex from 'knex';
import { Model } from 'objection';

import { UserModel } from './models/user.model';
import { PostModel } from './models/post.model';
import { FileModel } from './models/file.model';
import { CommentModel } from './models/comment.model';
import { ReplyModel } from './models/reply.model';
import { CategoryModel } from './models/category.model';

import * as KnexConfig from '../../knexfile';
import { PostLikeModel } from './models/postLike.model';
import { NotificationModel } from './models/notification.model';

const models = [
  UserModel,
  PostModel,
  FileModel,
  CommentModel,
  ReplyModel,
  CategoryModel,
  PostLikeModel,
  NotificationModel,
];

const modelProviders = models.map(model => {
  return {
    provide: model.name,
    useValue: model,
  };
});

const providers = [
  ...modelProviders,
  {
    provide: 'KnexConnection',
    useFactory: async () => {
      const knex = Knex(KnexConfig);

      Model.knex(knex);
      return knex;
    },
  },
];

@Global()
@Module({
  providers: [...providers] as Provider<any>[],
  exports: [...providers] as Provider<any>[],
})
export class DatabaseModule {}
