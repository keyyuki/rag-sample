import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, MaxLength } from 'class-validator';

export class CreateCollectionDto {
  @ApiProperty({
    required: true,
  })
  @MaxLength(255)
  name: string;
}
