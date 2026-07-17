import { Module } from '@nestjs/common';
import { AnalyzerService } from './application/services/analyzer.service';
import { AnalyzerController } from './presentation/controllers/analyzer.controller';
import { PrismaAnalyzerRepository } from './infrastructure/persistence/prisma-analyzer.repository';

@Module({
  controllers: [AnalyzerController],
  providers: [
    AnalyzerService,
    {
      provide: 'IAnalyzerRepository',
      useClass: PrismaAnalyzerRepository,
    },
  ],
  exports: [AnalyzerService],
})
export class AnalyzerModule {}
