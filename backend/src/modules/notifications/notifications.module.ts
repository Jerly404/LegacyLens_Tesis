import { Module } from '@nestjs/common';
import { NotificationsService } from './application/services/notifications.service';
import { NotificationsController } from './presentation/controllers/notifications.controller';
import { PrismaNotificationsRepository } from './infrastructure/persistence/prisma-notifications.repository';

@Module({
  controllers: [NotificationsController],
  providers: [
    NotificationsService,
    {
      provide: 'INotificationsRepository',
      useClass: PrismaNotificationsRepository,
    },
  ],
  exports: [NotificationsService],
})
export class NotificationsModule {}
