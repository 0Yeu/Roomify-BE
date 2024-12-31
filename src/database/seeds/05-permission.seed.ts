import { Seeder, Factory } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { Permission } from '../../entities/permission.entity';
import Permissions from '../../constant/permissions-seed.constant';

export default class CreatePermissions implements Seeder {

  public async run(factory: Factory, connection: Connection): Promise<any> {
    const permission: Permissions = new Permissions();
    const permissions = [];
    for (let i = 1; i <= permission.modules.length; i += 1) {
      for (let j = 1; j <= permission.methods.length; j += 1) {
        permissions.push({ moduleId: i, methodId: j });
      }
    }
    await connection
      .createQueryBuilder()
      .insert()
      .into(Permission)
      .values(permissions)
      .execute();
  }
}
