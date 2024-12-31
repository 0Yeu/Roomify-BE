import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@src/entities/roles.entity';
import { CheckRoleOfUser } from '@src/validators/users/create-user-role.validator';
import { ExistedUsernameValidator } from '@src/validators/users/exist-username.validator';
import { IsString, IsEmail, IsMobilePhone, IsObject, Validate, IsNotEmpty, IsOptional, IsNumber, Length } from 'class-validator';

export class CreateUserDTO {
  @ApiProperty({ example: 'Admin' })
  @IsNotEmpty()
  @IsString()
  @Length(3, 50, { message: 'Name of Owner must be greater than 3 and less than 50' })
  fullName: string;

  @ApiProperty({ example: 'admin' })
  @IsNotEmpty()
  @IsString()
  @Validate(ExistedUsernameValidator, { message: 'Username already exists' })
  username: string;

  @ApiProperty({ example: 'member@gmail.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'admin', writeOnly: true })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({ example: '0981234899' })
  @IsNotEmpty()
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

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  @Validate(CheckRoleOfUser)
  roleId: number;

}
