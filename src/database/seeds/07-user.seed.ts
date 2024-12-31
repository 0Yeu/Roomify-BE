import { Seeder, Factory } from 'typeorm-seeding';
import { Connection, QueryBuilder } from 'typeorm';
import { User } from '../../entities/user.entity';
import Bcrypt from '../../plugins/bcrypt.plugin';

export default class CreateUsers implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const hashPwd: string = await Bcrypt.hash('123456');
    const admin = {
      fullName: 'Admin',
      username: 'admin',
      email: 'admin@gmail.com',
      password: hashPwd,
      phone: '0981234899',
      avatar:
        'https://cdn1.iconfinder.com/data/icons/ui-icon-part-2/128/user-512.png',
      status: 'ACTIVE'
    };
    const moderator = {
      fullName: 'Moderator',
      username: 'moderator',
      email: 'moderator@gmail.com',
      password: hashPwd,
      phone: '0981234888',
      avatar:
        'https://cdn1.iconfinder.com/data/icons/ui-icon-part-2/128/user-512.png',
      status: 'ACTIVE'
    };
    const owner = {
      fullName: 'Owner',
      username: 'owner',
      email: 'owner@gmail.com',
      password: hashPwd,
      phone: '0981234777',
      avatar:
        'https://cdn1.iconfinder.com/data/icons/ui-icon-part-2/128/user-512.png',
      status: 'ACTIVE'
    };
    const user = {
      fullName: 'User',
      username: 'user',
      email: 'user@gmail.com',
      password: hashPwd,
      phone: '0981234789',
      avatar:
        'https://cdn1.iconfinder.com/data/icons/ui-icon-part-2/128/user-512.png',
      status: 'ACTIVE'
    };
    await connection
      .createQueryBuilder()
      .insert()
      .into(User)
      .values([admin, moderator, owner, user])
      .execute();

    await factory(User)().createMany(100);
  }
}
