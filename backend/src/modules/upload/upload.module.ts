import { Module } from '@nestjs/common';
import { UploadService } from './application/services/upload.service';
import { UploadController } from './presentation/controllers/upload.controller';
import { PrismaUploadRepository } from './infrastructure/persistence/prisma-upload.repository';

@Module({
  controllers: [UploadController],
  providers: [
    UploadService,
    {
      provide: 'IUploadRepository',
      useClass: PrismaUploadRepository,
    },
  ],
  exports: [UploadService],
})
export class UploadModule {}
