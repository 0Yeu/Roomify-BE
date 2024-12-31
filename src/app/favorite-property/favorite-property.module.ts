import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavoriteProperty } from '@src/entities/favorite_property.entity';
import { PropertyRepository } from '../property/property.repository';
import { UserRatingRepository } from '../user-rating/user-rating.repository';
import { FavoritePropertyController } from './favorite-property.controller';
import { FavoritePropertyRepository } from './favorite-property.repository';
import { FavoritePropertyService } from './favorite-property.service';

@Module({
  imports: [TypeOrmModule.forFeature([FavoritePropertyRepository, PropertyRepository, UserRatingRepository])],
  controllers: [FavoritePropertyController],
  providers: [FavoritePropertyService]
})
export class FavoritePropertyModule {}
