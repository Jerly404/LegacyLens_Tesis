import { Module } from '@nestjs/common';
import { AiService } from './application/services/ai.service';
import { AiController } from './presentation/controllers/ai.controller';
import { PrismaAiRepository } from './infrastructure/persistence/prisma-ai.repository';

@Module({
  controllers: [AiController],
  providers: [
    AiService,
    {
      provide: 'IAiRepository',
      useClass: PrismaAiRepository,
    },
  ],
  exports: [AiService],
})
export class AiModule {}
