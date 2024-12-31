import { Destination } from '@src/entities/destinations.entity';
import { Repository, EntityRepository } from 'typeorm';
@EntityRepository(Destination)
export class DestinationRepository extends Repository<Destination> {
  async findOneById(id: number): Promise<Destination> {
    return this.findOne(id);
  }

}
