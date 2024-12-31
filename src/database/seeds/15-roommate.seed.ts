import { Seeder, Factory } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import Faker from 'faker';
import { User } from '../../entities/user.entity';

export default class CreateRoomates implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const users = await connection
      .getRepository(User)
      .createQueryBuilder('user')
      .leftJoin('user.roles', 'roles')
      .where('roles.id = :id', { id: 4 })
      .getMany();

    for (let i = 0; i < users.length; i += 1) {
      await connection
        .createQueryBuilder()
        .insert()
        .into('roommate')
        .values({ user: users[i], price: Faker.commerce.price(1000, 999999), phone: '0981234899', description: Faker.lorem.sentences(5), destinationId: Faker.random.number({min: 100, max: 510}) })
        .execute();
    }
  }
}
