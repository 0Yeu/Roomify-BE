import { Controller, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { Crud, CrudController } from '@nestjsx/crud';
import { Modules } from '@src/common/decorators/modules.decorator';
import { ModulesName } from '@src/common/enums/modules.enum';
import { JwtAuthGuardProperty } from '@src/common/guards/jwt-auth-property.guard';
import { LoggingInterceptor } from '@src/common/interceptors/property-response.interceptor';
import { Property } from '@src/entities/property.entity';
import { PropertyService } from './property.service';

@Crud({
  model: {
    type: Property
  },
  params: {
    ownerId: {
      field: 'ownerId',
      type: 'number'
    },
    id: {
      field: 'id',
      type: 'number',
      primary: true
    }
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
@Controller('/owners/:ownerId/properties')
export class OwnerPropertiesController implements CrudController<Property>{
  constructor(public service: PropertyService) { }

  get base(): CrudController<Property> {
    return this;
  }

}
