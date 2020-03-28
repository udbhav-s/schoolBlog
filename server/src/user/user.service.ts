import { Injectable, Inject } from '@nestjs/common';
import { ModelClass } from 'objection';
import { UserModel } from '../database/models/user.model';

@Injectable()
export class UserService {
  constructor(
    @Inject('UserModel') private userModel: ModelClass<UserModel>
  ) {}

  async getById(id: number): Promise<UserModel> {
    return await this.userModel.query().findById(id);
  }

  async getByPortalId(id: string): Promise<UserModel> {
    return await this.userModel.query().where({ portalId: id }).first();
  }

  async createFromPortalUser(user: any): Promise<UserModel> {
    return await this.userModel
      .query()
      .insert({
        name: user.name,
        type: user.type,
        level: user.level,
        portalId: user.id
      });
  }
}
