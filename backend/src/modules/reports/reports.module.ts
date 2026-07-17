import { Module } from '@nestjs/common';
import { ReportsService } from './application/services/reports.service';
import { ReportsController } from './presentation/controllers/reports.controller';
import { PrismaReportsRepository } from './infrastructure/persistence/prisma-reports.repository';

@Module({
  controllers: [ReportsController],
  providers: [
    ReportsService,
    {
      provide: 'IReportsRepository',
      useClass: PrismaReportsRepository,
    },
  ],
  exports: [ReportsService],
})
export class ReportsModule {}
