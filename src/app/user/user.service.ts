import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Inject,
  forwardRef
} from '@nestjs/common';
import { UpdateMyUserDto } from '@src/models/users/update-my-user.dto';
import { BaseService } from '@src/base.service';
import { UserRequestDto } from '@src/models/users/user-request.dto';
import { UpdateMyPasswordDto } from '@src/models/users/update-my-password.dto';
import { GetMany } from '@src/models/base/getMany.dto';
import { Permission } from '@src/entities/permission.entity';
import { createQueryBuilder, getManager, getRepository } from 'typeorm';
import Permissions from '@src/constant/permissions-seed.constant';
import { Role } from '@src/entities/roles.entity';
import { UserPermission } from '@src/entities/user-permission.entity';
import { AddDeletePermissions } from '@src/models/user-permissions/permission.dto';
import { CreateUserDTO } from '@src/models/users/create.dto';
import Bcrypt from '../../plugins/bcrypt.plugin';
import { UserRepository } from './user.repository';
import { User } from '../../entities/user.entity';
import { UserPermissionRepository } from '../user-permission/user-permission.repository';

@Injectable()
export class UserService extends BaseService<User, UserRepository> {
  constructor(
    protected repository: UserRepository,
    private readonly userPermissionRepo: UserPermissionRepository
  ) {
    super(repository);
  }

  async findOneByUsername(username: string): Promise<User | undefined> {
    // const result = await this.repository.findOne({
    //   where: { username },
    //   relations: ['roles']
    // });
    const result = await this.repository
      .createQueryBuilder('users')
      .select('users')
      .addSelect('users.password')
      .where('users.username= :username', { username })
      .leftJoinAndSelect('users.roles', 'roles')
      .getOne();

    return result;
  }

  async findOneByPhone(phone: string): Promise<User | undefined> {
    const result = await this.repository.findOne({
      where: { phone },
      relations: ['roles']
    });
    return result;
  }

  async updateMyInformation(user: User, userUpdate: UpdateMyUserDto): Promise<User> {
    const data: any = user;
    data.permissions = undefined;
    if (userUpdate.phone !== undefined) {
      data.phone = userUpdate.phone;
    }
    if (userUpdate.fullName !== undefined) {
      data.fullName = userUpdate.fullName;
    }
    if (userUpdate.email !== undefined) {
      data.email = userUpdate.email;
    }
    if (userUpdate.avatar !== undefined) {
      data.avatar = userUpdate.avatar;
    }
    const result = await this.repository.save(data);
    return result;
  }

  async updateAvatar(path: string, req: UserRequestDto): Promise<any> {
    const avatar = await this.uploadImage(path, req.user.fullName);
    await this.repository.update({ id: req.user.id }, { avatar });
    return {
      avatar
    };
  }

  async updateMyPassword(id: number, body: UpdateMyPasswordDto) {
    // const user = await this.repository.findOne({
    //   select: ['password'],
    //   where: {
    //     id
    //   }
    // });
    const user = await this.repository
      .createQueryBuilder('users')
      .select('users.password')
      .where('users.id= :id', { id })
      .getOne();
    if (!Bcrypt.compareSync(body.oldPassword, user.password))
      throw new BadRequestException('Old password is incorrect');
    await this.repository.update(id, { password: body.newPassword });
  }

  async createUser(data: CreateUserDTO): Promise<any> {
    console.log('data --->', data);
    const user = {
      username: data.username,
      password: data.password,
      fullName: data.fullName,
      phone: data.phone,
      email: data.email
    };
    const result = await this.repository.save({ ...user, roles: [{ id: data.roleId }] });
    return result;
  }

  async getPermissionOfUser(userId: number, metadata: GetMany) {
    let data = [];
    let { limit, offset, page } = metadata;
    const userData = await this.repository.findOne({
      where: { id: userId },
      relations: ['roles', 'roles.permissions', 'userPermissions']
    });
    let total = userData.userPermissions.length;
    for (let i = 0; i < userData.roles.length; i += 1) {
      total += userData.roles[i].permissions.length;
    }
    if (limit === undefined) limit = 15;
    const pageCount = Math.ceil(total / limit);
    if (offset === undefined) offset = 0;
    if (page === undefined && offset === undefined) {
      offset = 0;
      page = 1;
    } else if (offset === undefined) {
      offset = limit * (page - 1);
    } else {
      page = Math.trunc(offset / limit) + 1;
    }

    const query = createQueryBuilder()
      .select('permissions')
      .from(Permission, 'permissions');
    if (offset >= userData.userPermissions.length) {
      const permissionData = await query
        .leftJoin('permissions.roles', 'role')
        .leftJoinAndSelect('permissions.module', 'module')
        .leftJoinAndSelect('permissions.method', 'method')
        .leftJoin('role.users', 'user')
        .where('user.id = :id', { id: userId })
        .take(limit)
        .offset(offset - userData.userPermissions.length)
        .getMany();
      data = permissionData;
    } else {
      const userPermissionData = await query
        .leftJoin('permissions.userPermissions', 'userPermission')
        .leftJoin('userPermission.user', 'user')
        .leftJoinAndSelect('permissions.module', 'module')
        .leftJoinAndSelect('permissions.method', 'method')
        .where('user.id= :id', { id: userId })
        .where('userPermission.status= :status', { status: 'ADD' })
        .take(limit)
        .skip(offset)
        .getMany();

      if (userPermissionData.length > 0 && limit > userPermissionData.length) {
        const permissionData = await createQueryBuilder()
          .select('permissions')
          .from(Permission, 'permissions')
          .leftJoin('permissions.roles', 'role')
          .leftJoinAndSelect('permissions.module', 'module')
          .leftJoinAndSelect('permissions.method', 'method')
          .leftJoin('role.users', 'user')
          .where('user.id = :id', { id: userId })
          .take(limit - userPermissionData.length)
          .getMany();
        for (let i = 0; i < permissionData.length; i += 1) {
          userPermissionData.push(permissionData[i]);
        }
      }
      data = userPermissionData;
    }
    return {
      count: data.length,
      total,
      page,
      pageCount,
      data
    };
  }

  async createBulkPermission(userId: number, permissionIds: number[]): Promise<UserPermission[]> {
    const queries = await this.repository.findOne({
      where: { id: userId },
      relations: ['userPermissions', 'roles', 'roles.permissions']
    });
    const temp = [];
    if (queries === undefined) {
      throw new NotFoundException('User not found');
    }
    queries.roles.map(role => {
      permissionIds.forEach(permissionId => {
        let status = 0;
        queries.userPermissions.forEach(userPermission => {
          if (userPermission.permission.id === permissionId && userPermission.status === 'DELETE') {
            this.userPermissionRepo.delete({ id: userPermission.id });
            status = 1;
          }
          if (userPermission.permission.id === permissionId && userPermission.status === 'ADD') {
            throw new BadRequestException(
              `Already existed permission with ${userPermission.permission.method.name} ${userPermission.permission.module.name}`
            );
          }
        });
        if (status === 0) {
          role.permissions.map(permission => {
            if (permissionId === permission.id) {
              throw new BadRequestException(
                `Already existed permission with ${permission.method.name} ${permission.module.name}`
              );
            }
          });
          temp.push({ user: { id: userId }, permission: { id: permissionId }, status: 'ADD' });
        }
      });
    });
    let result: UserPermission[];
    if (temp.length !== 0) {
      result = await this.userPermissionRepo.save(temp);
    }
    return result;
  }

  async deleteManyPermission(userId: number, permissionId: number): Promise<any> {
    const temp = [];
    const queries = await this.repository.findOne({
      where: { id: userId },
      relations: ['userPermissions', 'roles', 'roles.permissions']
    });
    if (queries === undefined) {
      throw new NotFoundException('User not found');
    }
    queries.roles.forEach(role => {
      let status = 0;
      queries.userPermissions.forEach(userPermission => {
        if (userPermission.permission.id === permissionId && userPermission.status === 'ADD') {
          this.userPermissionRepo.delete({ id: userPermission.id });
          status = 1;
        }
        if (userPermission.permission.id === permissionId && userPermission.status === 'DELETE') {
          throw new BadRequestException(
            `This user don't have permission with ${userPermission.permission.method.name} ${userPermission.permission.module.name}`
          );
        }
      });
      if (status === 0) {
        for (let i = 0; i < role.permissions.length; i += 1) {
          if (permissionId === role.permissions[i].id) {
            temp.push({ user: { id: userId }, permission: { id: permissionId }, status: 'DELETE' });
            break;
          }
          if (i === role.permissions.length - 1) {
            throw new BadRequestException(
              `This user don't have permission with id: ${permissionId}`
            );
          }
        }
      }
    });
    if (temp.length > 0) await this.userPermissionRepo.save(temp);
  }
}
