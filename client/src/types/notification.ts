import { User } from './user';

export interface AppNotification {
  id: number;
  recipientId: number;
  senderId?: number;
  action: 'comment' | 'reply';
  objectId?: number;

  sender: User;
}