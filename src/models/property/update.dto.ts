import { ApiProperty } from '@nestjs/swagger';
import { Policy } from '@src/entities/policy.entity';
import { ExistedDestinationValidator } from '@src/validators/property/exist-destination.validator';
import { IsString, IsNumber, IsOptional, IsObject, Validate } from 'class-validator';
import { DontExistedCategoryValidator } from '../../validators/property/exist-category.validation';

export class UpdatePropertyDTO {
  @ApiProperty({ example: 'Chung cu' })
  @IsOptional()
  @IsString()
  title: string

  @ApiProperty({ example: 'Lorem idolt ...' })
  @IsOptional()
  @IsString()
  description: string

  @ApiProperty({ example: 95.37 })
  @IsOptional()
  @IsNumber()
  longitude: number

  @ApiProperty({ example: 95.37 })
  @IsOptional()
  @IsNumber()
  latitude: number

  @ApiProperty({ example: '123 Nguyen Luong Bang' })
  @IsOptional()
  @IsString()
  address: string

  @ApiProperty({ example: 'https://c8.alamy.com/comp/JX2THD/residential-building-beauty-cottage-devon-rural-scene-thatched-roof-JX2THD.jpg' })
  @IsOptional()
  @IsString()
  thumbnail: string

  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsNumber()
  @Validate(ExistedDestinationValidator)
  destinationId: number

  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsNumber()
  @Validate(DontExistedCategoryValidator)
  categoryId: number

  @ApiProperty({ example: { id: 1, electricity: 10, water: 10, parking: 10, internet: 10 } })
  @IsOptional()
  @IsObject()
  policy: Policy
}
