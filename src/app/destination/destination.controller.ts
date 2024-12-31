import { Controller, Get, Param, ParseIntPipe, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Crud, CrudController, Override } from '@nestjsx/crud';
import { Methods } from '@src/common/decorators/methods.decorator';
import { Modules } from '@src/common/decorators/modules.decorator';
import { MethodName } from '@src/common/enums/methods.enum';
import { ModulesName } from '@src/common/enums/modules.enum';
import { method } from '@src/constant/config-crud.constant';
import { Destination } from '@src/entities/destinations.entity';
import { DestinationService } from './destination.service';

@Crud({
  model: {
    type: Destination
  },
  query: {
    join: {
    }
  },
  routes: {
    getManyBase: {
      decorators: []
    },
    getOneBase: {
      decorators: []
    }
  }
})
@Modules(ModulesName.DESTINATION)
@ApiTags('destinations')
@Controller('destinations')
export class DestinationController implements CrudController<Destination> {
  constructor(public service: DestinationService) { }

  @ApiBearerAuth()
  @Patch('restore/:id')
  @Methods(MethodName.PATCH)
  restore(@Param('id', ParseIntPipe) id: number) {
    return this.service.restore(id);
  }

  @Get('/city')
  getCity() {
    return this.service.getCity();
  }

  @Get('city/:cityId/district')
  async getDistrinct(@Param('cityId', ParseIntPipe) cityId: number) {
    return this.service.getDistrict(cityId);
  }

  @Get('city/district/:districtId/sub-district')
  async getSubDistrinct(@Param('districtId', ParseIntPipe) districtId: number) {
    return this.service.getSubDistrict(districtId);
  }

  get base(): CrudController<Destination> {
    return this;
  }

  @Override('getOneBase')
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findTreeAndSelfWithId(id);
  }

}
