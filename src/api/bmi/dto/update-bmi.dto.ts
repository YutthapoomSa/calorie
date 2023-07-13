import { PartialType } from '@nestjs/swagger';
import { CreateBmiDto } from './create-bmi.dto';

export class UpdateBmiDto extends PartialType(CreateBmiDto) {}
