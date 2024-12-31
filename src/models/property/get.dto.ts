import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class GetRSPropertyDTO {
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

  @IsOptional()
  @Transform(parseInt)
  @IsNumber()
  cityId?: number
}
