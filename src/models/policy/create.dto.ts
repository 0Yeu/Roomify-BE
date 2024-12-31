import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

export class CreatePolicyDto {
  @IsNotEmpty()
  @IsNumber()
  @Max(999999)
  @Min(1000)
  electricity: number

  @IsNotEmpty()
  @IsNumber()
  @Max(999999)
  @Min(1000)
  water: number

  @IsNotEmpty()
  @IsNumber()
  @Max(999999)
  @Min(1000)
  parking: number

  @IsNotEmpty()
  @IsNumber()
  @Max(999999)
  @Min(1000)
  internet: number
}
