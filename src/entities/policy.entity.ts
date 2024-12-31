import { ApiProperty } from '@nestjs/swagger';
import { CrudValidationGroups } from '@nestjsx/crud';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Property } from './property.entity';

const { UPDATE, CREATE } = CrudValidationGroups;

@Entity('policies')
export class Policy extends BaseEntity {

  @IsNumber()
  @Max(999999)
  @Min(1000)
  // @IsOptional({ groups: [UPDATE] })
  // @IsNotEmpty({ groups: [CREATE] })
  @Column('decimal', { precision: 10, scale: 2 })
  electricity: number

  @IsNumber()
  @Max(999999)
  @Min(1000)
  // @IsOptional({ groups: [UPDATE] })
  // @IsNotEmpty({ groups: [CREATE] })
  @Column('decimal', { precision: 10, scale: 2 })
  water: number

  @IsOptional()
  @IsNumber()
  @Max(999999)
  @Min(1000)
  // @IsOptional({ groups: [UPDATE] })
  // @IsNotEmpty({ groups: [CREATE] })
  @Column('decimal', { precision: 10, scale: 2 })
  parking: number

  @IsNumber()
  @Max(999999)
  @Min(1000)
  // @IsOptional({ groups: [UPDATE] })
  // @IsNotEmpty({ groups: [CREATE] })
  @Column('decimal', { precision: 10, scale: 2 })
  internet: number

  @OneToOne(() => Property, (property: Property) => property.policy)
  property: Property
}
