import { ApiProperty } from '@nestjs/swagger';
import { CrudValidationGroups } from '@nestjsx/crud';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Bookings } from './bookings.entity';
import { User } from './user.entity';

@Entity('transactions')
export class Transaction extends BaseEntity {
  @Column()
  isPaid: boolean

  @OneToMany(() => Bookings, (booking: Bookings) => booking.transaction)
  bookings: Bookings[]

  @ManyToOne(() => User, (owner:User)=> owner.transaction)
  @JoinColumn({name: 'ownerId'})
  owner: User

  @Column()
  ownerId: number
}
