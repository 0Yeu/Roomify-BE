import { ApiProperty } from '@nestjs/swagger';
import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  BaseEntity as BaseEntityTypeOrm
} from 'typeorm';

export abstract class BaseEntity extends BaseEntityTypeOrm {
  @ApiProperty({ readOnly: true })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ readOnly: true })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ readOnly: true })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({ readOnly: true })
  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;
}
