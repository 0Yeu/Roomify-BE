import { User } from '@src/entities/user.entity';
import { Repository, EntityRepository, getRepository, EntitySchema } from 'typeorm';
@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async findOneById(id: number): Promise<User> {
    return this.findOne(id);
  }

  async getMany(entity: EntitySchema) {
   
  }

}
