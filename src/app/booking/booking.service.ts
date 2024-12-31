import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { BaseService } from '@src/base.service';
import { NotificationMessageEnum } from '@src/common/enums/notification.enum';
import { Bookings } from '@src/entities/bookings.entity';
import { Property } from '@src/entities/property.entity';
import { GetMany } from '@src/models/base/getMany.dto';
import { IResponseFormat } from '@src/models/base/response.interface';
import admin from 'firebase-admin';
import { In } from 'typeorm';
import { Check } from '@models/rs_pb';
import { UserRatingRepository } from '../user-rating/user-rating.repository';
import { NotificationRepository } from '../notification/notification.repository';
import { RoomRepository } from '../room/room.repository';
import { BookingRepository } from './booking.respository';
import { UserRatingEnum } from '../../common/enums/userRating.enum';
import { clientService } from '../../../route.serive';
@Injectable()
export class BookingService extends BaseService<Bookings, BookingRepository> {
  constructor(
    protected readonly repository: BookingRepository,
    private readonly roomRepository: RoomRepository,
    private readonly notificationRepo: NotificationRepository,
    private readonly userRatingRepo: UserRatingRepository
  ) {
    super(repository);
  }

  async create(userId: number, roomId: number, phone: string): Promise<IResponseFormat<Bookings>> {
    const checkRoom = await this.roomRepository.findOne({
      where: { id: roomId },
      relations: ['property', 'property.owner']
    });
    console.log('checkRoom :>> ', checkRoom?.property?.id);
    if (!checkRoom) throw new NotFoundException('Room not found !!!');
    const query = await this.repository.findOne({
      where: { roomId, userId, transactionId: null, isChecked: false },
      order: { updatedAt: 'DESC' }
    });
    if (query) {
      const date = new Date();
      if (
        date.getFullYear() === query.updatedAt.getFullYear() &&
        date.getMonth() === query.updatedAt.getMonth() &&
        date.getDay() - query.updatedAt.getDay() < 2
      ) {
        const time =
          date.getHours() -
          query.updatedAt.getHours() +
          (date.getDay() - query.updatedAt.getDay()) * 24;
        if (time < 24)
          throw new ForbiddenException(
            `Bạn đã đặt cọc phòng này. Vui long đợi ${24 - time}h để thực hiện lại`
          );
      }

      const data = await this.repository.save({ id: query.id, updatedAt: date });
      return { data };
    }

    const data = await this.repository.save({ user: { id: userId }, room: { id: roomId }, ownerId: checkRoom.property.ownerId });
    await this.userRatingRepo.save({ userId, propertyId: checkRoom?.property?.id, rating: UserRatingEnum.BOOKING });
    const check = new Check();
    check.setMessage('change');
    clientService.trackChange(check);
    if (checkRoom.property.owner.registrationToken) {
      this.notificationRepo.save({
        title: NotificationMessageEnum.Title_Booking,
        description: `Người dùng với số điện thoại: ${phone} đã đặt phòng của bạn !!! Hãy liên hệ với họ`,
        userId: checkRoom.property.ownerId
      });

      admin
        .messaging()
        .sendToDevice(checkRoom.property.owner.registrationToken, {
          notification: {
            title: NotificationMessageEnum.Title_Booking,
            body: `Người dùng với số điện thoại: ${phone} đã đặt phòng của bạn !!! Hãy liên hệ với họ`
          }
        }).then(res => {
          console.log(res.results);
        });
    }

    return { data };
  }

  async getBookingWithOwner(ownerId: number, query: GetMany) {
    const rooms = await this.roomRepository.findRoomWithOwner(ownerId);
    const roomIds = [];
    for (let i = 0; i < rooms.length; i += 1) {
      roomIds.push(rooms[i].id);
    }
    const temp = await this.getManyData(query, ['user', 'room'], {
      roomId: In(roomIds.length > 0 ? roomIds : [0])
    });
    return temp;
  }

  async getBookingWithUser(userId: number, query: GetMany) {
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
    const temp = await this.repository.getBookingWithUser(userId, limit, offset);
    const data = temp[0];
    const count = data.length;
    const total = temp[1];
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
