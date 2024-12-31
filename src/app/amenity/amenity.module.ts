import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Amenity } from '@src/entities/amenity.entity';
import { AmenityService } from './amenity.service';
import { AmenityController } from './amenity.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Amenity])],
  providers: [AmenityService],
  exports: [AmenityService],
  controllers: [AmenityController]
})
export class AmenityModule {}
