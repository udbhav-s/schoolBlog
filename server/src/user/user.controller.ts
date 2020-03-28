import { Controller, Get, Param, UsePipes, ParseIntPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { UserModel } from '../database/models/user.model';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("portal/:id")
  async getByPortal(@Param('id') id: string): Promise<UserModel> {
    return await this.userService.getByPortalId(id);
  }

  @UsePipes(ParseIntPipe)
  @Get(':id')
  getById(@Param('id') id: number): Promise<UserModel> {
    return this.userService.getById(id);
  }
}
