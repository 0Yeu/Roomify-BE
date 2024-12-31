import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { BaseService } from '@src/base.service';
import { UserPermission } from '@src/entities/user-permission.entity';
import { AddDeletePermissions } from '@src/models/user-permissions/permission.dto';
import { UserRepository } from '../user/user.repository';
import { UserPermissionRepository } from './user-permission.repository';

@Injectable()
export class UserPermissionService extends BaseService<UserPermission, UserPermissionRepository>{
  constructor(protected repository: UserPermissionRepository, private readonly userRepository: UserRepository) {
    super(repository);
  }

  async deleteMany(body: AddDeletePermissions): Promise<any> {
    const { permissionIds } = body;
    const { userId } = body;
    const temp = [];
    const queries = await this.userRepository.findOne({ where: { id: userId }, relations: ['userPermissions', 'roles', 'roles.permissions'] });
    if (queries === undefined) {
      throw new NotFoundException('User not found');
    }
    queries.roles.forEach(role => {
      permissionIds.forEach(permissionId => {
        let status = 0;
        queries.userPermissions.forEach(userPermission => {
          if (userPermission.permission.id === permissionId && userPermission.status === 'ADD') {
            this.repository.delete({ id: userPermission.id });
            status = 1;
          }
          if (userPermission.permission.id === permissionId && userPermission.status === 'DELETE') {
            throw new BadRequestException(`This user don't have permission with ${userPermission.permission.method.name} ${userPermission.permission.module.name}`);
          }
        });
        if (status === 0) {
          for (let i = 0; i < role.permissions.length; i += 1) {
            if (permissionId === role.permissions[i].id) {
              temp.push({ user: { id: userId }, permission: { id: permissionId }, status: 'DELETE' });
              break;
            }
            if (i === role.permissions.length - 1) {
              throw new BadRequestException(`This user don't have permission with id: ${permissionId}`);
            }
          }
        }
      });
    });
    if(temp.length > 0) await this.repository.save(temp);
  }

  async createBulk(body: AddDeletePermissions): Promise<UserPermission[]> {
    const { permissionIds } = body;
    const { userId } = body;
    const queries = await this.userRepository.findOne({ where: { id: userId }, relations: ['userPermissions', 'roles', 'roles.permissions'] });
    const temp = [];
    if (queries === undefined) {
      throw new NotFoundException('User not found');
    }
    queries.roles.map(role => {
      permissionIds.forEach(permissionId => {
        let status = 0;
        queries.userPermissions.forEach(userPermission => {
          if (userPermission.permission.id === permissionId && userPermission.status === 'DELETE') {
            this.repository.delete({ id: userPermission.id });
            status = 1;
          }
          if (userPermission.permission.id === permissionId && userPermission.status === 'ADD') {
            throw new BadRequestException(`Already existed permission with ${userPermission.permission.method.name} ${userPermission.permission.module.name}`);
          }
        });
        if (status === 0) {
          role.permissions.map(permission => {
            if (permissionId === permission.id) {
              throw new BadRequestException(`Already existed permission with ${permission.method.name} ${permission.module.name}`);
            }
          });
          temp.push({ user: { id: userId }, permission: { id: permissionId }, status: 'ADD' });
        }
      });
    });
    let result: UserPermission[];
    if (temp.length !== 0) {
      result = await this.repository.save(temp);
    }
    return result;
  }

}
