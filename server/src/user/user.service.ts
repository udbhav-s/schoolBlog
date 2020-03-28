import { Injectable } from '@nestjs/common';
import { User } from './user.interface';

@Injectable()
export class UserService {
  get(): User {
    return {
      id: 1,
      name: "Hasanuddin",
      portal_id: "st9999",
      type: "student",
      level: 4
    };
  }
}
