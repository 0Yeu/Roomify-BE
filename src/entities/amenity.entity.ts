import { ApiProperty } from '@nestjs/swagger';
import { CrudValidationGroups } from '@nestjsx/crud';
import { IsOptional, IsNotEmpty } from 'class-validator';
import { Column, Entity, ManyToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Property } from './property.entity';
import { Room } from './room.entity';

const { CREATE, UPDATE } = CrudValidationGroups;
@Entity('amenities')
export class Amenity extends BaseEntity {
  @ApiProperty({ example: 'Category1' })
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @Column()
  name: string;

  @ApiProperty({ example: 'icon-name' })
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @Column()
  iconName: string

  @ApiProperty({ example: 'material' })
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @Column()
  iconType: string

  @ApiProperty({ example: 'material' })
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @Column()
  iconWeb: string

  @ApiProperty({ readOnly: true })
  @ManyToMany(() => Room, (room: Room) => room.amenities)
  rooms: Room[];
}
