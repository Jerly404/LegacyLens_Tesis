import { Module } from '@nestjs/common';
import { RagService } from './application/services/rag.service';
import { RagController } from './presentation/controllers/rag.controller';
import { PrismaRagRepository } from './infrastructure/persistence/prisma-rag.repository';

@Module({
  controllers: [RagController],
  providers: [
    RagService,
    {
      provide: 'IRagRepository',
      useClass: PrismaRagRepository,
    },
  ],
  exports: [RagService],
})
export class RagModule {}
