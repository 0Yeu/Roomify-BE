import { OneToMany, Entity, Column } from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from './base.entity';
import { Permission } from './permission.entity';

@Entity('modules')
export class Module extends BaseEntity {
  @ApiProperty({
    example: 'PRODUCT',
    description: 'The name of module'
  })
  @Column()
  name: string;

  @ApiProperty({
    example: 'This is a description',
    description: 'The content of decription'
  })
  @Column()
  description: string;

  @OneToMany(
    type => Permission,
    permission => permission.module
  )
  permissions: Permission[];
}
