import { Seeder, Factory } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import Faker from 'faker';
import { User } from '../../entities/user.entity';

export default class CreateBookings implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const users = await connection
      .getRepository(User)
      .createQueryBuilder('user')
      .leftJoin('user.roles', 'roles')
      .where('roles.id = :id', { id: 4 })
      .getMany();
    let roomId;
    for (let i = 0; i < users.length; i += 1) {
      roomId = Faker.random.number({ min: 1, max: 100 });
      await connection
        .createQueryBuilder()
        .insert()
        .into('bookings')
        .values({ user: users[i], roomId, ownerId: roomId })
        .execute();
    }
  }
}
