import { Seeder, Factory } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { Role } from '../../entities/roles.entity';
import Permissions from '../../constant/permissions-seed.constant';

export default class CreateRoles implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const permission : Permissions = new Permissions();
    await connection
      .createQueryBuilder()
      .insert()
      .into(Role)
      .values(permission.roles)
      .execute();
  }
}
