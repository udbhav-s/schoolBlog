import { Injectable, Inject } from '@nestjs/common';
import { ModelClass } from 'objection';
import { UserModel } from '../database/models/user.model';
import { GET_OPTIONS } from 'src/database/modifiers';
import { CreateProfileData } from 'src/auth/dto/createProfileData.dto';
import { UserGetOptionsDto } from './dto/userGetOptions.dto';

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

  async getAll(options?: UserGetOptionsDto): Promise<UserModel[]> {
    const query = this.userModel.query();
    if (options) {
      query.modify(GET_OPTIONS, options);
      if (options.minLevel) {
        query.where("level", ">=", options.minLevel);
      }
    }
    return await query;
  }

  async createFromProfileData(profile: CreateProfileData): Promise<UserModel> {
    return await this.userModel.query().insert({
      name: profile.name,
      email: profile.email,
      picture: profile.picture
    });
  }

  async updateProfile(profile: CreateProfileData): Promise<UserModel> {
    return await this.userModel.query()
      .where({ email: profile.email })
      .patch({
        name: profile.name,
        picture: profile.picture
      })
      .returning('*')
      .first();
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
