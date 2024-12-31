import { Body, Controller, Param, ParseIntPipe, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud, CrudController, Override } from '@nestjsx/crud';
import { Modules } from '@src/common/decorators/modules.decorator';
import { ModulesName } from '@src/common/enums/modules.enum';
import { OwnerRegistration } from '@src/entities/owner_registration.entity';
import { Methods } from '@src/common/decorators/methods.decorator';
import { MethodName } from '@src/common/enums/methods.enum';
import { UpdateOwnerRegistrationDto } from '@src/models/owner-registration/update.dto';
import { UserRequestDto } from '@src/models/users/user-request.dto';
import { OwnerRegistrationService } from './owner-registration.service';
import { CreateOwnerRegistrationDto } from '../../models/owner-registration/create.dto';

@Crud({
  model: {
    type: OwnerRegistration
  },
  query: {
    join: {
      user: {
        eager: true,
        exclude: ['password', 'createdAt', 'updatedAt', 'deletedAt']
      }
    },
    sort: [
      {
        field: 'updatedAt',
        order: 'DESC'
      }
    ]
  }
})
@Modules(ModulesName.OWNER_REGISTRATION)
@ApiTags('owner-registration')
@Controller('owner-registration')
export class OwnerRegistrationController implements CrudController<OwnerRegistration> {
  constructor(public service: OwnerRegistrationService) { }

  get base(): CrudController<OwnerRegistration> {
    return this;
  }

  @Methods(MethodName.POST)
  @Override('createOneBase')
  createOne(@Body() body: CreateOwnerRegistrationDto, @Req() req: UserRequestDto) {
    return this.service.create(body, req);
  }

  @Methods(MethodName.DELETE)
  @Override('deleteOneBase')
  deleteOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.delete(id);
  }

  @Methods(MethodName.PUT)
  @Override('updateOneBase')
  updateOne(@Param('id', ParseIntPipe) id: number, @Body() body:UpdateOwnerRegistrationDto) {
    return this.service.update(id, body);
  }

}
