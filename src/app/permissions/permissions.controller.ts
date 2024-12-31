import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Methods } from '@src/common/decorators/methods.decorator';
import { Modules } from '@src/common/decorators/modules.decorator';
import { MethodName } from '@src/common/enums/methods.enum';
import { ModulesName } from '@src/common/enums/modules.enum';
import { PermissionsService } from './permissions.service';

@ApiTags('permissions')
@Modules(ModulesName.PERMISSION)
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly service: PermissionsService) {}

  @Get()
  @Methods(MethodName.GET_LIST)
  getAll() {
    return this.service.getAll();
  }
}
