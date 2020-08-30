import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { UserModel } from '../database/models/user.model';
import { CreateProfileData } from './dto/createProfileData.dto';
import { Levels } from 'src/common/util/level.enum';

import * as fs from 'fs';

let whitelist: string[];
if (process.env.WHITELIST_PATH) {
  whitelist = JSON.parse(fs.readFileSync(process.env.WHITELIST_PATH, 'utf8')).whitelist;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
  ) {}

  async findOrCreateUser(profile: CreateProfileData): Promise<UserModel> {
    if (whitelist && !whitelist.includes(profile.email)) {
      throw new Error("User not whitelisted");
    }

    let user = await this.userService.getByEmail(profile.email);
  
    if (!user) {
      if ((await this.userService.getCount()) === 0) {
        profile.level = Levels.Admin;
      }
      user = await this.userService.createFromProfileData(profile);
    }
    // Sync info
    else if (profile.name !== user.name || profile.picture !== user.picture) {
      user = await this.userService.updateProfile(profile);
    }

    return user;
  }
}
