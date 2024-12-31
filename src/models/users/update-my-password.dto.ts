import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateMyPasswordDto {
  @ApiProperty({ example: 'Admin123!' })
  @Length(5, 24)
  @IsNotEmpty()
  @IsString()
  oldPassword: string

  @IsString()
  @Length(5, 24)
  @IsNotEmpty()
  @Matches(/((?=.*\d)(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, { message: 'Password must be contain uppercase, lowercase, number and special character' })
  @ApiProperty({ example: 'Admin1234!' })
  newPassword: string
}
