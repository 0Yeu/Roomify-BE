import { Entity, ManyToOne, JoinColumn, Column, ManyToMany, OneToMany } from 'typeorm';
import { from } from 'rxjs';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsNotEmpty } from 'class-validator';
import { CrudValidationGroups } from '@nestjsx/crud';
import { BaseEntity } from './base.entity';
import { Module } from './module.entity';
import { Method } from './method.entity';
import { Role } from './roles.entity';
import { UserPermission } from './user-permission.entity';

const { UPDATE, CREATE } = CrudValidationGroups;
@Entity('permissions')
export class Permission extends BaseEntity {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @Column()
  methodId: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @Column()
  moduleId: number;

  @ManyToOne(
    type => Module,
    module => module.permissions,
    { eager: true }
  )
  @JoinColumn({ name: 'moduleId' })
  module: Module;

  @ManyToOne(
    type => Method,
    method => method.permissions,
    { eager: true }
  )
  @JoinColumn({ name: 'methodId' })
  method: Method;

  @ManyToMany(
    type => Role,
    role => role.permissions
  )
  roles: Role[];

  @OneToMany(
    type => UserPermission,
    userpermission => userpermission.permission
  )
  userPermissions: Array<UserPermission>
}
