import { Injectable, Inject } from '@nestjs/common';
import { ModelClass } from 'objection';
import * as sanitizeHtml from 'sanitize-html';
import sanitizeHtmlOptions from '../common/util/sanitizeHtmlOptions';
import { PostModel } from '../database/models/post.model';
import { PostGetOptionsDto } from './dto/postGetOptions.dto';
import { PostCreateDto } from './dto/postCreate.dto';

@Injectable()
export class PostService {
  constructor(@Inject('PostModel') private postModel: ModelClass<PostModel>) {}

  async getById(id: number): Promise<PostModel> {
    return await this.postModel
      .query()
      .findById(id)
      .withGraphFetched('[user]');
  }

  async getByUser(userId: number): Promise<PostModel[]> {
    return await this.postModel
      .query()
      .where({ userId })
      .withGraphFetched('[user]');
  }

  async getAll(options: PostGetOptionsDto | undefined): Promise<PostModel[]> {
    const query = this.postModel.query();
    // options for pagination
    if (options.limit) query.limit(options.limit);
    if (options.offset) query.offset(options.offset);
    if (options.verifiedOrCurrentUser) {
      query.where({ verified: true }).orWhere({ userId: options.userId });
    }
    // order options
    if (options.orderBy && options.order) {
      query.toKnexQuery().orderBy(options.orderBy, options.order);
    }
    // add user
    query.withGraphFetched('[user]');
    return await query;
  }

  sanitizeBody(body: string): string {
    return sanitizeHtml(body, sanitizeHtmlOptions);
  }

  async create(data: PostCreateDto): Promise<PostModel> {
    return await this.postModel
      .query()
      .insertGraph(data)
      .returning('*')
      .withGraphFetched('[user]');
  }

  async update(data: PostCreateDto): Promise<PostModel> {
    return await this.postModel
      .query()
      .upsertGraph(data)
      .returning('*')
      .withGraphFetched('[user]');
  }

  async verify(id: number): Promise<PostModel> {
    return await this.postModel
      .query()
      .patchAndFetchById(id, { verified: true })
      .withGraphFetched('[user]');
  }

  async unverify(id: number): Promise<PostModel> {
    return await this.postModel
      .query()
      .patchAndFetchById(id, { verified: false })
      .withGraphFetched('[user]');
  }
}
