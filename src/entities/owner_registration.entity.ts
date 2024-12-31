import { ApiProperty } from '@nestjs/swagger';
import { CrudValidationGroups } from '@nestjsx/crud';
import { IsOptional, IsEmpty, IsNotEmpty } from 'class-validator';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { OwnerStatus } from '../common/enums/ownerStatus.enum';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

const { CREATE, UPDATE } = CrudValidationGroups;

@Entity('owner_registration')
export class OwnerRegistration extends BaseEntity {

  @ApiProperty({ enum: OwnerStatus })
  @Column({
    type: 'enum',
    enum: OwnerStatus,
    default: OwnerStatus.PENDING
  })
  status: string

  @ApiProperty({ required: true, example: '123456789' })
  @IsEmpty({ groups: [UPDATE] })
  @Column()
  IDNumber: number

  @Column()
  nameOwner: string

  @Column('text', { array: true })
  householdRegistrationImgs: string[]

  @ApiProperty({ type: () => User, readOnly: true })
  @IsEmpty()
  @OneToOne(() => User)
  @JoinColumn()
  user: User

}
