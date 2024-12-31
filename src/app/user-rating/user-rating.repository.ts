import { UserRating } from '@src/entities/user-rating.entity';
import { Repository, EntityRepository, getManager } from 'typeorm';
@EntityRepository(UserRating)
export class UserRatingRepository extends Repository<UserRating> {
}
