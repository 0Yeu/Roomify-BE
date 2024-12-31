import { Seeder, Factory } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { User } from '../../entities/user.entity';

export default class CreateOwnerRegistration implements Seeder {
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
      .into('owner_registration')
      .values({IDNumber: '123456789', nameOwner: users[i].fullName, householdRegistrationImgs: ['https://www.tienland.vn/media/ar/cach-xem-so-do.jpg'], user: users[i]})
      .execute();
    }
  }
}
