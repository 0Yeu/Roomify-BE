// eslint-disable-next-line max-classes-per-file
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Validate } from 'class-validator';

export class AddDeletePermissions {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: 2 })
  userId: number

  @IsNotEmpty()
  @ApiProperty({ example: [2, 3] })
  permissionIds: number[]
}
