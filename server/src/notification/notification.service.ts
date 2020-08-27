import { Injectable, Inject } from '@nestjs/common';
import { ModelClass } from 'objection';
import { NotificationModel } from 'src/database/models/notification.model';
import { NotificationCreateDto } from './dto/notificationCreate.dto';

@Injectable()
export class NotificationService {
  constructor(
    @Inject('NotificationModel') private notificationModel: ModelClass<NotificationModel>
  ) {}

  async getByRecipient(recipientId: number): Promise<NotificationModel[]> {
    return await this.notificationModel
      .query()
      .where({ recipientId })
      .withGraphFetched('[sender]');
  }

  async send(body: NotificationCreateDto): Promise<NotificationModel> {
    return this.notificationModel.query().insert({
      ...body
    });
  }

  async del(id: number, recipientId?: number): Promise<NotificationModel> {
    const query = this.notificationModel
      .query()
      .where({ id })
      .del()
      .returning('*')
      .first();

    if (recipientId !== undefined) query.where({ recipientId });

    return await query;
  }

  async deleteAllForRecipient(recipientId: number) {
    return await this.notificationModel
      .query()
      .where({ recipientId })
      .del();
  }
}
