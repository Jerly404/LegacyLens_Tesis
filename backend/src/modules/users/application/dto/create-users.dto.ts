import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateUsersDto {
  @ApiProperty({ description: 'Name of the users item' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Optional description', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}
