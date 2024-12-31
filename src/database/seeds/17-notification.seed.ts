import { Seeder, Factory } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import Faker from 'faker';
import { Notification } from '../../entities/notification.entity';
import { NotificationMessageEnum } from '../../common/enums/notification.enum';

export default class CreateNotificationProperty implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await factory(Notification)({
      title: NotificationMessageEnum.Title_Booking,
      description: `User with phone: ${Faker.phone.phoneNumber()} booked your room !!! Please contact with him/her`,
      userId: 3
    }).createMany(20);
    await factory(Notification)({
      userId: 3,
      title: NotificationMessageEnum.Title_Owner_Upgrade,
      description: NotificationMessageEnum.Description_Owner_Upgrade
    }).createMany(20);
  }
}
