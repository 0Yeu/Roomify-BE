/* eslint-disable @typescript-eslint/no-unused-vars */
import Faker from 'faker';
import { define } from 'typeorm-seeding';
import { enumToArray } from '../../utils/helper';
import { User } from '../../entities/user.entity';
import { UserStatus } from '../../common/enums/userStatus.enum';
import { Role } from '../../entities/roles.entity';

define(User, (faker: typeof Faker, context: { roles: string[] }) => {
  const fullName = faker.name.findName();
  const username = faker.internet.userName();
  const email = faker.internet.email(username);
  const password = faker.internet.password();
  const phoneNumber = faker.phone.phoneNumber();
  const avatar = 'https://cdn1.iconfinder.com/data/icons/ui-icon-part-2/128/user-512.png';
  const status = faker.random.arrayElement(enumToArray(UserStatus));
  const role = new Role();
  role.id = faker.random.number({ min: 2, max: 4 });
  const user = new User();
  user.fullName = fullName;
  user.username = username;
  user.email = email;
  user.password = password;
  user.phone = phoneNumber;
  user.avatar = avatar;
  user.status = status;
  user.roles = [role];

  return user;
});
