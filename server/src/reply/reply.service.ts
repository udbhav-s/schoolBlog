import { Injectable, Inject } from '@nestjs/common';
import { ModelClass } from 'objection';
import { ReplyModel } from '../database/models/reply.model';
import { ReplyCreateDto } from './dto/replyCreate.dto';
import { GET_OPTIONS } from 'src/database/modifiers';
import { ReplyGetOptionsDto } from './dto/replyGetOptions.dto';

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

  // (no verified checks - route only for mods)
  async getAll(options?: ReplyGetOptionsDto): Promise<ReplyModel[]> {
    const query = this.replyModel
      .query()
      .withGraphFetched('[user, comment.post(title)]')
      .modifiers({
        title(builder) {
          builder.select('title');
        },
      });
    // get replies by comment
    if (options.commentId) query.where({ commentId: options.commentId })
    // add search options
    if (options) query.modify(GET_OPTIONS, options);
    // default sort latest first
    else query.modify(GET_OPTIONS, {
      orderBy: 'createdAt',
      order: 'desc'
    });
    return await query;
  }

  async create(data: ReplyCreateDto): Promise<ReplyModel> {
    return await this.replyModel
      .query()
      .insert(data)
      .returning('*')
      .withGraphFetched('user');
  }

  async update(id: number, data: ReplyCreateDto): Promise<ReplyModel> {
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
