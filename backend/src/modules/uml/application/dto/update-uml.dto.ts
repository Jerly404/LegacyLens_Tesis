import { PartialType } from '@nestjs/swagger';
import { CreateUmlDto } from './create-uml.dto';

export class UpdateUmlDto extends PartialType(CreateUmlDto) {}
