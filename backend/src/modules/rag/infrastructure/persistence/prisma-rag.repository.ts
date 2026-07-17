import { Injectable } from '@nestjs/common';
import { RagEntity } from '../../domain/entities/rag.entity';
import { IRagRepository } from '../../domain/repositories/rag.repository.interface';

@Injectable()
export class PrismaRagRepository implements IRagRepository {
  private readonly items: RagEntity[] = [];

  async findById(id: string): Promise<RagEntity | null> {
    return this.items.find(item => item.id === id) || null;
  }

  async findAll(): Promise<RagEntity[]> {
    return [...this.items];
  }

  async create(entity: Partial<RagEntity>): Promise<RagEntity> {
    const newEntity: RagEntity = {
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...entity,
    } as any;
    this.items.push(newEntity);
    return newEntity;
  }

  async update(id: string, entity: Partial<RagEntity>): Promise<RagEntity> {
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
