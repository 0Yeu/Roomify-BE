import { ApiProperty } from '@nestjs/swagger';
import { ImageArrayValidator } from '@src/validators/owner-registration/image.validator';
import { Transform, Type } from 'class-transformer';
import { IsArray, IsInt, IsNotEmpty, IsString, Length, Max, Min, Validate, ValidateNested } from 'class-validator';

export class CreateOwnerRegistrationDto {
  @ApiProperty({ example: 123456789 })
  @IsNotEmpty()
  @Transform(parseInt)
  @IsInt()
  @Max(999999999, { message: 'ID Number must be contained 9 character' })
  @Min(100000000, { message: 'ID Number must be contained 9 character' })
  IDNumber: number

  @ApiProperty({ example: ['https://m.thebank.vn/uploads/2019/08/30/phieu-thay-doi-ho-khau-nhan-khau.png'] })
  @IsNotEmpty()
  @IsArray()
  @Validate(ImageArrayValidator)
  householdRegistrationImgs: string[]

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(3, 50, { message: 'Name of Owner must be greater than 3 and less than 50' })
  nameOwner: string

}
