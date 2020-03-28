import { 
  Controller,
  Get,
  Post,
  UseGuards, 
  Param, 
  UsePipes, 
  ParseIntPipe, 
  ValidationPipe, 
  Body, 
  Request } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UserModel } from '../database/models/user.model';
import { LoginGuard } from '../common/guards/login.guard';
import { AuthenticatedGuard } from '../common/guards/authenticated.guard';
import { LoginDto } from './dto/login.dto';

@ApiTags("user")
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UsePipes(new ValidationPipe())
  @UseGuards(LoginGuard)
  @Post('/login')
  login(@Body() body: LoginDto, @Request() req): number {
    return req.user.id;
  }

  @UseGuards(AuthenticatedGuard)
  @Get("/current")
  async getCurrent(@Request() req): Promise<UserModel> {
    return await this.userService.getById(req.user.id);
  }

  @UseGuards(AuthenticatedGuard)
  @UsePipes(ParseIntPipe)
  @Get("portal/:id")
  async getByPortal(@Param('id') id: string): Promise<UserModel> {
    return await this.userService.getByPortalId(id);
  }

  @UseGuards(AuthenticatedGuard)
  @UsePipes(ParseIntPipe)
  @Get(':id')
  getById(@Param('id') id: number): Promise<UserModel> {
    return this.userService.getById(id);
  }
}
