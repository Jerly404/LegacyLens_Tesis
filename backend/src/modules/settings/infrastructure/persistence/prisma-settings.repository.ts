import { Injectable } from '@nestjs/common';
import { SettingsEntity } from '../../domain/entities/settings.entity';
import { ISettingsRepository } from '../../domain/repositories/settings.repository.interface';

@Injectable()
export class PrismaSettingsRepository implements ISettingsRepository {
  private readonly items: SettingsEntity[] = [];

  async findById(id: string): Promise<SettingsEntity | null> {
    return this.items.find(item => item.id === id) || null;
  }

  async findAll(): Promise<SettingsEntity[]> {
    return [...this.items];
  }

  async create(entity: Partial<SettingsEntity>): Promise<SettingsEntity> {
    const newEntity: SettingsEntity = {
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...entity,
    } as any;
    this.items.push(newEntity);
    return newEntity;
  }

  async update(id: string, entity: Partial<SettingsEntity>): Promise<SettingsEntity> {
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
