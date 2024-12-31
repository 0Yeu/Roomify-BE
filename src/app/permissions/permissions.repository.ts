import { Permission } from '@src/entities/permission.entity';
import { Repository, EntityRepository } from 'typeorm';
@EntityRepository(Permission)
export class PermissionRepository extends Repository<Permission> {
  async findOneById(id: number): Promise<Permission> {
    return this.findOne(id);
  }

}
