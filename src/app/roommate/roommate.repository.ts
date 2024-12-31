import { Roommate } from '@src/entities/roommate.entity';
import { Repository, EntityRepository } from 'typeorm';
@EntityRepository(Roommate)
export class RoommateRepository extends Repository<Roommate> {

}
