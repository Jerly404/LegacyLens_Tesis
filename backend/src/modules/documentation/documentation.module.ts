import { Module } from '@nestjs/common';
import { DocumentationService } from './application/services/documentation.service';
import { DocumentationController } from './presentation/controllers/documentation.controller';
import { PrismaDocumentationRepository } from './infrastructure/persistence/prisma-documentation.repository';

@Module({
  controllers: [DocumentationController],
  providers: [
    DocumentationService,
    {
      provide: 'IDocumentationRepository',
      useClass: PrismaDocumentationRepository,
    },
  ],
  exports: [DocumentationService],
})
export class DocumentationModule {}
