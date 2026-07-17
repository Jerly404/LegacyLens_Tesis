import { Module } from '@nestjs/common';
import { ArchitectureService } from './application/services/architecture.service';
import { ArchitectureController } from './presentation/controllers/architecture.controller';
import { PrismaArchitectureRepository } from './infrastructure/persistence/prisma-architecture.repository';

@Module({
  controllers: [ArchitectureController],
  providers: [
    ArchitectureService,
    {
      provide: 'IArchitectureRepository',
      useClass: PrismaArchitectureRepository,
    },
  ],
  exports: [ArchitectureService],
})
export class ArchitectureModule {}
