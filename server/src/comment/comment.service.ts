import { Injectable, Inject } from '@nestjs/common';
import { ModelClass } from 'objection';
import { CommentModel } from '../database/models/comment.model';
import { PostModel } from '../database/models/post.model';
import { CommentCreateDto, CommentUpdateDto } from './dto/commentCreate.dto';

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

  async getByUser(userId: number, verified: boolean): Promise<CommentModel[]> {
    // get comment
    const query = this.commentModel
      .query()
      .where({ userId })
      .withGraphFetched('user');
    // get comments on verified posts
    if (verified) query.joinRelated('post').where('post.verified', true);
    // return result
    return await query;
  }

  async getByPost(postId: number): Promise<CommentModel[]> {
    return await this.commentModel
      .query()
      .where({ postId })
      .withGraphFetched('user');
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

  async update(id: number, data: CommentUpdateDto): Promise<CommentModel> {
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
