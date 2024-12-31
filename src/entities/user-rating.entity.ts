import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn
} from 'typeorm';

@Entity('user_rating')
export class UserRating extends BaseEntity {
  @ApiProperty({ readOnly: true })
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  propertyId: number;

  @Column()
  rating: number;
}
