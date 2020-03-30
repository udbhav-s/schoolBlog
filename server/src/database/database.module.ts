import { Global, Module, Provider } from '@nestjs/common';
import * as Knex from 'knex';
import { Model } from 'objection';

import { UserModel } from './models/user.model';
import { PostModel } from './models/post.model';
import { FileModel } from './models/file.model';
import { CommentModel } from './models/comment.model';

import * as KnexConfig from '../../knexfile';

const models = [UserModel, PostModel, FileModel, CommentModel];

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
