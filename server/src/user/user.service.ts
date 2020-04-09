import { Injectable, Inject } from '@nestjs/common';
import { ModelClass } from 'objection';
import { UserModel } from '../database/models/user.model';
import { GetOptionsDto } from 'src/common/dto/getOptions.dto';
import { GET_OPTIONS } from 'src/database/modifiers';

@Injectable()
export class UserService {
  constructor(@Inject('UserModel') private userModel: ModelClass<UserModel>) {}

  async getById(id: number): Promise<UserModel> {
    return await this.userModel.query().findById(id);
  }

  async getByPortalId(id: string): Promise<UserModel> {
    return await this.userModel
      .query()
      .where({ portalId: id })
      .first();
  }

  async getAll(options?: GetOptionsDto): Promise<UserModel[]> {
    let query = this.userModel.query();
    if (options) query.modify(GET_OPTIONS, options);
    return await query;
  }

  async createFromPortalUser(user: any): Promise<UserModel> {
    return await this.userModel.query().insert({
      name: user.name,
      type: user.type,
      level: user.level,
      portalId: user.id,
    });
  }

  async setLevel(id: number, level: number): Promise<UserModel> {
    return await this.userModel
      .query()
      .where({ id })
      .patch({ level })
      .returning('*')
      .first();
  }
}
