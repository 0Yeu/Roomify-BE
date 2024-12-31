import { OwnerRegistration } from '@src/entities/owner_registration.entity';
import { Repository, EntityRepository } from 'typeorm';
@EntityRepository(OwnerRegistration)
export class OwnerRegistrationRepository extends Repository<OwnerRegistration> {

}
