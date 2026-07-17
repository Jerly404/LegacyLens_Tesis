import { Injectable } from '@nestjs/common';
import { AiEntity } from '../../domain/entities/ai.entity';
import { IAiRepository } from '../../domain/repositories/ai.repository.interface';

@Injectable()
export class PrismaAiRepository implements IAiRepository {
  private readonly items: AiEntity[] = [];

  async findById(id: string): Promise<AiEntity | null> {
    return this.items.find(item => item.id === id) || null;
  }

  async findAll(): Promise<AiEntity[]> {
    return [...this.items];
  }

  async create(entity: Partial<AiEntity>): Promise<AiEntity> {
    const newEntity: AiEntity = {
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...entity,
    } as any;
    this.items.push(newEntity);
    return newEntity;
  }

  async update(id: string, entity: Partial<AiEntity>): Promise<AiEntity> {
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
