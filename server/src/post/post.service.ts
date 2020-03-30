import { Injectable, Inject } from '@nestjs/common';
import { ModelClass } from 'objection';
import * as sanitizeHtml from 'sanitize-html';
import sanitizeHtmlOptions from '../common/util/sanitizeHtmlOptions';
import { PostModel } from '../database/models/post.model';
import { PostGetOptionsDto } from './dto/postGetOptions.dto';
import { PostCreateDto } from './dto/postCreate.dto';
import { GET_OPTIONS, VERIFIED_OR_BY_USER } from '../database/modifiers';

@Injectable()
export class PostService {
  constructor(@Inject('PostModel') private postModel: ModelClass<PostModel>) {}

  async getById(id: number): Promise<PostModel> {
    return await this.postModel
      .query()
      .findById(id)
      .withGraphFetched('user');
  }

  async getByUser(
    userId: number,
    options: PostGetOptionsDto | undefined,
  ): Promise<PostModel[]> {
    const query = this.postModel
      .query()
      .where({ userId })
      .withGraphFetched('user');
    // apply options if any
    if (options) {
      query.modify(GET_OPTIONS, options);
      // get only posts which are verified or by current user
      if (options.verifiedOrCurrentUser && options.userId) {
        query.modify(VERIFIED_OR_BY_USER, options.userId);
      }
    }
    // return result
    return await query;
  }

  async getAll(options: PostGetOptionsDto | undefined): Promise<PostModel[]> {
    const query = this.postModel.query();
    if (options) {
      // options for pagination and sorting
      query.modify(GET_OPTIONS, options);
      // get only posts which are verified or by current user
      if (options.verifiedOrCurrentUser && options.userId) {
        query.modify(VERIFIED_OR_BY_USER, options.userId);
      }
    }
    // add user
    query.withGraphFetched('user');
    return await query;
  }

  sanitizeBody(body: string): string {
    return sanitizeHtml(body, sanitizeHtmlOptions);
  }

  async create(data: PostCreateDto): Promise<PostModel> {
    const post = await this.postModel
      .query()
      .allowGraph('files')
      .insertGraph(data);

    return await this.postModel
      .query()
      .where({ id: post.id })
      .first()
      .withGraphFetched('user');
  }

  async update(data: PostCreateDto): Promise<PostModel> {
    const post = await this.postModel
      .query()
      .allowGraph('files')
      .upsertGraph(data);

    return await this.postModel
      .query()
      .where({ id: post.id })
      .first()
      .withGraphFetched('user');
  }

  async verify(id: number): Promise<PostModel> {
    return await this.postModel
      .query()
      .patchAndFetchById(id, { verified: true })
      .withGraphFetched('user');
  }

  async unverify(id: number): Promise<PostModel> {
    return await this.postModel
      .query()
      .patchAndFetchById(id, { verified: false })
      .withGraphFetched('user');
  }

  async del(id: number): Promise<PostModel> {
    return await this.postModel
      .query()
      .where({ id })
      .del()
      .returning('*')
      .first();
  }
}
