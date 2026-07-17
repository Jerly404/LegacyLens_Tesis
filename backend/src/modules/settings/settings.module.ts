import { Module } from '@nestjs/common';
import { SettingsService } from './application/services/settings.service';
import { SettingsController } from './presentation/controllers/settings.controller';
import { PrismaSettingsRepository } from './infrastructure/persistence/prisma-settings.repository';

@Module({
  controllers: [SettingsController],
  providers: [
    SettingsService,
    {
      provide: 'ISettingsRepository',
      useClass: PrismaSettingsRepository,
    },
  ],
  exports: [SettingsService],
})
export class SettingsModule {}
