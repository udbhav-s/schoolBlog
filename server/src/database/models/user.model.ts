import { BaseModel } from './base.model';

export class UserModel extends BaseModel {
  static tableName = 'users';

  name: string;
  portalId: string;
  level: number;
  type: string;
}
