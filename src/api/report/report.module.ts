import { ApiReportService } from './service/api-report.service';
import { Module } from '@nestjs/common';
import { ReportService } from './service/report.service';
import { ReportController } from './report.controller';

@Module({
  controllers: [ReportController],
  providers: [ReportService, ApiReportService],
  exports: [ReportService]
})
export class ReportModule {}
