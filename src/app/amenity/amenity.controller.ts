import { Controller, Param, ParseIntPipe, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Crud, CrudController } from '@nestjsx/crud';
import { Methods } from '@src/common/decorators/methods.decorator';
import { Modules } from '@src/common/decorators/modules.decorator';
import { MethodName } from '@src/common/enums/methods.enum';
import { ModulesName } from '@src/common/enums/modules.enum';
import { Amenity } from '@src/entities/amenity.entity';
import { AmenityService } from './amenity.service';

@Crud({
  model: {
    type: Amenity
  },
  query: {
    join: {
    }
  }
})
@Modules(ModulesName.AMENTITY)
@ApiTags('amenities')
@Controller('amenities')
export class AmenityController implements CrudController<Amenity> {
  constructor(public service: AmenityService){}

  @ApiBearerAuth()
  @Patch('restore/:id')
  @Methods(MethodName.PATCH)
  restore(@Param('id', ParseIntPipe) id: number) {
    return this.service.restore(id);
  }

  get base(): CrudController<Amenity> {
    return this;
  }
}
