import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Destination } from '@src/entities/destinations.entity';
import { RoommateController } from './roommate.controller';
import { RoommateRepository } from './roommate.repository';
import { RoommateService } from './roommate.service';

@Module({
  controllers: [RoommateController],
  providers: [RoommateService],
  imports: [TypeOrmModule.forFeature([RoommateRepository])]
})
export class RoommateModule {}
