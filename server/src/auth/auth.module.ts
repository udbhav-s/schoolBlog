import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { SessionSerializer } from './session.serializer';
import { GoogleSamlStrategy } from './googleSaml.strategy';

@Module({
  imports: [UserModule, PassportModule],
  providers: [AuthService, LocalStrategy, GoogleSamlStrategy, SessionSerializer],
})
export class AuthModule {}
