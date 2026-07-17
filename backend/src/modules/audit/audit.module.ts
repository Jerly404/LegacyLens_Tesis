import { Module } from '@nestjs/common';
import { AuditService } from './application/services/audit.service';
import { AuditController } from './presentation/controllers/audit.controller';
import { PrismaAuditRepository } from './infrastructure/persistence/prisma-audit.repository';

@Module({
  controllers: [AuditController],
  providers: [
    AuditService,
    {
      provide: 'IAuditRepository',
      useClass: PrismaAuditRepository,
    },
  ],
  exports: [AuditService],
})
export class AuditModule {}
