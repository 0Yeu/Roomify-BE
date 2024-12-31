import { Bookings } from '@src/entities/bookings.entity';
import { Repository, EntityRepository, In } from 'typeorm';
@EntityRepository(Bookings)
export class BookingRepository extends Repository<Bookings> {
  getBookingWithRoom(roomIds: any, limit: number, offset: number) {
    return this.createQueryBuilder('bookings')
      .leftJoinAndSelect('bookings.user', 'user')
      .leftJoin('bookings.room', 'room')
      .where('room.id= :id', { id: In([]) })
      .take(limit)
      .skip(offset)
      .getMany();
  }

  getBookingWithUser(userId: any, limit: number, offset: number) {
    return this.createQueryBuilder('bookings')
      .where('bookings.userId= :userId', { userId })
      .leftJoinAndSelect('bookings.room', 'room')
      .leftJoin('room.property', 'property')
      .addSelect('property.title')
      .leftJoin('property.owner', 'owner')
      .addSelect(['owner.fullName', 'owner.username', 'owner.email', 'owner.phone', 'owner.avatar'])
      .take(limit)
      .skip(offset)
      .getManyAndCount();
  }

  getDistinctOwner() {
    return this.createQueryBuilder('bookings')
      .select('bookings')
      .distinctOn(['bookings.ownerId'])
      .leftJoinAndSelect('bookings.room', 'room')
      .leftJoinAndSelect('room.property', 'property')
      .leftJoin('property.owner', 'owner')
      .addSelect(['owner.fullName', 'owner.username', 'owner.email', 'owner.phone', 'owner.avatar'])
      .getMany();
  }
}
