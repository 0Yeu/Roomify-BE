import { IsOptional, IsEmail, IsString, IsMobilePhone } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateMyUserDto {
  @ApiProperty({ example: 'admin' })
  @IsOptional()
  @IsString()
  fullName: string

  @ApiProperty({ example: 'admin@gmail.com' })
  @IsOptional()
  @IsString()
  @IsEmail()
  email: string

  @ApiProperty({ example: '0981234899' })
  @IsOptional()
  @IsString()
  @IsMobilePhone('vi-VN')
  phone: string;

  @ApiProperty({
    example:
      'https://microhealth.com/assets/images/illustrations/personal-user-illustration-@2x.png'
  })
  @IsOptional()
  @IsString()
  avatar: string;

}
