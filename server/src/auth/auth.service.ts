import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { UserModel } from '../database/models/user.model';
import { CreateProfileData } from './dto/createProfileData.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
  ) {}

  async findOrCreateUser(profile: CreateProfileData): Promise<UserModel> {
    let user = await this.userService.getByEmail(profile.email);
  
    if (!user) user = await this.userService.createFromProfileData(profile);
    // Sync info
    else if (profile.name !== user.name || profile.picture !== user.picture) {
      user = await this.userService.updateProfile(profile);
    }

    return user;
  }
}
