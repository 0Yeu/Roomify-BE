import { OneToMany, Entity, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Permission } from './permission.entity';

import { BaseEntity } from './base.entity';

@Entity('methods')
export class Method extends BaseEntity {
  @ApiProperty({
    example: 'GET',
    description: 'The name of method'
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
    permission => permission.method
  )
  permissions: Permission[];
}
