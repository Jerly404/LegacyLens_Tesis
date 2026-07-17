import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateAiDto {
  @ApiProperty({ description: 'Name of the ai item' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Optional description', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}
