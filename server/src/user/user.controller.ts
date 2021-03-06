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
  Request,
  UseInterceptors,
  Query,
  Res,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserModel } from '../database/models/user.model';
import { AuthenticatedGuard } from '../common/guards/authenticated.guard';
import { FormatResponseInterceptor } from '../common/interceptors/formatResponse.interceptor';

import { ApiTags, ApiOperation, ApiBasicAuth } from '@nestjs/swagger';
import { LevelGuard } from 'src/common/guards/level.guard';
import { Level } from 'src/common/decorators/level.decorator';
import { Levels } from 'src/common/util/level.enum';
// import { GoogleSamlGuard } from 'src/common/guards/saml.guard';
import { GoogleOAuthGuard } from 'src/common/guards/oauth.guard';
import { UserGetOptionsDto } from './dto/userGetOptions.dto';

@ApiTags('user')
@UseInterceptors(FormatResponseInterceptor)
@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // SAML LOGIN

  // @UseGuards(GoogleSamlGuard)
  // @Get('/saml/google')
  // // eslint-disable-next-line @typescript-eslint/no-empty-function
  // googleSamlLogin(): void {}

  // @ApiOperation({ summary: 'Callback for Gsuite initiated SAML login' })
  // @UseGuards(GoogleSamlGuard)
  // @Post("/saml/google/callback")
  // googleSamlCallback(@Res() res) {
  //   res.redirect("/")
  // }

  // OAUTH LOGIN

  @UseGuards(GoogleOAuthGuard)
  @Get('/oauth/google')
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  googleOauthLogin(): void {}

  @ApiOperation({ summary: 'Callback for Google OAuth login' })
  @UseGuards(GoogleOAuthGuard)
  @Get("/oauth/google/callback")
  googleOauthCallback(@Res() res) {
    res.redirect("/")
  }

  @ApiOperation({ summary: 'Get the current logged in user' })
  @ApiBasicAuth()
  @UseGuards(AuthenticatedGuard)
  @Get('/current')
  async getCurrent(@Request() req): Promise<UserModel> {
    return await this.userService.getById(req.user.id);
  }

  @ApiOperation({ summary: 'Get a user by email' })
  @ApiBasicAuth()
  @UseGuards(AuthenticatedGuard)
  @Get('email/:id')
  async getByEmail(@Param('id', ParseIntPipe) email: string): Promise<UserModel> {
    return await this.userService.getByEmail(email);
  }

  @ApiOperation({ summary: 'Get all users' })
  @ApiBasicAuth()
  @UseGuards(AuthenticatedGuard)
  @Get('/all')
  async getAll(
    @Query(new ValidationPipe({ transform: true })) options: UserGetOptionsDto
  ): Promise<UserModel[]> {
    return await this.userService.getAll(options);
  }

  @ApiOperation({ summary: 'Log out' })
  @ApiBasicAuth()
  @UseGuards(AuthenticatedGuard)
  @Get('/logout')
  logout(@Request() req) {
    req.logout();
  }

  @ApiOperation({ summary: 'Get user by id' })
  @ApiBasicAuth()
  @UseGuards(AuthenticatedGuard)
  @UsePipes(ParseIntPipe)
  @Get(':id')
  getById(@Param('id') id: number): Promise<UserModel> {
    return this.userService.getById(id);
  }

  @ApiOperation({ summary: 'Set user level (for admins)' })
  @ApiBasicAuth()
  @UseGuards(AuthenticatedGuard, LevelGuard)
  @Level(Levels.Admin)
  @UsePipes(ParseIntPipe)
  @Post('/level/:id')
  async setLevel(
    @Param('id') id: number,
    @Body('level') level: number,
  ): Promise<UserModel> {
    // get user 
    const user = await this.userService.getById(id);
    if (!user) throw new NotFoundException();
    // admins are set manually from the db so 4 is excluded
    if (user.level === Levels.Admin) throw new UnauthorizedException("Cannot change level of admin");
    if (level >= Levels.Admin || level < Levels.Reader) throw new BadRequestException("Invalid level");
    return this.userService.setLevel(id, level);
  }
}
