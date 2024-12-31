import { FavoriteProperty } from '@src/entities/favorite_property.entity';
import { Repository, EntityRepository, getManager } from 'typeorm';
@EntityRepository(FavoriteProperty)
export class FavoritePropertyRepository extends Repository<FavoriteProperty> {
  getDistinct(userId: number): any {
    return getManager().createQueryBuilder(FavoriteProperty, 'favoriteProperty').leftJoinAndSelect('favoriteProperty.property', 'property')
      .where('favoriteProperty.userId= :userId', { userId }).groupBy('favoriteProperty.id').addGroupBy('property.id').getMany();
  }
}
