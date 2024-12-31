import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Property } from './property.entity';
import { User } from './user.entity';

@Entity('favorite_property')
export class FavoriteProperty extends BaseEntity {
  @Column()
  userId: number;

  @Column()
  propertyId: number;

  @ApiProperty({ readOnly: true, type: () => User })
  @ManyToOne(
    () => User,
    (user: User) => user.favorteProperty
  )
  @JoinColumn({ name: 'userId' })
  user: User;

  @ApiProperty({ readOnly: true, type: () => Property })
  @ManyToOne(
    () => Property,
    (property: Property) => property.favoriteProperty
  )
  @JoinColumn({ name: 'propertyId' })
  property: Property;
}
