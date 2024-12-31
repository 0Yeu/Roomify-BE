import { Amenity } from '@src/entities/amenity.entity';
import { Repository, EntityRepository } from 'typeorm';
@EntityRepository(Amenity)
export class AmenityRepository extends Repository<Amenity> {
  async findOneById(id: number): Promise<Amenity> {
    return this.findOne(id);
  }

}
