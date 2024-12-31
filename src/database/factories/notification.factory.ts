/* eslint-disable @typescript-eslint/no-unused-vars */
import Faker from 'faker';
import { define } from 'typeorm-seeding';
import { enumToArray } from '../../utils/helper';
import { User } from '../../entities/user.entity';
import { UserStatus } from '../../common/enums/userStatus.enum';
import { Role } from '../../entities/roles.entity';
import { Notification } from '../../entities/notification.entity';

define(Notification, (
  faker: typeof Faker,
  context: { title: string; description: string; userId?: number }
) => {
  const notification = new Notification();
  notification.title = context.title;
  notification.description = context.description;
  notification.userId = context.userId ? context.userId : 3;
  return notification;
});
