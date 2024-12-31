import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Destination } from '@src/entities/destinations.entity';
import { UserRatingRepository } from '../user-rating/user-rating.repository';
import { PropertyService } from './property.service';
import { PropertyController } from './property.controller';
import { PropertyRepository } from './property.repository';
import { OwnerPropertiesController } from './owner-properties.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PropertyRepository, Destination, UserRatingRepository])],
  providers: [PropertyService],
  controllers: [PropertyController, OwnerPropertiesController],
  exports: [PropertyService]
})
export class PropertyModule {}
