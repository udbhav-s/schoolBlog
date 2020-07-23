import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { CreateProfileData } from './dto/createProfileData.dto';
import { AuthService } from './auth.service';


@Injectable()
export class GoogleOAuthStrategy extends PassportStrategy(Strategy, 'google-oauth') {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
      callbackURL: '/api/user/oauth/google/callback',
      scope: ['email', 'profile'],
    });
  }

  async validate (accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    const { name, emails, photos } = profile;

    const profileData: CreateProfileData = {
      email: emails[0].value,
      name: name.givenName + (name.familyName ? (' ' + name.familyName) : ''),
      picture: photos[0].value
    }

    const user = await this.authService.findOrCreateUser(profileData);
    done(null, user);
  }

  // for passport.authenticate() params
  authorizationParams(options: any): any {
    return Object.assign(options, {
      hd: 'hpsbegumpet.org.in'
    });
  }
}