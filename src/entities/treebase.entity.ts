import { IsOptional, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from './base.entity';

export abstract class TreeBase extends BaseEntity {
  @ApiProperty({ example: 0 })
  @IsOptional()
  @IsInt()
  parentId: number;
}
