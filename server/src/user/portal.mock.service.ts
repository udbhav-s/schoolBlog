import { Injectable } from '@nestjs/common';

@Injectable()
export class PortalService {
  private readonly users: any[];

  constructor() {
    this.users = [
      {
        id: 'st9999',
        name: 'Example Admin Account',
        type: 'student',
        password: '1234',
      },
      {
        id: 'st1234',
        name: 'Tom Hanks',
        type: 'student',
        password: '1234',
      },
      {
        id: 'st5678',
        name: 'Christian Bale',
        type: 'student',
        password: '1234',
      },
      {
        id: 'sen1234',
        name: 'Heath Ledger',
        type: 'teacher',
        password: '1234',
      },
      {
        id: 'sen5678',
        name: 'Will Smith',
        type: 'teacher',
        password: '1234'
      }
    ];
  }

  async getById(id: string): Promise<any> {
    return Promise.resolve().then(() => {
      const user = this.users.find(user => user.id === id);
      if (user) {
        if (user.type === 'teacher') user.level = 2;
        else if (user.type === 'student') user.level = 1;
        return user;
      }
      return null;
    });
  }

  async validate(portalId: string, password: string): Promise<boolean> {
    const user = await this.getById(portalId);
    return user && user.password === password;
  }
}
