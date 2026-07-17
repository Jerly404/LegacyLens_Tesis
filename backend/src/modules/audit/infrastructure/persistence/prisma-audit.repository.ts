import { Injectable } from '@nestjs/common';
import { AuditEntity } from '../../domain/entities/audit.entity';
import { IAuditRepository } from '../../domain/repositories/audit.repository.interface';

@Injectable()
export class PrismaAuditRepository implements IAuditRepository {
  private readonly items: AuditEntity[] = [];

  async findById(id: string): Promise<AuditEntity | null> {
    return this.items.find(item => item.id === id) || null;
  }

  async findAll(): Promise<AuditEntity[]> {
    return [...this.items];
  }

  async create(entity: Partial<AuditEntity>): Promise<AuditEntity> {
    const newEntity: AuditEntity = {
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...entity,
    } as any;
    this.items.push(newEntity);
    return newEntity;
  }

  async update(id: string, entity: Partial<AuditEntity>): Promise<AuditEntity> {
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
