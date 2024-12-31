import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from '@src/entities/room.entity';
import { AmenityRepository } from '../amenity/amenity.repository';
import { NotificationRepository } from '../notification/notification.repository';
import { PropertyRepository } from '../property/property.repository';
import { RoomController } from './room.controller';
import { RoomRepository } from './room.repository';
import { RoomService } from './room.service';

@Module({
  imports: [TypeOrmModule.forFeature([RoomRepository, AmenityRepository, PropertyRepository, NotificationRepository])],
  controllers: [RoomController],
  providers: [RoomService],
  exports: [RoomService]
})
export class RoomModule {}
