import { Injectable } from '@nestjs/common';

@Injectable()
export class PortalService {
  private readonly users: any[];

  constructor() {
    this.users = [
      {
        id: 'st9999',
        name: 'Hasan Uddin',
        type: 'student',
        password: '1234',
      },
      {
        id: 'sen0313',
        name: 'Michael Jackson',
        type: 'teacher',
        password: '5678',
      },
      {
        id: 'st1234',
        name: 'Barack Obama',
        type: 'student',
        password: 'USA',
      },
      {
        id: 'sen1234',
        name: 'Christian Bale',
        type: 'teacher',
        password: 'imbatman',
      }
    ]
  }

  async getById(id: string): Promise<any> {
    return Promise.resolve()
    .then(() => {
      let user = this.users.find((user) => user.id === id);
      if (user) return user;
      return null;
    });
  }

  async validate(portalId: string, password: string): Promise<boolean> {
    let user = await this.getById(portalId);
    return (user && user.password === password);
  }
}
