import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiProperty, ApiTags } from '@nestjs/swagger';
import { Crud, CrudController, Override } from '@nestjsx/crud';
import { AuthorizeCrudInterceptor } from '@src/common/decorators/authorize.crud.decorators';
import { Methods } from '@src/common/decorators/methods.decorator';
import { Modules } from '@src/common/decorators/modules.decorator';
import { MethodName } from '@src/common/enums/methods.enum';
import { ModulesName } from '@src/common/enums/modules.enum';
import { JwtAuthGuardProperty } from '@src/common/guards/jwt-auth-property.guard';
import { JwtAuthGuard } from '@src/common/guards/jwt-auth.guard';
import { ValidationPipe } from '@src/common/pipes/validation.pipe';
import { Bookings } from '@src/entities/bookings.entity';
import { Role } from '@src/entities/roles.entity';
import { GetMany } from '@src/models/base/getMany.dto';
import { UserRequestDto } from '@src/models/users/user-request.dto';
import { BookingService } from './booking.service';

@Crud({
  model: {
    type: Bookings
  },
  query: {
    join: {
      user: {
        allow: ['fullName', 'email', 'username', 'phone'],
        eager: true
      },
      room: {
        eager: true,
        allow: ['name']
      }
    },
    sort: [
      {
        field: 'id',
        order: 'DESC'
      }
    ]
  },
  routes: {
    exclude: ['deleteOneBase', 'replaceOneBase', 'createManyBase'],
    getManyBase: {
      decorators: [UseGuards(JwtAuthGuardProperty), ApiBearerAuth(), UseInterceptors(AuthorizeCrudInterceptor)]
      // interceptors: [LoggingInterceptor]
    }
  }
})
@Controller('booking')
@ApiTags('booking')
@Modules(ModulesName.BOOKING)
export class BookingController implements CrudController<Bookings> {
  constructor(public readonly service: BookingService) { }

  @ApiBearerAuth()
  @Get('/owner/:ownerId')
  @Methods(MethodName.GET_LIST)
  listBookingWithOwner(@Param('ownerId', ParseIntPipe) ownerId: number, @Query() query: GetMany) {
    return this.service.getBookingWithOwner(ownerId, query);
  }

  @ApiBearerAuth()
  @Get('/mine/booked')
  @UseGuards(JwtAuthGuard)
  listBookedOfMe(@Req() req: UserRequestDto, @Query() query: GetMany) {
    return this.service.getBookingWithOwner(req.user.id, query);
  }

  @ApiBearerAuth()
  @Get('/mine/booking')
  @UseGuards(JwtAuthGuard)
  listBookingOfMe(@Req() req: UserRequestDto, @Query() query: GetMany) {
    return this.service.getBookingWithUser(req.user.id, query);
  }

  get base(): CrudController<Bookings> {
    return this;
  }

  @Override('createOneBase')
  @ApiBearerAuth()
  @Methods(MethodName.POST)
  @ApiBody({
    required: true, schema: {
      type: 'number',
      example: {
        roomId: 1
      }
    }
  })
  create(@Req() req: UserRequestDto, @Body('roomId', new ValidationPipe) roomId: number) {
    return this.service.create(req.user.id, roomId, req.user.phone);
  }
}
