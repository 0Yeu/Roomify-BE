import { UserPermission } from '@src/entities/user-permission.entity';
import { Repository, EntityRepository } from 'typeorm';
@EntityRepository(UserPermission)
export class UserPermissionRepository extends Repository<UserPermission> {
  async findOneById(id: number): Promise<UserPermission> {
    return this.findOne(id);
  }

}
