import { Body, Controller, Get, Param, ParseIntPipe, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Crud, CrudController, Override } from '@nestjsx/crud';
import { Methods } from '@src/common/decorators/methods.decorator';
import { Modules } from '@src/common/decorators/modules.decorator';
import { MethodName } from '@src/common/enums/methods.enum';
import { ModulesName } from '@src/common/enums/modules.enum';
import { JwtAuthGuard } from '@src/common/guards/jwt-auth.guard';
import { Roommate } from '@src/entities/roommate.entity';
import { GetMany } from '@src/models/base/getMany.dto';
import { CreateRoomateDto } from '@src/models/roommate/create.dto';
import { UpdateRoommateDto } from '@src/models/roommate/update.dto';
import { UserRequestDto } from '@src/models/users/user-request.dto';
import { RoommateService } from './roommate.service';

@Crud({
  model: {
    type: Roommate
  },
  query: {
    exclude: ['userId', 'destinationId'],
    join: {
      destination: {
        eager: true,
        allow: ['name']
      },
      user: {
        eager: true,
        exclude: ['password', 'createdAt', 'updatedAt', 'deletedAt']
      },
      'destination.parent': {
        eager: true,
        allow: ['name'],
        alias: 'district'
      },
      'destination.parent.parent': {
        eager: true,
        allow: ['name'],
        alias: 'city'
      }
    }
  },
  routes: {
    exclude: ['createManyBase']
  }
})
@ApiTags('roommate')
@Modules(ModulesName.ROOMMATE)
@Controller('roommate')
export class RoommateController implements CrudController<Roommate> {
  constructor(public service: RoommateService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/mine')
  getMyRoommate(@Req() req: UserRequestDto, @Query() query: GetMany) {
    return this.service.getMyRoommate(req.user.id, query);
  }

  @ApiBearerAuth()
  @Methods(MethodName.GET_LIST)
  @Get('/deleted')
  getListWasDeleted(@Query() query: GetMany) {
    return this.service.getDataWasDeleted(query);
  }

  get base(): CrudController<Roommate> {
    return this;
  }

  @Methods(MethodName.POST)
  @ApiBearerAuth()
  @Override('createOneBase')
  createOne(@Req() req: UserRequestDto, @Body() body: CreateRoomateDto) {
    return this.service.create(req.user.id, body);
  }

  @Methods(MethodName.PATCH)
  @ApiBearerAuth()
  @Override('updateOneBase')
  updateOne(@Req() req: UserRequestDto, @Body() body: UpdateRoommateDto, @Param('id', ParseIntPipe) id: number) {
    return this.service.update(req.user.id, body, id);
  }
}
