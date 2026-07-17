import { Injectable } from '@nestjs/common';
import { UsersEntity } from '../../domain/entities/users.entity';
import { IUsersRepository } from '../../domain/repositories/users.repository.interface';

@Injectable()
export class PrismaUsersRepository implements IUsersRepository {
  private readonly items: UsersEntity[] = [];

  async findById(id: string): Promise<UsersEntity | null> {
    return this.items.find(item => item.id === id) || null;
  }

  async findAll(): Promise<UsersEntity[]> {
    return [...this.items];
  }

  async create(entity: Partial<UsersEntity>): Promise<UsersEntity> {
    const newEntity: UsersEntity = {
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...entity,
    } as any;
    this.items.push(newEntity);
    return newEntity;
  }

  async update(id: string, entity: Partial<UsersEntity>): Promise<UsersEntity> {
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
