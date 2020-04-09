import { Injectable, Inject } from '@nestjs/common';
import { ModelClass } from 'objection';
import { CommentModel } from '../database/models/comment.model';
import { PostModel } from '../database/models/post.model';
import { CommentCreateDto } from './dto/commentCreate.dto';
import { GetOptionsDto } from 'src/common/dto/getOptions.dto';
import { GET_OPTIONS } from 'src/database/modifiers';

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

  // (no verified checks - route only for mods)
  async getAll(options?: GetOptionsDto): Promise<CommentModel[]> {
    const query = this.commentModel
      .query()
      .withGraphFetched('[user, post(title)]')
      .modifiers({
        title(builder) {
          builder.select('title');
        }
      });
    // add search options
    if (options) query.modify(GET_OPTIONS, options);
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
