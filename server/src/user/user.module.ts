import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PortalService } from './portal.mock.service';

@Module({
  providers: [UserService, PortalService],
  controllers: [UserController],
  exports: [UserService, PortalService]
})
export class UserModule {}
