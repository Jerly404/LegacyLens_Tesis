import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateAnalyzerDto {
  @ApiProperty({ description: 'Name of the analyzer item' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Optional description', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}
