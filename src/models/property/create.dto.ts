import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Policy } from '@src/entities/policy.entity';
import { ExistedDestinationValidator } from '@src/validators/property/exist-destination.validator';
import { PolicyValidator } from '@src/validators/property/policy.validation';
import { IsString, IsNumber, IsNotEmpty, IsOptional, IsObject, Validate, IsNotEmptyObject, validate } from 'class-validator';
import { DontExistedCategoryValidator } from '../../validators/property/exist-category.validation';

export class CreatePropertyDTO {
  @ApiProperty({ example: 'Chung cu' })
  @IsNotEmpty()
  @IsString()
  title: string

  @ApiProperty({ example: 'Lorem idolt ...' })
  @IsString()
  description: string

  @ApiProperty({ example: 95.37 })
  @IsNumber()
  longitude: number

  @ApiProperty({ example: 95.37 })
  @IsNumber()
  latitude: number

  @ApiProperty({ example: '123 Nguyen Luong Bang' })
  @IsNotEmpty()
  @IsString()
  address: string

  @ApiProperty({ example: 'https://c8.alamy.com/comp/JX2THD/residential-building-beauty-cottage-devon-rural-scene-thatched-roof-JX2THD.jpg' })
  @IsOptional()
  @IsString()
  thumbnail: string

  // @ApiProperty({ example: { id: 1 } })
  // @IsNotEmpty()
  // @IsObject()
  // @Validate(ExistedDestinationValidator)
  // destination: Destination

  // @ApiProperty({ example: { id: 1 } })
  // @IsNotEmpty()
  // @IsObject()
  // @Validate(DontExistedCategoryValidator)
  // category: Category

  @ApiProperty({ example: 100 })
  @IsNotEmpty()
  @IsNumber()
  @Validate(ExistedDestinationValidator)
  destinationId: number

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  @Validate(DontExistedCategoryValidator)
  categoryId: number

  @IsNotEmptyObject()
  @IsObject()
  @Validate(PolicyValidator)
  policy: Policy
}
