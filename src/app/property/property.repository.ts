import { RoomStatus } from '@src/common/enums/roomStatus.enum';
import { FavoriteProperty } from '@src/entities/favorite_property.entity';
import { Property } from '@src/entities/property.entity';
import { Repository, EntityRepository, getManager, getRepository } from 'typeorm';
@EntityRepository(Property)
export class PropertyRepository extends Repository<Property> {
  getOneWithRoom(id: number): any {
    return getManager()
      .createQueryBuilder(Property, 'property')
      .where('property.id= :id', { id })
      .leftJoinAndSelect('property.rooms', 'rooms')
      .leftJoinAndSelect('rooms.amenities', 'amenities')
      .andWhere('rooms.status= :status', { status: RoomStatus.OPEN })
      .andWhere('rooms.deletedAt IS NULL')
      .getOne();
  }

  getPropertyWithSubDistrict(name: string, limit: number, offset: number): any {
    return getManager()
      .createQueryBuilder(Property, 'property')
      .leftJoinAndSelect('property.destination', 'destination')
      .where('destination.name= :name', { name })
      .andWhere('property.deletedAt IS NULL')
      .take(limit)
      .skip(offset)
      .orderBy('property.id', 'DESC')
      .getManyAndCount();
  }

  getPropertyNearMe() {}

  getPropertyFavorite(userId: number, limit: number, offset: number) {
    return (
      this.createQueryBuilder('properties')
        .where(qb => {
          const subQuery = qb
            .subQuery()
            .select('favorite.propertyId')
            .from(FavoriteProperty, 'favorite')
            .where('favorite.user= :userId')
            .orderBy('favorite.id', 'DESC')
            .getQuery();
          return `properties.id IN ${subQuery}`;
        })
        .andWhere('properties.deletedAt IS NULL')
        .setParameter('userId', userId)
        .leftJoinAndSelect('properties.category', 'category')
        .leftJoin('properties.destination', 'destination')
        .addSelect('destination.name')
        .leftJoin('destination.parent', 'district')
        .addSelect('district.name')
        .leftJoin('district.parent', 'city')
        .addSelect('city.name')
        .leftJoinAndSelect('properties.policy', 'policy')
        .leftJoin('properties.owner', 'owner')
        .addSelect([
          'owner.id',
          'owner.fullName',
          'owner.username',
          'owner.email',
          'owner.phone',
          'owner.avatar'
        ])
        .take(limit)
        .skip(offset)
        // .orderBy('properties.id', 'DESC')
        .getManyAndCount()
    );
  }

  // getPropertyRS(lsProperties, limit, offset) {
  //   return getManager()
  //     .createQueryBuilder(Property, 'property')
  //     // .where('property.id IN (:...properties)', { properties: lsProperties })
  //     .where('property.id IN (:...properties)', { properties: lsProperties })
  //     .orderBy('array_position(:properties, id)')
  //     .take(limit || 10)
  //     .skip(offset || 0)
  //     .getManyAndCount();
  //   // .getMany();
  // }

  async getPropertyRS(lsProperties, limit, offset, cityId) {
    console.log('cityId :>> ', cityId);
    if (cityId) {
      return getRepository(Property)
        .createQueryBuilder('property')
        .leftJoinAndSelect('property.category', 'category')
        .leftJoinAndSelect('property.destination', 'destination')
        .addSelect('destination.name')
        .leftJoin('destination.parent', 'district')
        .addSelect('district.name')
        .leftJoin('district.parent', 'city')
        .addSelect('city.name')
        .where('property.id IN (:...properties_arr)', { properties_arr: lsProperties })
        .andWhere('city.id= :cityId', { cityId })
        .orderBy('array_position(:properties_arr, "property"."id")')
        .limit(limit || 10)
        .offset(offset || 0)
        .getManyAndCount();
    }
    return getRepository(Property)
      .createQueryBuilder('property')
      .leftJoinAndSelect('property.category', 'category')
      .leftJoinAndSelect('property.destination', 'destination')
      .addSelect('destination.name')
      .leftJoin('destination.parent', 'district')
      .addSelect('district.name')
      .leftJoin('district.parent', 'city')
      .addSelect('city.name')
      .where('property.id IN (:...properties_arr)', { properties_arr: lsProperties })
      .orderBy('array_position(:properties_arr, "property"."id")')
      .limit(limit || 10)
      .offset(offset || 0)
      .getManyAndCount();
  }
}
