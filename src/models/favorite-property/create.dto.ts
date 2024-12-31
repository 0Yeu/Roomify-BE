import { ApiProperty } from '@nestjs/swagger';
import { ExistedPropertyValidator } from '@src/validators/favorite-property/existedProperty.validator';
import { IsNotEmpty, IsNumber, Validate } from 'class-validator';

export class CreateFavorite {
  @ApiProperty({ example: 2 })
  @IsNotEmpty()
  @IsNumber()
  @Validate(ExistedPropertyValidator)
  propertyId: number
}
