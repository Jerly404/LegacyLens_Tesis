import { Injectable } from '@nestjs/common';
import { ProjectsEntity } from '../../domain/entities/projects.entity';
import { IProjectsRepository } from '../../domain/repositories/projects.repository.interface';

@Injectable()
export class PrismaProjectsRepository implements IProjectsRepository {
  private readonly items: ProjectsEntity[] = [];

  async findById(id: string): Promise<ProjectsEntity | null> {
    return this.items.find(item => item.id === id) || null;
  }

  async findAll(): Promise<ProjectsEntity[]> {
    return [...this.items];
  }

  async create(entity: Partial<ProjectsEntity>): Promise<ProjectsEntity> {
    const newEntity: ProjectsEntity = {
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...entity,
    } as any;
    this.items.push(newEntity);
    return newEntity;
  }

  async update(id: string, entity: Partial<ProjectsEntity>): Promise<ProjectsEntity> {
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
