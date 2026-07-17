import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateProjectsDto {
  @ApiProperty({ description: 'Name of the projects item' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Optional description', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}
