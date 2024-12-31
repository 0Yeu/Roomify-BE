import { Body, Controller, ForbiddenException, Get, Param, ParseIntPipe, Patch, Post, Query, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Crud, CrudController, Override } from '@nestjsx/crud';
import { Methods } from '@src/common/decorators/methods.decorator';
import { Modules } from '@src/common/decorators/modules.decorator';
import { MethodName } from '@src/common/enums/methods.enum';
import { ModulesName } from '@src/common/enums/modules.enum';
import { JwtAuthGuardProperty } from '@src/common/guards/jwt-auth-property.guard';
import { LoggingInterceptor } from '@src/common/interceptors/property-response.interceptor';
import { method } from '@src/constant/config-crud.constant';
import { Property } from '@src/entities/property.entity';
import { GetMany } from '@src/models/base/getMany.dto';
import { CreatePropertyDTO } from '@src/models/property/create.dto';
import { GetRSPropertyDTO } from '@src/models/property/get.dto';
import { UpdatePropertyDTO } from '@src/models/property/update.dto';
import { UserRequestDto } from '@src/models/users/user-request.dto';
import { PropertyService } from './property.service';

@Crud({
  model: {
    type: Property
  },
  query: {
    sort: [
      {
        field: 'id',
        order: 'DESC'
      }
    ],
    join: {
      category: {
        eager: true,
        allow: ['name', 'slug']
      },
      owner: {
        eager: true,
        allow: ['fullName', 'username', 'email', 'phone', 'avatar']
      },
      destination: {
        eager: true,
        allow: ['name']
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
      },
      policy: {
        eager: true
      }
    }
  },
  routes: {
    getManyBase: {
      decorators: [UseGuards(JwtAuthGuardProperty), ApiBearerAuth()],
      interceptors: [LoggingInterceptor]
    },
    getOneBase: {
      decorators: [UseGuards(JwtAuthGuardProperty), ApiBearerAuth()],
      interceptors: [LoggingInterceptor]
    }
  }
})
@Modules(ModulesName.PROPERTY)
@ApiTags('properties')
@Controller('properties')
export class PropertyController implements CrudController<Property>{
  constructor(public service: PropertyService) { }

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

  @ApiBearerAuth()
  @Methods(MethodName.GET_LIST)
  @Get(':id/rooms')
  getRoom(@Param('id', ParseIntPipe) id: number, @Req() req: UserRequestDto) {
    console.log('req.user :>> :id/rooms', req?.user);
    const userId = req?.user?.id;
    return this.service.getRooms(id, userId);
  }

  @Get('/owner/:ownerId')
  getPropertyOfUser(@Param('ownerId', ParseIntPipe) ownerId: number, @Query() query: GetMany) {
    return this.service.getPropertyOfUser(ownerId, query);
  }

  @Get('/destination/:destinationId')
  getPropertyOfDestination(@Param('destinationId', ParseIntPipe) destinationId: number, @Query() query: GetMany) {
    return this.service.getPropertyOfDestination(destinationId, query);
  }

  @Get('/destination')
  getPropertyWithNameDestination(@Query('destinationName') name: string, @Query() query: GetMany){
    return this.service.getPropertyWithDestinationName(name, query);
  }

  @Get('/near-me')
  getPropertyNearMe(@Query('latitude', ParseIntPipe) latitude: number, @Query('longtitude', ParseIntPipe) longtitude: number, @Query('sub-district') subDistrict: string, @Query() query: GetMany) {
    return this.service.getPropertyNearMe(latitude, longtitude, subDistrict, query);
  }

  @Get('/category/:categoryId')
  getPropertyOfCategory(@Param('categoryId', ParseIntPipe) categoryId: number, @Query() query: GetMany) {
    return this.service.getPropertyOfCategory(categoryId, query);
  }

  @ApiBearerAuth()
  @Methods(MethodName.GET)
  @Get('/rs')
  getPropertyRS(@Req() req: UserRequestDto, @Query() query: GetRSPropertyDTO) {
    const { user } = req;
    return this.service.getPropertyRS(user?.id, query?.limit, query?.offset, query?.cityId);
  }

  get base(): CrudController<Property> {
    return this;
  }

  @ApiBearerAuth()
  @Methods(MethodName.POST)
  @Override('createOneBase')
  createOne(@Body() body: CreatePropertyDTO, @Req() req: UserRequestDto) {
    return this.service.create(body, req);
  }

  @ApiBearerAuth()
  @Methods(MethodName.PATCH)
  @Override('updateOneBase')
  updateOne(@Body() body: UpdatePropertyDTO, @Param('id', ParseIntPipe) id: number, @Req() req: UserRequestDto) {
    return this.service.update(body, id, req);
  }

  @ApiBearerAuth()
  @Methods(MethodName.DELETE)
  @Override('deleteOneBase')
  deleteOne(@Param('id', ParseIntPipe) id: number, @Req() req: UserRequestDto) {

    return this.service.delete(id, req);
  }

}
