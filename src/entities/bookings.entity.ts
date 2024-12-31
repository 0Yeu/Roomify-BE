import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Room } from './room.entity';
import { Transaction } from './transaction.entity';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

@Entity('bookings')
export class Bookings extends BaseEntity {
  @ApiProperty({ readOnly: true, type: () => User })
  @ManyToOne(() => User, (user: User) => user.bookings)
  @JoinColumn({ name: 'userId' })
  user: User

  @ApiProperty({ readOnly: true })
  @Column()
  userId: number

  @ApiProperty({ readOnly: true, type: () => Room })
  @ManyToOne(() => Room, (room: Room) => room.bookings)
  @JoinColumn({ name: 'roomId' })
  room: Room

  @ApiProperty({ readOnly: true })
  @Column()
  roomId: number

  @ApiProperty({ readOnly: true })
  @Column()
  ownerId: number

  @ApiProperty({ readOnly: true })
  @ManyToOne(() => Transaction, (transaction: Transaction) => transaction.bookings)
  @JoinColumn({ name: 'transactionId' })
  transaction: Transaction

  @ApiProperty({ readOnly: true })
  @Column({ nullable: true })
  transactionId: number

  @Column({ default: false })
  isChecked: boolean
}
