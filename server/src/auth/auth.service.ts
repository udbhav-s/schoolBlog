import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { UserModel } from '../database/models/user.model';
import { GoogleSamlProfile } from './dto/googleSamlProfile.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
  ) {}

  async findOrCreateUser(profile: GoogleSamlProfile): Promise<UserModel> {
    let user = await this.userService.getByEmail(profile.email);
    if (!user) user = await this.userService.createFromGoogleSaml(profile);
    return user;
  }
}
