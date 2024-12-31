import { Injectable } from '@nestjs/common';
import { BaseService } from '@src/base.service';
import { NotificationMessageEnum } from '@src/common/enums/notification.enum';
import { Notification } from '@src/entities/notification.entity';
import { GetMany } from '@src/models/base/getMany.dto';
import { IResponseFormat } from '@src/models/base/response.interface';
import { format } from '@src/utils/format-response-get-many';
import admin from 'firebase-admin';
import { NotificationRepository } from './notification.repository';

@Injectable()
export class NotificationService extends BaseService<Notification, NotificationRepository> {
  constructor(protected readonly repository: NotificationRepository) {
    super(repository);
  }

  async getNotificationOfMe(
    userId: number,
    query: GetMany
  ): Promise<IResponseFormat<Notification>> {
    const temp = await this.getManyData(query, [], { userId }, true, {
      order: {
        createdAt: 'DESC'
      }
    });
    return temp;
  }

  async sendTestToDevice(registrationToken) {
    if (registrationToken) {
      admin.messaging().sendToDevice(registrationToken, {
        notification: {
          title: 'This is a title notification test from Roomify API',
          body: 'This is a title notification test from Roomify API'
        }
      });
      return 'SUCCESS';
    }
    return 'FAILURE';

  }
}
