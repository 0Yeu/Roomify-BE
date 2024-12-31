import { ApiProperty } from '@nestjs/swagger';
import { ExistedDestinationValidator } from '@src/validators/property/exist-destination.validator';
import { IsMobilePhone, IsNotEmpty, IsNumber, IsString, Validate } from 'class-validator';

export class CreateRoomateDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: 95.111 })
  price: number

  @ApiProperty({ example: 'lorem ipsum ....' })
  @IsString()
  @IsNotEmpty()
  description: string

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  @Validate(ExistedDestinationValidator)
  destinationId: number

  @ApiProperty({ example: '0981234899' })
  @IsNotEmpty()
  @IsString()
  @IsMobilePhone('vi-VN')
  phone: string;
}
