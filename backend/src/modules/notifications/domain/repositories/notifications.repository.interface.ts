import { NotificationsEntity } from '../entities/notifications.entity';

export interface INotificationsRepository {
  findById(id: string): Promise<NotificationsEntity | null>;
  findAll(): Promise<NotificationsEntity[]>;
  create(entity: Partial<NotificationsEntity>): Promise<NotificationsEntity>;
  update(id: string, entity: Partial<NotificationsEntity>): Promise<NotificationsEntity>;
  delete(id: string): Promise<boolean>;
}
