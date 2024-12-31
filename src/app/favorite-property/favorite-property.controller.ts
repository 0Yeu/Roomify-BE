import { Body, Controller, Get, Post, Query, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Crud, CrudController, Override } from '@nestjsx/crud';
import { AuthorizeCrudInterceptor } from '@src/common/decorators/authorize.crud.decorators';
import { Methods } from '@src/common/decorators/methods.decorator';
import { Modules } from '@src/common/decorators/modules.decorator';
import { MethodName } from '@src/common/enums/methods.enum';
import { ModulesName } from '@src/common/enums/modules.enum';
import { JwtAuthGuardProperty } from '@src/common/guards/jwt-auth-property.guard';
import { LoggingInterceptor } from '@src/common/interceptors/property-response.interceptor';
import { FavoriteProperty } from '@src/entities/favorite_property.entity';
import { GetMany } from '@src/models/base/getMany.dto';
import { CreateFavorite } from '@src/models/favorite-property/create.dto';
import { UserRequestDto } from '@src/models/users/user-request.dto';
import { FavoritePropertyService } from './favorite-property.service';
@Crud({
  model: {
    type: FavoriteProperty
  },
  query: {
    sort: [
      {
        field: 'id',
        order: 'ASC'
      }
    ],
    join: {
      property: {
        eager: true
        // allow: ['name', 'destinationId', 'title', ]
      },
      'property.destination': {
        eager: true,
        alias: 'subDistrict'
      },
      'property.destination.parent': {
        eager: true,
        allow: ['name'],
        alias: 'district'
      },
      'property.destination.parent.parent': {
        eager: true,
        allow: ['name'],
        alias: 'city'
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
@UseInterceptors(AuthorizeCrudInterceptor)
@ApiTags('favorite-property')
@Controller('favorite-property')
@Modules(ModulesName.FAVORITE_PROPERTY)
export class FavoritePropertyController implements CrudController<FavoriteProperty> {

  constructor(public service:FavoritePropertyService) {}

  get base(): CrudController<FavoriteProperty> {
    return this;
  }

  @Override('createOneBase')
  @ApiBearerAuth()
  @Post()
  @Methods(MethodName.POST)
  createOne(@Req() req: UserRequestDto, @Body() body: CreateFavorite) {
    const { user } = req;
    return this.service.create(user.id, body.propertyId);
  }

  // @ApiBearerAuth()
  // @Get()
  // @Methods(MethodName.GET_LIST)
  // getFavoriteProperty(@Req() req: UserRequestDto, @Query() query: GetMany) {
  //   return this.service.getFavoriteProperty(req.user.id, query);
  // }
}
