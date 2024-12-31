import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { BaseService } from '@src/base.service';
import { RoomStatus } from '@src/common/enums/roomStatus.enum';
import { Role } from '@src/entities/roles.entity';
import { Room } from '@src/entities/room.entity';
import { CreateRoom } from '@src/models/room/create.dto';
import { UpdateRoom } from '@src/models/room/update.dto';
import admin from 'firebase-admin';
import { AmenityRepository } from '../amenity/amenity.repository';
import { NotificationRepository } from '../notification/notification.repository';
import { PropertyRepository } from '../property/property.repository';
import { RoomRepository } from './room.repository';

@Injectable()
export class RoomService extends BaseService<Room, RoomRepository> {
  constructor(
    protected repository: RoomRepository,
    private readonly amenityRepository: AmenityRepository,
    private readonly propertyRepository: PropertyRepository,
    private readonly notiRepo: NotificationRepository
  ) {
    super(repository);
  }

  async getOneRoom(id: number, roles: Role[]): Promise<Room> {
    console.log(roles);
    let query;
    const hashTable = {};
    for(let i = 0; i < roles.length; i += 1) {
      hashTable[roles[i].name] = 1;
    }
    if(hashTable['OWNER'] === 1 || hashTable['ADMIN'] === 1 || hashTable['MODERATOR'] === 1) {
      query = this.repository.findOne({
        where: { id },
        relations: ['amenities']
      });
    }
    else {
      query = this.repository.findOne({
        where: { id, status: RoomStatus.OPEN },
        relations: ['amenities']
      });
    }
    const room = await query;
    if (!room) throw new NotFoundException('Room not found !!!');
    return room;
  }

  async createRoom(data: CreateRoom, userId: number): Promise<Room> {
    const property = await this.propertyRepository.findOne({
      where: { id: data.propertyId },
      relations: ['rooms', 'owner', 'favoriteProperty', 'favoriteProperty.user']
    });
    if (!property) throw new NotFoundException('Property not found');
    if (userId !== property.owner.id)
      throw new ForbiddenException("Can't create room of property's others");
    const amenities = await this.amenityRepository.findByIds(data.amenityIds);
    const room = this.repository.create();
    room.name = data.name;
    room.price = data.price;
    room.status = 'OPEN';
    room.area = data.area;
    room.images = data.images;
    room.description = data.description;
    room.amenities = amenities;
    room.property = property;
    const result = await this.repository.save(room);
    // const registrations = [];
    for (let i = 0; i < property.favoriteProperty.length; i += 1) {
      if (property.favoriteProperty[i].user.registrationToken) {
        // registrations.concat(property.favoriteProperty[i].user.registrationToken);
        this.notiRepo.save({
          title: 'Nơi bạn thích có thay đổi',
          description: `Nơi có tên ${property.title} đã được tạo thêm phòng mới`,
          userId: property.favoriteProperty[i].user.id
        });
        admin.messaging().sendToDevice(property.favoriteProperty[i].user.registrationToken, {
          notification: {
            title: 'Nơi bạn thích có thay đổi',
            body: `Nơi có tên ${property.title} đã được tạo thêm phòng mới`
          }
        });
      }
    }
    const tempProperty = this.propertyRepository.create();
    tempProperty.id = property.id;
    result.property = tempProperty;
    return result;
  }

  async updateRoom(data: UpdateRoom, id: number): Promise<Room> {
    const room = await this.repository.findOne({
      where: { id },
      relations: ['property', 'property.favoriteProperty', 'property.favoriteProperty.user', 'property.rooms']
    });
    if (!room) throw new NotFoundException('Room not found');
    const { property } = room;
    if (data.amenityIds) {
      const amenities = await this.amenityRepository.findByIds(data.amenityIds);
      room.amenities = amenities;
    }
    if (data.area) room.area = data.area;
    if (data.images) room.images = data.images;
    if (data.name) room.name = data.name;
    if (data.price) room.price = data.price;
    if (data.status) {
      if (data.status === 'CLOSE' && room.status === 'OPEN') {
        // const registrations = [];
        for (let i = 0; i < property.favoriteProperty.length; i += 1) {
          if (property.favoriteProperty[i].user.registrationToken) {
            // registrations.concat(property.favoriteProperty[i].user.registrationToken);
            this.notiRepo.save({
              title: 'Nơi bạn thích có thay đổi',
              description: `Phòng có tên ${room.name} thuộc căn hộ ${property.title} đã có người thuê`,
              userId: property.favoriteProperty[i].user.id
            });
            admin.messaging().sendToDevice(property.favoriteProperty[i].user.registrationToken, {
              notification: {
                title: 'Nơi bạn thích có thay đổi',
                body: `Phòng có tên ${room.name} thuộc căn hộ ${property.title} đã có người thuê`
              }
            });
          }
        }
      }
      room.status = data.status;
    }
    if (data.description) room.description = data.description;
    const result = await this.repository.save(room);
    result.property = undefined;
    return result;
  }
}
