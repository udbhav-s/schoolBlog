import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { SessionSerializer } from './session.serializer';
// import { GoogleSamlStrategy } from './googleSaml.strategy';
import { GoogleOAuthStrategy } from './googleOAuth.strategy';

@Module({
  imports: [UserModule, PassportModule],
  providers: [AuthService, /* GoogleSamlStrategy, */ GoogleOAuthStrategy, SessionSerializer],
})
export class AuthModule {}
