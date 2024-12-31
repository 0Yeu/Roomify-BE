import { Seeder, Factory } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { Module } from '../../entities/module.entity';
import Permissions from '../../constant/permissions-seed.constant';

export default class CreateModules implements Seeder {

  public async run(factory: Factory, connection: Connection): Promise<any> {
    const permissions : Permissions = new Permissions();
    await connection
      .createQueryBuilder()
      .insert()
      .into(Module)
      .values(permissions.modules)
      .execute();
  }
}
