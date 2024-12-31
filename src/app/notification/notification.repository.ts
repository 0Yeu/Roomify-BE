import { Notification } from '@src/entities/notification.entity';
import { Repository, EntityRepository, EntitySchema } from 'typeorm';
@EntityRepository(Notification)
export class NotificationRepository extends Repository<Notification> {
  async findOneById(id: number): Promise<Notification> {
    return this.findOne(id);
  }

  async getMany(entity: EntitySchema) {
   
  }

}
