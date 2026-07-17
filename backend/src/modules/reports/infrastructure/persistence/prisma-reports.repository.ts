import { Injectable } from '@nestjs/common';
import { ReportsEntity } from '../../domain/entities/reports.entity';
import { IReportsRepository } from '../../domain/repositories/reports.repository.interface';

@Injectable()
export class PrismaReportsRepository implements IReportsRepository {
  private readonly items: ReportsEntity[] = [];

  async findById(id: string): Promise<ReportsEntity | null> {
    return this.items.find(item => item.id === id) || null;
  }

  async findAll(): Promise<ReportsEntity[]> {
    return [...this.items];
  }

  async create(entity: Partial<ReportsEntity>): Promise<ReportsEntity> {
    const newEntity: ReportsEntity = {
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...entity,
    } as any;
    this.items.push(newEntity);
    return newEntity;
  }

  async update(id: string, entity: Partial<ReportsEntity>): Promise<ReportsEntity> {
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
