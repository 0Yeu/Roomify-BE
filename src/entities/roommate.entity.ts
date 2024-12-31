import { ApiProperty } from '@nestjs/swagger';
import { CrudValidationGroups } from '@nestjsx/crud';
import { IsMobilePhone, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { Destination } from './destinations.entity';

const { UPDATE, CREATE } = CrudValidationGroups;

@Entity('roommate')
export class Roommate extends BaseEntity {
  @ApiProperty({ example: 115000 })
  @IsNotEmpty({ groups: [CREATE] })
  @IsOptional({ groups: [UPDATE] })
  @IsNumber()
  @Column('decimal', { precision: 10, scale: 2 })
  price: number

  @ApiProperty({ readOnly: true, type: () => User })
  @ManyToOne(() => User, (user: User) => user.roommates)
  @JoinColumn({ name: 'userId' })
  user: User

  @ApiProperty({ example: 1, writeOnly: true })
  @Column()
  userId: number

  @ApiProperty({ example: '0981234899' })
  @IsString()
  @IsMobilePhone('vi-VN')
  @Column({ nullable: true })
  phone: string;

  @ApiProperty({ example: 'lorem ipsum ....' })
  @Column('text')
  description: string

  @ApiProperty({ readOnly: true, type: () => Destination })
  @ManyToOne(() => Destination, (destination: Destination) => destination.roommate)
  @JoinColumn({ name: 'destinationId' })
  destination: Destination

  @ApiProperty({ example: 1, writeOnly: true })
  @Column()
  destinationId: number
}
