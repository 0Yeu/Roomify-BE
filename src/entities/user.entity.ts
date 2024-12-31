import { ManyToMany, JoinTable, Entity, Column, OneToMany, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsNotEmpty,
  IsString,
  IsEmail,
  IsIn,
  IsNumber,
  IsMobilePhone,
  IsObject,
  Validate
} from 'class-validator';
import { CrudValidationGroups } from '@nestjsx/crud';
import { BaseEntity } from './base.entity';
import { Role } from './roles.entity';
import { UserStatus } from '../common/enums/userStatus.enum';
import { enumToArray } from '../utils/helper';
import { Property } from './property.entity';
import { UserPermission } from './user-permission.entity';
import { Bookings } from './bookings.entity';
import { Roommate } from './roommate.entity';
import { OwnerRegistration } from './owner_registration.entity';
import { FavoriteProperty } from './favorite_property.entity';
import { Notification } from './notification.entity';
import { Transaction } from './transaction.entity';

const { CREATE, UPDATE } = CrudValidationGroups;
@Entity('users')
export class User extends BaseEntity {
  @ApiProperty({ example: 'Admin' })
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsString()
  @Column()
  fullName: string;

  @ApiProperty({ example: 'admin' })
  @IsOptional({ groups: [UPDATE, CREATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsString()
  @Column({ unique: true })
  username: string;

  @ApiProperty({ example: 'member@gmail.com' })
  @IsOptional({ groups: [UPDATE] })
  // @IsNotEmpty({ groups: [CREATE] })
  @IsEmail()
  @Column({ nullable: true })
  email: string;

  @ApiProperty({ example: '123456', writeOnly: true })
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsString()
  @Column({ select: false })
  password: string;

  @ApiProperty({ example: '0981234899' })
  @IsOptional({ groups: [UPDATE] })
  // @IsNotEmpty({ groups: [CREATE] })
  @IsString()
  @IsMobilePhone('vi-VN')
  @Column({ nullable: true })
  phone: string;

  @ApiProperty({
    example:
      'https://cdn1.iconfinder.com/data/icons/ui-icon-part-2/128/user-512.png'
  })
  @IsOptional({ groups: [UPDATE] })
  // @IsNotEmpty({ groups: [CREATE] })
  @IsString()
  @Column({
    default:
      'https://cdn1.iconfinder.com/data/icons/ui-icon-part-2/128/user-512.png',
    nullable: true
  })
  avatar: string;

  @ApiProperty({ readOnly: true })
  @IsOptional({ groups: [UPDATE] })
  @IsIn(enumToArray(UserStatus))
  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE
  })
  status: string;

  @Column('text', { array: true, nullable: true })
  registrationToken: Array<string>

  @ApiProperty({ readOnly: true })
  @IsOptional()
  @IsNumber({}, { each: true })
  roleIds: Array<number>;

  @ApiProperty({ example: { id: 1 } })
  @IsOptional({ groups: [UPDATE] })
  @IsObject()
  @ManyToMany(
    () => Role,
    (role: Role) => role.users,
    { cascade: true }
  )
  @JoinTable({ name: 'user_role' })
  roles: Role[];

  @ApiProperty({ readOnly: true })
  @OneToMany(
    () => Property,
    (property: Property) => property.owner
  )
  properties: Array<Property>;

  @ApiProperty({ readOnly: true })
  @OneToMany(
    () => UserPermission,
    (userpermission: UserPermission) => userpermission.user
  )
  userPermissions: Array<UserPermission>;

  @ApiProperty({ readOnly: true })
  @OneToMany(
    () => Bookings,
    (booking: Bookings) => booking.user
  )
  bookings: Array<Bookings>;

  @ApiProperty({ readOnly: true })
  @OneToMany(
    () => Roommate,
    (roommate: Roommate) => roommate.user
  )
  roommates: Roommate[];

  @ApiProperty({ readOnly: true })
  @OneToMany(
    () => FavoriteProperty,
    (favoriteProperty: FavoriteProperty) => favoriteProperty.user
  )
  favorteProperty: FavoriteProperty[];

  // @ApiProperty({ readOnly: true })
  // @OneToMany(
  //   () => UserRating,
  //   (userRating: UserRating) => userRating.user
  // )
  // userRating: UserRating[];

  @ApiProperty({ readOnly: true })
  @OneToOne(() => OwnerRegistration)
  @JoinColumn()
  ownerRegistration: OwnerRegistration;

  @OneToMany(() => Notification, (notification: Notification) => notification.user)
  notification: Notification[]

  @OneToMany(() => Transaction, (transaction: Transaction) => transaction.owner)
  transaction: Transaction[]
}
