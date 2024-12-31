import { JoinTable, Entity, Column, ManyToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.entity';
import { Permission } from './permission.entity';

import { BaseEntity } from './base.entity';

@Entity('roles')
export class Role extends BaseEntity {
  @ApiProperty({
    example: 'ADMIN',
    description: "The name of user's role"
  })
  @Column()
  name: string;

  @ApiProperty({
    example: 'This is a description',
    description: 'The content of decription'
  })
  @Column()
  description: string;

  @ManyToMany(() => Permission, (permission: Permission) => permission.roles, { cascade: true })
  @JoinTable({ name: 'role_permission' })
  permissions: Permission[];

  @ManyToMany(
    type => User,
    user => user.roles
  )
  users: User[];
}
