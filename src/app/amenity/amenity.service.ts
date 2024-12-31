import { Injectable } from '@nestjs/common';
import { BaseService } from '@src/base.service';
import { Amenity } from '@src/entities/amenity.entity';
import { AmenityRepository } from './amenity.repository';

@Injectable()
export class AmenityService extends BaseService<Amenity, AmenityRepository> {
  constructor(protected repository:AmenityRepository){
    super(repository);
  }
}
