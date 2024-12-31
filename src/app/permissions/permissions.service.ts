import { Injectable } from '@nestjs/common';
import { Permission } from '@src/entities/permission.entity';
import { IResponseFormat } from '@src/models/base/response.interface';
import { PermissionRepository } from './permissions.repository';

@Injectable()
export class PermissionsService {
  constructor(private readonly repository: PermissionRepository) {}

  async getAll(): Promise<IResponseFormat<Permission[]>> {
    const data = await this.repository.find();
    return { data };
  }
}
