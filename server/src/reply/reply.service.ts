import { Injectable, Inject } from '@nestjs/common';
import { ModelClass } from 'objection';
import { ReplyModel } from '../database/models/reply.model';
import { ReplyCreateDto } from './dto/replyCreate.dto';
import { GetOptionsDto } from 'src/common/dto/getOptions.dto';
import { GET_OPTIONS } from 'src/database/modifiers';

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
  async getAll(options?: GetOptionsDto): Promise<ReplyModel[]> {
    const query = this.replyModel
      .query()
      .withGraphFetched('[user, comment.post(title)]')
      .modifiers({
        title(builder) {
          builder.select('title');
        },
      });
    // add search options
    if (options) query.modify(GET_OPTIONS, options);
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
