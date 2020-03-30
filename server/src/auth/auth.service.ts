import { Injectable } from '@nestjs/common';
import { PortalService } from '../user/portal.mock.service';
import { UserService } from '../user/user.service';
import { UserModel } from '../database/models/user.model';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly portalService: PortalService,
  ) {}

  async validateUser(
    portal: string,
    password: string,
  ): Promise<UserModel | null> {
    const validated = await this.portalService.validate(portal, password);
    if (validated) {
      let user = await this.userService.getByPortalId(portal);
      if (!user) {
        const portalUser = await this.portalService.getById(portal);
        user = await this.userService.createFromPortalUser(portalUser);
      }
      return user;
    }
    return null;
  }
}
