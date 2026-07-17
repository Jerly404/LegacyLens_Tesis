import { Module } from '@nestjs/common';
import { ParserService } from './application/services/parser.service';
import { ParserController } from './presentation/controllers/parser.controller';
import { PrismaParserRepository } from './infrastructure/persistence/prisma-parser.repository';

@Module({
  controllers: [ParserController],
  providers: [
    ParserService,
    {
      provide: 'IParserRepository',
      useClass: PrismaParserRepository,
    },
  ],
  exports: [ParserService],
})
export class ParserModule {}
