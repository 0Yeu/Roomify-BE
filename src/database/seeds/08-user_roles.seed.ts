import { Seeder, Factory } from 'typeorm-seeding';
import { Connection } from 'typeorm';

export default class CreateUserRoles implements Seeder {
  public async run(factory: Factory, connection: Connection) {
    const userRoles = [
      { usersId: 1, rolesId: 1 },
      { usersId: 2, rolesId: 2 },
      { usersId: 3, rolesId: 3 },
      { usersId: 4, rolesId: 4 },
    ];

    await connection
      .createQueryBuilder()
      .insert()
      .into('user_role')
      .values(userRoles)
      .execute();
  }
  
}
