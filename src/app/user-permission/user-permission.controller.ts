import { Body, Controller, Delete, Get, ParseIntPipe, Post, Query, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Crud, CrudController } from '@nestjsx/crud';
import { Methods } from '@src/common/decorators/methods.decorator';
import { Modules } from '@src/common/decorators/modules.decorator';
import { MethodName } from '@src/common/enums/methods.enum';
import { ModulesName } from '@src/common/enums/modules.enum';
import { UserPermission } from '@src/entities/user-permission.entity';
import { GetMany } from '@src/models/base/getMany.dto';
import { AddDeletePermissions } from '@src/models/user-permissions/permission.dto';
import { UserPermissionService } from './user-permission.service';

@Crud({
  model: {
    type: UserPermission
  },
  query: {
    join: {
    }
  }
})
@Modules(ModulesName.USER_PERMISSION)
@Controller('user-permission')
@ApiTags('user-permission')
export class UserPermissionController implements CrudController<UserPermission>{
  constructor(public service: UserPermissionService) { }

  @Delete()
  deleteMany(@Body() body: AddDeletePermissions) {
    return this.service.deleteMany(body);
  }

  @Post()
  createMany(@Body() body: AddDeletePermissions) {
    return this.service.createBulk(body);
  }

  get base(): CrudController<UserPermission> {
    return this;
  }
}
