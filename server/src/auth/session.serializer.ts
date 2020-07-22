// import { PassportSerializer } from '@nestjs/passport';
// import { Injectable } from '@nestjs/common';

// @Injectable()
// export class SessionSerializer extends PassportSerializer {
//   serializeUser(user: any, done: (err: Error, user: any) => void): any {
//     done(null, user);
//   }
//   deserializeUser(
//     payload: any,
//     done: (err: Error, payload: string) => void,
//   ): any {
//     done(null, payload);
//   }
// }

import { PassportSerializer } from '@nestjs/passport';
import { Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(
    private userService: UserService
  ) {
    super();
  }

  serializeUser(user: any, done: CallableFunction): any {
    done(null, user.id);
  }

  async deserializeUser(
    userId: string,
    done: CallableFunction,
  ) {
    try {
      const user = await this.userService.getById(parseInt(userId));
      if (!user) done(new NotFoundException(), null);
      else done(null, user);
    }
    catch (err) {
      done(err);
    }
  }
}
