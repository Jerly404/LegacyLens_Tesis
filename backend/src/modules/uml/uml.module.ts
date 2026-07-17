import { Module } from '@nestjs/common';
import { UmlService } from './application/services/uml.service';
import { UmlController } from './presentation/controllers/uml.controller';
import { PrismaUmlRepository } from './infrastructure/persistence/prisma-uml.repository';

@Module({
  controllers: [UmlController],
  providers: [
    UmlService,
    {
      provide: 'IUmlRepository',
      useClass: PrismaUmlRepository,
    },
  ],
  exports: [UmlService],
})
export class UmlModule {}
