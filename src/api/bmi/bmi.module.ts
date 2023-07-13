import { Module } from '@nestjs/common';
import { BmiService } from './service/bmi.service';
import { BmiController } from './bmi.controller';
import { SharedModule } from './../../shared/shared.module';
import { ApiBmiService } from './service/api-bmi.service';

@Module({
  imports: [SharedModule],
  controllers: [BmiController],
  providers: [BmiService, ApiBmiService],
  exports: [BmiService]
})
export class BmiModule {}
