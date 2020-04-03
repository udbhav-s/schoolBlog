import { Injectable, Inject } from '@nestjs/common';
import { ModelClass } from 'objection';
import { ReplyModel } from '../database/models/reply.model';
import { ReplyCreateDto, ReplyUpdateDto } from './dto/replyCreate.dto';

@Injectable()
export class ReplyService {
  constructor(
    @Inject('ReplyModel') private replyModel: ModelClass<ReplyModel>,
  ) {}

  async getById(id: number): Promise<ReplyModel> {
    return await this.replyModel
      .query()
      .findById(id)
      .withGraphFetched('user');
  }

  async getByUser(userId: number, verified: boolean): Promise<ReplyModel[]> {
    // get reply
    const query = this.replyModel
      .query()
      .where({ userId })
      .withGraphFetched('user');
    // get replies on verified posts
    if (verified) {
      query.joinRelated('[comment, comment.post]').where('post.verified', true);
    }
    // return result
    return await query;
  }

  async getByComment(commentId: number): Promise<ReplyModel[]> {
    return await this.replyModel
      .query()
      .where({ commentId })
      .withGraphFetched('user');
  }

  async create(data: ReplyCreateDto): Promise<ReplyModel> {
    return await this.replyModel
      .query()
      .insert(data)
      .returning('*')
      .withGraphFetched('user');
  }

  async update(id: number, data: ReplyUpdateDto): Promise<ReplyModel> {
    return await this.replyModel
      .query()
      .where({ id })
      .patch(data)
      .returning('*')
      .first()
      .withGraphFetched('user');
  }

  async del(id: number): Promise<ReplyModel> {
    return await this.replyModel
      .query()
      .where({ id })
      .del()
      .returning('*')
      .first();
  }
}
