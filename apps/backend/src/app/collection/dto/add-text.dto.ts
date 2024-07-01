import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, MaxLength } from 'class-validator';

export class AddTextDto {
  @ApiProperty({
    required: true,
  })
  content: string;
}
