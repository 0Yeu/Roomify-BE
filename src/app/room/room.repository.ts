import { Room } from '@src/entities/room.entity';
import { Repository, EntityRepository } from 'typeorm';
@EntityRepository(Room)
export class RoomRepository extends Repository<Room> {
  async findOneById(id: number): Promise<Room> {
    return this.findOne(id);
  }

  findRoomWithOwner(ownerId: number): Promise<any> {
    return this.createQueryBuilder('room')
      .leftJoin('room.property', 'property')
      .leftJoin('property.owner', 'owner')
      .where('owner.id= :id', { id: ownerId })
      .getMany();
  }
}
