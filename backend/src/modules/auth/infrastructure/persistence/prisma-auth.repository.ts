import { Injectable } from '@nestjs/common';
import { AuthEntity } from '../../domain/entities/auth.entity';
import { IAuthRepository } from '../../domain/repositories/auth.repository.interface';

@Injectable()
export class PrismaAuthRepository implements IAuthRepository {
  private readonly items: AuthEntity[] = [];

  async findById(id: string): Promise<AuthEntity | null> {
    return this.items.find(item => item.id === id) || null;
  }

  async findAll(): Promise<AuthEntity[]> {
    return [...this.items];
  }

  async create(entity: Partial<AuthEntity>): Promise<AuthEntity> {
    const newEntity: AuthEntity = {
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...entity,
    } as any;
    this.items.push(newEntity);
    return newEntity;
  }

  async update(id: string, entity: Partial<AuthEntity>): Promise<AuthEntity> {
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
