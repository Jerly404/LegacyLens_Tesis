import { Injectable } from '@nestjs/common';
import { DocumentationEntity } from '../../domain/entities/documentation.entity';
import { IDocumentationRepository } from '../../domain/repositories/documentation.repository.interface';

@Injectable()
export class PrismaDocumentationRepository implements IDocumentationRepository {
  private readonly items: DocumentationEntity[] = [];

  async findById(id: string): Promise<DocumentationEntity | null> {
    return this.items.find(item => item.id === id) || null;
  }

  async findAll(): Promise<DocumentationEntity[]> {
    return [...this.items];
  }

  async create(entity: Partial<DocumentationEntity>): Promise<DocumentationEntity> {
    const newEntity: DocumentationEntity = {
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...entity,
    } as any;
    this.items.push(newEntity);
    return newEntity;
  }

  async update(id: string, entity: Partial<DocumentationEntity>): Promise<DocumentationEntity> {
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
