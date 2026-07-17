import { Injectable } from '@nestjs/common';
import { NotificationsEntity } from '../../domain/entities/notifications.entity';
import { INotificationsRepository } from '../../domain/repositories/notifications.repository.interface';

@Injectable()
export class PrismaNotificationsRepository implements INotificationsRepository {
  private readonly items: NotificationsEntity[] = [];

  async findById(id: string): Promise<NotificationsEntity | null> {
    return this.items.find(item => item.id === id) || null;
  }

  async findAll(): Promise<NotificationsEntity[]> {
    return [...this.items];
  }

  async create(entity: Partial<NotificationsEntity>): Promise<NotificationsEntity> {
    const newEntity: NotificationsEntity = {
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...entity,
    } as any;
    this.items.push(newEntity);
    return newEntity;
  }

  async update(id: string, entity: Partial<NotificationsEntity>): Promise<NotificationsEntity> {
    const index = this.items.findIndex(item => item.id === id);
    if (index !== -1) {
      this.items[index] = {
        ...this.items[index],
        ...entity,
        updatedAt: new Date(),
      };
      return this.items[index];
    }
    throw new Error('Not found');
  }

  async delete(id: string): Promise<boolean> {
    const index = this.items.findIndex(item => item.id === id);
    if (index !== -1) {
      this.items.splice(index, 1);
      return true;
    }
    return false;
  }
}
