import { IsString, IsNotEmpty, Length, Matches, Validate, IsMobilePhone } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TokenIDValidator } from '@src/validators/auth/tokenID.validator';
import { UniquePhoneValidator } from '@src/validators/auth/unique-phone.validator';
import { UniqueUsernameValidator } from '../../validators/auth/unique-username.validator';

export class RegisterDto {

  @IsNotEmpty()
  @Length(5, 30)
  @Validate(UniqueUsernameValidator, { message: 'Username already exists' })
  @ApiProperty({ example: 'admin123' })
  username: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'admin' })
  fullName: string

  @IsNotEmpty()
  @IsMobilePhone('vi-VN')
  @Validate(UniquePhoneValidator, { message: 'Phone number already exists' })
  @ApiProperty({ example: '0905009313' })
  phone: string

  @IsString()
  @IsNotEmpty()
  @Length(5, 24)
  @ApiProperty({ example: 'admin123' })
  password: string
}
