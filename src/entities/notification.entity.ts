import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

@Entity('notification')
export class Notification extends BaseEntity {
  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  userId: number;

  @ManyToOne(
    () => User,
    (user: User) => user.notification
  )
  user: User;
}
