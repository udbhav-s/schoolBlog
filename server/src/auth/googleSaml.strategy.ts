import { Strategy, VerifyCallback } from 'passport-saml';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateProfileData } from './dto/createProfileData.dto';

@Injectable()
export class GoogleSamlStrategy extends PassportStrategy(Strategy, "google-saml") {
  constructor(private readonly authService: AuthService) {
    super({
        entryPoint: process.env.GOOGLE_SAML_ENTRY_POINT,
        issuer: process.env.GOOGLE_SAML_ENTITY_ID, // Entity ID (Step 4)
        path: '/api/user/saml/google/callback', // ACS URL path (Step 4),
        cert: process.env.GOOGLE_SAML_CERTIFICATE // certificate
      });
  }

  async validate(profile: any, done: VerifyCallback) {
    if (!profile) {
      done(new BadRequestException());
    }
    const profileData: CreateProfileData = {
      name: profile.nameId,
      email: profile.email,
      picture: profile.picture
    };
    
    const user = await this.authService.findOrCreateUser(profileData);
    done(null, user);
  }
}