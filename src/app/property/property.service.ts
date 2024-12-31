import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '@src/base.service';
import { RoomStatus } from '@src/common/enums/roomStatus.enum';
import { Destination } from '@src/entities/destinations.entity';
import { FavoriteProperty } from '@src/entities/favorite_property.entity';
import { Property } from '@src/entities/property.entity';
import { User } from '@src/entities/user.entity';
import { GetMany } from '@src/models/base/getMany.dto';
import { CreatePropertyDTO } from '@src/models/property/create.dto';
import { UpdatePropertyDTO } from '@src/models/property/update.dto';
import { UserRequestDto } from '@src/models/users/user-request.dto';
import { In, Like, TreeRepository } from 'typeorm';
import { Check, UserRequest } from '@models/rs_pb';
import { UserRatingRepository } from '../user-rating/user-rating.repository';
import { clientService } from '../../../route.serive';
import { DestinationRepository } from '../destination/destination.repository';
import { PropertyRepository } from './property.repository';
import { UserRatingEnum } from '../../common/enums/userRating.enum';
@Injectable()
export class PropertyService extends BaseService<Property, PropertyRepository> {
  constructor(
    protected repository: PropertyRepository,
    protected destinationRepo: DestinationRepository,
    private readonly userRatingRepo: UserRatingRepository,
    @InjectRepository(Destination)
    private readonly treeRepository: TreeRepository<Destination>
  ) {
    super(repository);
  }

  async create(data: CreatePropertyDTO, req: UserRequestDto) {
    const { user } = req;
    let temp = 0;
    for (let i = 0; i < user.roles.length; i += 1) {
      if (user.roles[i].name === 'OWNER' || user.roles[i].name === 'ADMIN') {
        temp = 1;
        break;
      }
    }
    if (temp === 0) throw new ForbiddenException('Only role owner can create property !!!');
    const result = await this.repository.save({ ...data, owner: { id: user.id } });
    return result;
  }

  async update(data: UpdatePropertyDTO, id: number, req: UserRequestDto): Promise<Property> {
    const propertyQuery = await this.get({ id }, ['owner']);
    this.checkPossession(propertyQuery, req.user);
    const result = await this.repository.save({ ...data, id });
    return result;
  }

  async delete(id: number, req: UserRequestDto): Promise<void> {
    const propertyQuery = await this.get({ id }, ['owner']);
    for (let i = 0; i < req.user.roles.length; i += 1) {
      if (req.user.roles[i].name === 'OWNER') this.checkPossession(propertyQuery, req.user);
    }
    const result = await this.repository.softDelete(id);
    if (result.affected === 0) throw new NotFoundException('Not found property !!!');
  }

  checkPossession(propertyQuery: any, user: User): void {
    if (!propertyQuery) throw new NotFoundException('Not found property !!!');
    if (user.id !== propertyQuery.owner.id)
      throw new ForbiddenException('Can not action with property of other users');
  }

  async getRooms(id: number, userId: number): Promise<any> {
    const property = await this.repository.getOneWithRoom(id);
    if (!property) throw new NotFoundException('Property not found !!!');
    const data = property.rooms;
    await this.userRatingRepo.save({ userId, propertyId: id, rating: UserRatingEnum.VIEW_PROPERTY });
    const check = new Check();
    check.setMessage('change');
    clientService.trackChange(check);
    return { data };
  }

  async getPropertyOfDestination(destinationId: number, query: GetMany) {
    const destination = this.treeRepository.create();
    destination.id = destinationId;

    const queryTree = await this.treeRepository.findDescendantsTree(destination);

    const id = [];
    if (queryTree.child.length > 0) {
      if (queryTree.child[0].child.length > 0) {
        queryTree.child.forEach(child => {
          child.child.forEach(subChild => {
            id.push(subChild.id);
          });
        });
      } else {
        queryTree.child.forEach(child => {
          id.push(child.id);
        });
      }
    } else {
      id.push(destinationId);
    }
    const temp = await this.getManyData(query, [], { destinationId: In(id) }, true, {
      order: { id: 'DESC' }
    });
    return temp;
  }

  async getPropertyWithDestinationName(name: string, query: GetMany) {
    const destinations = await this.destinationRepo.findOne({
      where: { name: Like(`%${name}%`) },
      relations: ['child', 'child.child']
    });
    if (!destinations) {
      return {
        count: 0,
        total: 0,
        page: 1,
        pageCount: 1,
        result: []
      };
    }

    const id = [];
    if (destinations.child.length > 0) {
      if (destinations.child[0].child.length > 0) {
        destinations.child.forEach(child => {
          child.child.forEach(subChild => {
            id.push(subChild.id);
          });
        });
      } else {
        destinations.child.forEach(child => {
          id.push(child.id);
        });
      }
    } else {
      id.push(destinations.id);
    }
    const temp = await this.getManyData(query, ['category', 'destination', 'destination.parent', 'destination.parent.parent', 'owner'], { destinationId: In(id) }, true, {
      order: { id: 'DESC' }
    });
    return temp;
  }

  async getPropertyOfCategory(categoryId: number, query: GetMany) {
    const temp = await this.getManyData(query, [], { categoryId }, true, { order: { id: 'DESC' } });
    return temp;
  }

  async getPropertyNearMe(
    latitude: number,
    longtitude: number,
    subDistrict: string,
    query: GetMany
  ) {
    // let { limit, page, offset } = query;
    // if (limit === undefined) limit = 15;
    // if (offset === undefined) offset = 0;
    // if (page === undefined && offset === undefined) {
    //   offset = 0;
    //   page = 1;
    // } else if (offset === undefined) {
    //   offset = limit * (page - 1);
    // } else {
    //   page = Math.trunc(offset / limit) + 1;
    // }
    const result = await this.getPropertyWithDestinationName(subDistrict, query);
    return result;
    // const data = result[0];
    // const count = data.length;
    // const total = result[1];
    // const pageCount = Math.ceil(total / limit);
    // return {
    //   count,
    //   total,
    //   page,
    //   pageCount,
    //   data
    // };
  }

  async getPropertyOfUser(ownerId: number, query: GetMany): Promise<any> {
    const temp = await this.getManyData(
      query,
      ['destination', 'destination.parent', 'destination.parent.parent'],
      { ownerId },
      true,
      { order: { id: 'DESC' } }
    );
    return temp;
  }

  async getPropertyRS(userId, limit, offset, cityId) {
    // console.log('userId :>> ', userId);
    const userReq = new UserRequest();
    userReq.setId(`${userId}`);
    const res = await clientService.getItemRecommended(userReq);
    if (res.getItemidsList()?.length > 0) {
      const [result, total] = await this.repository.getPropertyRS(res.getItemidsList(), limit, offset, cityId);
      // const [result, total] = await this.repository.getPropertyRS([1, 7, 2], limit, offset);
      return {
        data: result,
        total
      };
    }
    return {
      data: [],
      total: 0
    };
  }
}
