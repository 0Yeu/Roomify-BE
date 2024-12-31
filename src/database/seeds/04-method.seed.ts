import { Seeder, Factory } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { Method } from '../../entities/method.entity';
import Permissions from '../../constant/permissions-seed.constant';

export default class CreateMethods implements Seeder {

  public async run(factory: Factory, connection: Connection): Promise<any> {
    const permissions : Permissions = new Permissions();
    await connection
      .createQueryBuilder()
      .insert()
      .into(Method)
      .values(permissions.methods)
      .execute();
  }
}
