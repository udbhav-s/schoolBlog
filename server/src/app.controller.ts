import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { LoginGuard } from './common/guards/login.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(LoginGuard)
  @Post('/login')
  login(@Request() req): number {
    return req.user.id;
  }
}
