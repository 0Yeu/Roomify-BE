import { IsString, IsNotEmpty, Length, Matches, Validate, IsMobilePhone } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TokenIDValidator } from '@src/validators/auth/tokenID.validator';
import { UniquePhoneValidator } from '../../validators/auth/unique-phone.validator';

export class RegisterPhoneDto {
  @IsNotEmpty()
  @IsMobilePhone('vi-VN')
  @Validate(UniquePhoneValidator, { message: 'Phone number already exists' })
  @ApiProperty({ example: '0905009313' })
  phone: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'admin' })
  fullName: string

  @ApiProperty({ example: 'babab21123213asd' })
  @IsString()
  @Validate(TokenIDValidator, { message: 'Token is invalid' })
  tokenID: string

  @IsString()
  @IsNotEmpty()
  @Length(5, 24)
  @Matches(/((?=.*\d)(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, { message: 'Password must be contain uppercase, lowercase, number and special character' })
  @ApiProperty({ example: 'Admin123!' })
  password: string
}
