import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNumber, IsOptional } from "class-validator";

export class GetMany {
  @IsOptional()
  @Transform(parseInt)
  @IsNumber()
  limit?: number

  @IsOptional()
  @Transform(parseInt)
  @IsNumber()
  offset?: number

  @IsOptional()
  @Transform(parseInt)
  @IsNumber()
  page?: number
}
