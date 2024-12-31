import { Body, Controller, Get, Param, ParseIntPipe, Patch, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Crud, CrudController, Override } from '@nestjsx/crud';
import { Methods } from '@src/common/decorators/methods.decorator';
import { Modules } from '@src/common/decorators/modules.decorator';
import { MethodName } from '@src/common/enums/methods.enum';
import { ModulesName } from '@src/common/enums/modules.enum';
import { RoomStatus } from '@src/common/enums/roomStatus.enum';
import { method } from '@src/constant/config-crud.constant';
import { Room } from '@src/entities/room.entity';
import { GetMany } from '@src/models/base/getMany.dto';
import { CreateRoom } from '@src/models/room/create.dto';
import { UpdateRoom } from '@src/models/room/update.dto';
import { UserRequestDto } from '@src/models/users/user-request.dto';
import { RoomService } from './room.service';

@Crud({
  model: {
    type: Room
  },
  query: {
    sort: [
      {
        field: 'id',
        order: 'DESC'
      }
    ],
    filter: {
      // status: RoomStatus.CLOSE,
      // status: {
      //   $eq: 'CLOSE'
      // }
    }
  },
  routes: {
    getOneBase: {
      decorators: []
    }
  }
})
@Modules(ModulesName.ROOM)
@ApiTags('rooms')
@Controller('rooms')
export class RoomController implements CrudController<Room> {
  constructor(public service: RoomService) { }

  @ApiBearerAuth()
  @Patch('restore/:id')
  @Methods(MethodName.PATCH)
  restore(@Param('id', ParseIntPipe) id: number) {
    return this.service.restore(id);
  }

  @ApiBearerAuth()
  @Methods(MethodName.GET_LIST)
  @Get('/deleted')
  getListWasDeleted(@Query() query: GetMany) {
    return this.service.getDataWasDeleted(query);
  }

  get base():CrudController<Room> {
    return this;
  }

  @ApiBearerAuth()
  @Methods(MethodName.GET)
  @Override('getOneBase')
  getOne(@Param('id', ParseIntPipe) id: number, @Req() req: UserRequestDto) {
    return this.service.getOneRoom(id, req.user.roles);
  }

  @ApiBearerAuth()
  @Methods(MethodName.POST)
  @Override('createOneBase')
  createOne(@Body() body: CreateRoom, @Req() req: UserRequestDto) {
    return this.service.createRoom(body, req.user.id);
  }

  @ApiBearerAuth()
  @Methods(MethodName.PUT)
  @Override('replaceOneBase')
  updateOne(@Body() body: UpdateRoom, @Param('id', ParseIntPipe) id: number) {
    return this.service.updateRoom(body, id);
  }
}
