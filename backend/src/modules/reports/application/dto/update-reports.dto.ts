import { PartialType } from '@nestjs/swagger';
import { CreateReportsDto } from './create-reports.dto';

export class UpdateReportsDto extends PartialType(CreateReportsDto) {}
