import { Injectable, Inject } from '@nestjs/common';
import { ModelClass } from 'objection';
import { CommentModel } from '../database/models/comment.model';
import { PostModel } from '../database/models/post.model';
import { CommentCreateDto } from './dto/commentCreate.dto';
import { GET_OPTIONS } from 'src/database/modifiers';
import { CommentGetOptionsDto } from './dto/commentGetOptions.dto';

@Injectable()
export class CommentService {
  constructor(
    @Inject('CommentModel') private commentModel: ModelClass<CommentModel>,
  ) {}

  async getById(id: number): Promise<CommentModel> {
    return await this.commentModel
      .query()
      .findById(id)
      .withGraphFetched('user');
  }

  async getAll(options?: CommentGetOptionsDto): Promise<CommentModel[]> {
    const query = this.commentModel
      .query()
      .withGraphFetched('[user, post(title)]')
      .modifiers({
        title(builder) {
          builder.select('title');
        },
      });
    // add options
    if (options) {
      // get comments on post
      if (options.postId) query.where({ postId: options.postId });
      // apply other options
      query.modify(GET_OPTIONS, options);
    }
    // default sort latest first
    else query.modify(GET_OPTIONS, {
      orderBy: 'createdAt',
      order: 'desc'
    });
    return await query;
  }

  async getPost(id: number): Promise<PostModel> {
    return await this.commentModel
      .relatedQuery('post')
      .for(id)
      .first();
  }

  async create(data: CommentCreateDto): Promise<CommentModel> {
    return await this.commentModel
      .query()
      .insert(data)
      .returning('*')
      .withGraphFetched('user');
  }

  async update(id: number, data: CommentCreateDto): Promise<CommentModel> {
    return await this.commentModel
      .query()
      .where({ id })
      .patch(data)
      .returning('*')
      .first()
      .withGraphFetched('user');
  }

  async del(id: number): Promise<CommentModel> {
    return await this.commentModel
      .query()
      .where({ id })
      .del()
      .returning('*')
      .first();
  }
}
