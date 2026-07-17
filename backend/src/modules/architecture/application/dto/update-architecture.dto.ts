import { PartialType } from '@nestjs/swagger';
import { CreateArchitectureDto } from './create-architecture.dto';

export class UpdateArchitectureDto extends PartialType(CreateArchitectureDto) {}
