import { Injectable, Inject } from '@nestjs/common';
import { ModelClass } from 'objection';
import { UserModel } from '../database/models/user.model';
import { GetOptionsDto } from 'src/common/dto/getOptions.dto';
import { GET_OPTIONS } from 'src/database/modifiers';
import { GoogleSamlProfile } from 'src/auth/dto/googleSamlProfile.dto';

@Injectable()
export class UserService {
  constructor(@Inject('UserModel') private userModel: ModelClass<UserModel>) {}

  async getById(id: number): Promise<UserModel> {
    return await this.userModel.query().findById(id);
  }

  async getByEmail(email: string): Promise<UserModel> {
    return await this.userModel
      .query()
      .where({ email })
      .first();
  }

  async getAll(options?: GetOptionsDto): Promise<UserModel[]> {
    const query = this.userModel.query();
    if (options) query.modify(GET_OPTIONS, options);
    return await query;
  }

  async createFromGoogleSaml(profile: GoogleSamlProfile): Promise<UserModel> {
    return await this.userModel.query().insert({
      name: profile['urn:oid:2.16.840.1.113730.3.1.241'],
      email: profile.email,
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
