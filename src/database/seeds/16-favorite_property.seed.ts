import { Seeder, Factory } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import Faker from 'faker';

export default class CreateFavoriteProperty implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const value = [];
    for (let i = 0; i < 15; i += 1) {
      for (let j = 0; j < 10; j += 1) {
        value.push({ userId: i + 1, propertyId: Faker.random.number({ min: 1, max: 1100 }) });
      }
    }

    await connection
      .createQueryBuilder()
      .insert()
      .into('favorite_property')
      .values(value)
      .execute();
  }
}
