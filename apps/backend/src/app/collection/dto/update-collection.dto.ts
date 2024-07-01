import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateCollectionDto } from './create-collection.dto';
import { MaxLength, IsInt } from 'class-validator';

export class UpdateCollectionDto {
  @ApiProperty()
  @IsInt()
  id: number;

  @ApiProperty({
    required: true,
  })
  @MaxLength(255)
  name: string;
}
