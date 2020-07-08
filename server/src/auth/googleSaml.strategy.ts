import { Strategy } from 'passport-saml';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleSamlProfile } from './dto/googleSamlProfile.dto';

@Injectable()
export class GoogleSamlStrategy extends PassportStrategy(Strategy, "google-saml") {
  constructor(private readonly authService: AuthService) {
    super({
        // protocol: 'https://',
        entryPoint: 'https://accounts.google.com/o/saml2/idp?idpid=', // SSO URL (Step 2)
        issuer: 'test-saml', // Entity ID (Step 4)
        path: '/api/user/google/callback' // ACS URL path (Step 4)
      });
  }

  async validate(profile: GoogleSamlProfile, done: Function) {
    if (!profile) {
      done(new BadRequestException());
    }
    console.log("CALLBACK IN SAMLSTRATEGY");
    console.log("PROFILE: ");
    console.log(profile);
    
    const user = await this.authService.findOrCreateUser(profile);
    done(null, user);
  }
}