import { OwnerStatus } from "@src/common/enums/ownerStatus.enum";
import { Transform } from "class-transformer";
import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateOwnerRegistrationDto {
  // @IsOptional()
  // @Transform(parseInt)
  // @IsNumber()
  // IDNumber: number

  @IsOptional()
  @IsEnum(OwnerStatus)
  status: string
}
