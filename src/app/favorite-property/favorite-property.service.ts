import { Injectable } from '@nestjs/common';
import { BaseService } from '@src/base.service';
import { FavoriteProperty } from '@src/entities/favorite_property.entity';
import { GetMany } from '@src/models/base/getMany.dto';
import { Check } from '@models/rs_pb';
import { UserRatingEnum } from '../../common/enums/userRating.enum';
import { clientService } from '../../../route.serive';
import { UserRatingRepository } from '../user-rating/user-rating.repository';
import { PropertyRepository } from '../property/property.repository';
import { FavoritePropertyRepository } from './favorite-property.repository';

@Injectable()
export class FavoritePropertyService extends BaseService<
  FavoriteProperty,
  FavoritePropertyRepository
> {
  constructor(
    protected readonly repository: FavoritePropertyRepository,
    private readonly propertyRepo: PropertyRepository,
    private readonly userRatingRepo: UserRatingRepository
  ) {
    super(repository);
  }

  async create(userId: number, propertyId: number): Promise<any> {

    const query = await this.repository.findOne({
      where: { user: { id: userId }, property: { id: propertyId } }
    });
    if (query) {
      await this.repository.delete(query.id);
      return {
        status: 200,
        message: 'Thành công !!!'
      };
    }
    const result = await this.repository.save({
      property: { id: propertyId },
      user: { id: userId }
    });
    await this.userRatingRepo.save({ userId, propertyId, rating: UserRatingEnum.FAVORITE });
    const check = new Check();
    check.setMessage('change');
    clientService.trackChange(check);
    return result;
  }

  async getFavoriteProperty(userId: number, query: GetMany): Promise<any> {
    let { limit, page, offset } = query;
    if (limit === undefined) limit = 15;
    if (offset === undefined) offset = 0;
    if (page === undefined && offset === undefined) {
      offset = 0;
      page = 1;
    } else if (offset === undefined) {
      offset = limit * (page - 1);
    } else {
      page = Math.trunc(offset / limit) + 1;
    }
    // const result = await this.propertyRepo.getPropertyFavorite(userId, limit, offset);
    const result = await this.repository.findAndCount({
      where: { userId },
      relations: [
        'property',
        'property.category',
        'property.owner',
        'property.destination',
        'property.destination.parent',
        'property.destination.parent.parent'
      ],
      order: {
        id: 'DESC'
      }
    });
    const data = result[0].map(t => {
      return t.property;
    });
    const count = data.length;
    const total = result[1];
    const pageCount = Math.ceil(total / limit);
    return {
      count,
      total,
      page,
      pageCount,
      data
    };
  }
}
