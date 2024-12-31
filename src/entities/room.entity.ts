import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { IsString, IsNotEmpty, IsOptional, IsNumber, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CrudValidationGroups } from '@nestjsx/crud';
import { RoomStatus } from '../common/enums/roomStatus.enum';
import { enumToArray } from '../utils/helper';
import { Property } from './property.entity';
import { BaseEntity } from './base.entity';
import { Amenity } from './amenity.entity';
import { Bookings } from './bookings.entity';

const { UPDATE, CREATE } = CrudValidationGroups;
@Entity('rooms')
export class Room extends BaseEntity {
  @ApiProperty({ example: 'Chung cu' })
  @IsNotEmpty({ groups: [CREATE] })
  @IsOptional({ groups: [UPDATE] })
  @IsString()
  @Column()
  name: string

  @ApiProperty({ example: 'Lorem idolt ...' })
  @IsNotEmpty({ groups: [CREATE] })
  @IsOptional({ groups: [UPDATE] })
  @IsString()
  @Column({ nullable: true })
  slug: string

  @ApiProperty({ example: 'lorem ipsum ....' })
  @Column('text')
  description: string

  @ApiProperty({ example: 250000 })
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @Column('float')
  price: number

  @ApiProperty({ example: 95.37 })
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  area: number

  @ApiProperty({ example: ['https://lh3.googleusercontent.com/50RuktOOgpl8k61d_IEbYGUvewvlrD6kzhMCzPQ19dAU589lTUKV3OecQOfRnVO2PfMZyHC2FeXfDRWY=w1080-h608-p-no-v0'] })
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @Column('text', { array: true })
  images: Array<string>

  @ApiProperty({ example: 'OPEN' })
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsIn(enumToArray(RoomStatus))
  @Column({
    type: 'enum',
    enum: RoomStatus,
    default: RoomStatus.OPEN
  })
  status: string;

  @ApiProperty({ readOnly: true })
  @IsOptional()
  @IsNumber()
  @JoinColumn()
  propertyId: number

  @ApiProperty({ readOnly: true, type: () => Property })
  @ManyToOne(() => Property, (property: Property) => property.rooms)
  property: Property

  @ApiProperty({ readOnly: true })
  @ManyToMany(() => Amenity, (amenities: Amenity) => amenities.rooms)
  @JoinTable({ name: 'room_amenity' })
  amenities: Amenity[]

  @ApiProperty({ readOnly: true })
  @OneToMany(() => Bookings, (booking: Bookings) => booking.room)
  bookings: Bookings[]
}
