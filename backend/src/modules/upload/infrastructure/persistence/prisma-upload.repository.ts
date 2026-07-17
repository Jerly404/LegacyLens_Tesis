import { Injectable } from '@nestjs/common';
import { UploadEntity } from '../../domain/entities/upload.entity';
import { IUploadRepository } from '../../domain/repositories/upload.repository.interface';

@Injectable()
export class PrismaUploadRepository implements IUploadRepository {
  private readonly items: UploadEntity[] = [];

  async findById(id: string): Promise<UploadEntity | null> {
    return this.items.find(item => item.id === id) || null;
  }

  async findAll(): Promise<UploadEntity[]> {
    return [...this.items];
  }

  async create(entity: Partial<UploadEntity>): Promise<UploadEntity> {
    const newEntity: UploadEntity = {
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...entity,
    } as any;
    this.items.push(newEntity);
    return newEntity;
  }

  async update(id: string, entity: Partial<UploadEntity>): Promise<UploadEntity> {
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
