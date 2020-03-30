import { Injectable, Inject, ForbiddenException } from '@nestjs/common';
import { ModelClass } from 'objection';
import { CommentModel } from 'src/database/models/comment.model';
import { CommentCreateDto, CommentUpdateDto } from './dto/commentCreate.dto';

@Injectable()
export class CommentService {
  constructor(
    @Inject('CommentModel') private commentModel: ModelClass<CommentModel>,
  ) {}

  async getById(id: number, verified?: boolean): Promise<CommentModel> {
    // get the comment with post attached
    let comment = await this.commentModel
      .query()
      .findById(id)
      .withGraphFetched('[post, user]');
    // only get comments on verified posts
    if (verified && comment.post.verified === false) {
      throw new ForbiddenException();
    }
    // return result
    return comment;
  }

  async getByUser(userId: number, verified: boolean): Promise<CommentModel[]> {
    // get comment
    let query = this.commentModel
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

  async create(data: CommentCreateDto): Promise<CommentModel> {
    return await this.commentModel
      .query()
      .insert(data)
      .returning('*')
      .withGraphFetched('user');
  }

  async update(data: CommentUpdateDto): Promise<CommentModel> {
    return await this.commentModel
      .query()
      .update(data)
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
