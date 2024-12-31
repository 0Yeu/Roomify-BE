import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common';
import { BaseService } from '@src/base.service';
import { OwnerRegistration } from '@src/entities/owner_registration.entity';
import { CreateOwnerRegistrationDto } from '@src/models/owner-registration/create.dto';
import { UpdateOwnerRegistrationDto } from '@src/models/owner-registration/update.dto';
import { UserRequestDto } from '@src/models/users/user-request.dto';
import admin from 'firebase-admin';
import { OwnerRegistrationRepository } from './owner-registration.repository';
import { OwnerStatus } from '../../common/enums/ownerStatus.enum';
import { UserRepository } from '../user/user.repository';
import { NotificationRepository } from '../notification/notification.repository';
import { NotificationMessageEnum } from '@src/common/enums/notification.enum';

@Injectable()
export class OwnerRegistrationService extends BaseService<
  OwnerRegistration,
  OwnerRegistrationRepository
> {
  constructor(
    protected repository: OwnerRegistrationRepository,
    private readonly userRepo: UserRepository,
    private readonly notificationRepo: NotificationRepository
  ) {
    super(repository);
  }

  async create(data: CreateOwnerRegistrationDto, req: UserRequestDto) {
    for (let i = 0; i < req.user.roles.length; i += 1) {
      if (
        req.user.roles[i].name === 'OWNER' ||
        req.user.roles[i].name === 'ADMIN' ||
        req.user.roles[i].name === 'MODERATOR'
      )
        throw new ForbiddenException('Your account can allow to do it');
    }
    const query = await this.repository.findOne({ where: { IDNumber: data.IDNumber } });
    if (query) throw new BadRequestException('Your ID Number was registered. Please try again');
    try {
      const result = await this.repository.save({ ...data, user: { id: req.user.id } });
      return result;
    } catch (error) {
      console.log('CATCH ---->', error);
      if (error.code === '23505')
        throw new ForbiddenException('User has sent request to adminstrator');
      throw new InternalServerErrorException();
    }
  }

  async delete(id: number) {
    const query = await this.repository.findOne({ where: { id }, relations: ['user'] });
    if (!query) throw new NotFoundException('Request owner not found');
    await this.repository.delete(id);
    if (query.status === OwnerStatus.ACCEPT) {
      const userQuery = await this.userRepo.findOne({
        where: { id: query.user.id },
        relations: ['roles']
      });
      for (let i = 0; i < userQuery.roles.length; i += 1) {
        if (userQuery.roles[i].name === 'OWNER') {
          userQuery.roles[i] = undefined;
          break;
        }
      }
      await this.userRepo.save(userQuery);
    }
  }

  async update(id: number, data: UpdateOwnerRegistrationDto) {
    const query = await this.repository.findOne({ where: { id }, relations: ['user'] });
    if (!query) throw new NotFoundException('Không tìm thấy chủ sở hữu');
    // if(data.IDNumber) query.IDNumber = data.IDNumber;
    if (
      data.status !== undefined &&
      data.status === OwnerStatus.PENDING &&
      query.status === OwnerStatus.ACCEPT
    )
      throw new ForbiddenException('Không thể chỉnh sửa yêu cầu đã được chấp nhận');
    if (data.status !== undefined && data.status === OwnerStatus.ACCEPT) {
      query.status = data.status;
      const userQuery = await this.userRepo.findOne({
        where: { id: query.user.id },
        relations: ['roles']
      });
      const roleId = [];
      roleId.push({ id: 3 });
      userQuery.roles.forEach(role => {
        roleId.push({ id: role.id });
      });
      const result = await this.repository.save(query);
      this.userRepo.save({ ...userQuery, roles: roleId });
      if (query.user.registrationToken) {
        admin.messaging().sendToDevice(query.user.registrationToken, {
          notification: {
            title: NotificationMessageEnum.Title_Owner_Upgrade,
            body: NotificationMessageEnum.Description_Owner_Upgrade
          }
        });
        this.notificationRepo.save({
          title: NotificationMessageEnum.Title_Owner_Upgrade,
          description: NotificationMessageEnum.Description_Owner_Upgrade,
          userId: query.user.id
        });
      }

      return result;
    }
    return query;
  }
}
