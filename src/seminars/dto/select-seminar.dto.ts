import { PartialType } from '@nestjs/mapped-types';
import { CreateSeminarDto } from './create-seminar.dto';

export class SelectSeminarDto extends PartialType(CreateSeminarDto) {}
