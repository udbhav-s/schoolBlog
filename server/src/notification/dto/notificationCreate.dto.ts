export class NotificationCreateDto {
  recipientId: number;
  senderId?: number;
  action: 'comment' | 'reply';
  objectId?: number;
};
