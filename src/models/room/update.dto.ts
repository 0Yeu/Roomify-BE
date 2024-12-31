import { ApiProperty } from '@nestjs/swagger';
import { RoomStatus } from '@src/common/enums/roomStatus.enum';
import { enumToArray } from '@src/utils/helper';
import { IsString, IsNumber, IsOptional, IsArray, IsIn } from 'class-validator';

export class UpdateRoom {
  @ApiProperty({ example: 'Chung cu' })
  @IsOptional()
  @IsString()
  name: string

  @ApiProperty({ example: 95.37 })
  @IsOptional()
  @IsNumber()
  price: number

  @ApiProperty({ example: 95.37 })
  @IsOptional()
  @IsNumber()
  area: number

  @ApiProperty({ example: 'lorem ipsum ....' })
  @IsOptional()
  @IsString()
  description: string

  @ApiProperty({ example: 'OPEN' })
  @IsOptional()
  @IsIn(enumToArray(RoomStatus))
  status: string;

  @ApiProperty({ example: ['https://lh3.googleusercontent.com/50RuktOOgpl8k61d_IEbYGUvewvlrD6kzhMCzPQ19dAU589lTUKV3OecQOfRnVO2PfMZyHC2FeXfDRWY=w1080-h608-p-no-v0'] })
  @IsOptional()
  @IsArray()
  images: Array<string>

  @ApiProperty({ example: [1, 2, 3, 4] })
  @IsOptional()
  @IsArray()
  amenityIds: number[]
}
