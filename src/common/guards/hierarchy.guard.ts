import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from '@src/entities/user.entity';
import { createQueryBuilder } from 'typeorm';

@Injectable()
export class HierarchyGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  async checkRank(id: number, roleId: number): Promise<boolean> {
    const userQuery = await createQueryBuilder().select('user').from(User, 'user').where('user.id =:id', { id }).leftJoinAndSelect('user.roles', 'roles').getOne();
    if (userQuery) {
      if (roleId <= userQuery.roles[0].id) return true;
      return false;
    }
    return true;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const methods = this.reflector.get<string[]>('methods', context.getHandler());
    const modules = this.reflector.get<string[]>('modules', context.getClass());

    if ((methods[0] === 'DELETE' || methods[0] === 'PATCH' || methods[0] === 'PUT') && modules[0] === 'USER') {
      const request = context.switchToHttp().getRequest();
      const { user } = request;
      const param = request.params;
      return this.checkRank(param.id, user.roles[0].id);
    }
    return true;
  }
}
