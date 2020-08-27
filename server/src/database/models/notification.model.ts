import { BaseModel } from './base.model';
import { Model } from 'objection';
import { UserModel } from './user.model';

export class NotificationModel extends BaseModel {
  static tableName = 'notifications';

  recipientId: number;
  senderId?: number;
  action: 'comment' | 'reply';
  objectId?: number;

  recipient?: UserModel;
  sender?: UserModel;

  static modifiers = {
    ...BaseModel.modifiers,
  };

  static relationMappings = () => ({
    recipient: {
      modelClass: UserModel,
      relation: Model.HasOneRelation,
      join: {
        from: 'notifications.recipientId',
        to: 'users.id',
      },
    },

    sender: {
      modelClass: UserModel,
      relation: Model.HasOneRelation,
      join: {
        from: 'notifications.senderId',
        to: 'users.id',
      },
    },
  });
}
