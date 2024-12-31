import { ApiProperty } from '@nestjs/swagger';

export class UploadFilePropertyDto {

  @ApiProperty({ type: 'string', format: 'binary' })
  image: any
}
