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
        // entryPoint: 'https://accounts.google.com/o/saml2/idp?idpid=', // SSO URL (Step 2)
        entryPoint: 'https://samltest.id/idp/profile/SAML2/Redirect/SSO',
        issuer: 'test-saml', // Entity ID (Step 4)
        path: '/api/user/google/callback', // ACS URL path (Step 4),
        cert: `MIIDEjCCAfqgAwIBAgIVAMECQ1tjghafm5OxWDh9hwZfxthWMA0GCSqGSIb3DQEB
        CwUAMBYxFDASBgNVBAMMC3NhbWx0ZXN0LmlkMB4XDTE4MDgyNDIxMTQwOVoXDTM4
        MDgyNDIxMTQwOVowFjEUMBIGA1UEAwwLc2FtbHRlc3QuaWQwggEiMA0GCSqGSIb3
        DQEBAQUAA4IBDwAwggEKAoIBAQC0Z4QX1NFKs71ufbQwoQoW7qkNAJRIANGA4iM0
        ThYghul3pC+FwrGv37aTxWXfA1UG9njKbbDreiDAZKngCgyjxj0uJ4lArgkr4AOE
        jj5zXA81uGHARfUBctvQcsZpBIxDOvUUImAl+3NqLgMGF2fktxMG7kX3GEVNc1kl
        bN3dfYsaw5dUrw25DheL9np7G/+28GwHPvLb4aptOiONbCaVvh9UMHEA9F7c0zfF
        /cL5fOpdVa54wTI0u12CsFKt78h6lEGG5jUs/qX9clZncJM7EFkN3imPPy+0HC8n
        spXiH/MZW8o2cqWRkrw3MzBZW3Ojk5nQj40V6NUbjb7kfejzAgMBAAGjVzBVMB0G
        A1UdDgQWBBQT6Y9J3Tw/hOGc8PNV7JEE4k2ZNTA0BgNVHREELTArggtzYW1sdGVz
        dC5pZIYcaHR0cHM6Ly9zYW1sdGVzdC5pZC9zYW1sL2lkcDANBgkqhkiG9w0BAQsF
        AAOCAQEASk3guKfTkVhEaIVvxEPNR2w3vWt3fwmwJCccW98XXLWgNbu3YaMb2RSn
        7Th4p3h+mfyk2don6au7Uyzc1Jd39RNv80TG5iQoxfCgphy1FYmmdaSfO8wvDtHT
        TNiLArAxOYtzfYbzb5QrNNH/gQEN8RJaEf/g/1GTw9x/103dSMK0RXtl+fRs2nbl
        D1JJKSQ3AdhxK/weP3aUPtLxVVJ9wMOQOfcy02l+hHMb6uAjsPOpOVKqi3M8XmcU
        ZOpx4swtgGdeoSpeRyrtMvRwdcciNBp9UZome44qZAYH1iqrpmmjsfI9pJItsgWu
        3kXPjhSfj1AJGR1l9JGvJrHki1iHTA==`
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