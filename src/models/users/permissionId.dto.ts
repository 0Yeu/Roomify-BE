// eslint-disable-next-line max-classes-per-file
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class PermissionDTO {

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({example: 1})
  userId: number
  
  @IsNotEmpty()
  @IsArray()
  @ApiProperty({ example: [2, 3] })
  permissionIds: number[]
}
