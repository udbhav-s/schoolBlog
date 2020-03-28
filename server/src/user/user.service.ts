import { Injectable, Inject } from '@nestjs/common';
import { ModelClass } from 'objection';
import { UserModel } from '../database/models/user.model';

@Injectable()
export class UserService {
  constructor(
    @Inject('UserModel') private userModel: ModelClass<UserModel>
  ) {}

  getById(id: number) {
    return this.userModel.query().findById(id);
  }

  getByPortalId(id: string) {
    return this.userModel.query().where({ portalId: id }).first();
  }
}
