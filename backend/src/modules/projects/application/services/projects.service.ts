import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CreateProjectsDto } from '../dto/create-projects.dto';
import { UpdateProjectsDto } from '../dto/update-projects.dto';
import { ProjectsEntity } from '../../domain/entities/projects.entity';
import { IProjectsRepository } from '../../domain/repositories/projects.repository.interface';

@Injectable()
export class ProjectsService {
  constructor(
    @Inject('IProjectsRepository')
    private readonly repository: IProjectsRepository,
  ) {}

  async create(dto: CreateProjectsDto): Promise<ProjectsEntity> {
    return this.repository.create({ ...dto } as any);
  }

  async findAll(): Promise<ProjectsEntity[]> {
    return this.repository.findAll();
  }

  async findOne(id: string): Promise<ProjectsEntity> {
    const item = await this.repository.findById(id);
    if (!item) {
      throw new NotFoundException(`Projects with ID ${id} not found`);
    }
    return item;
  }

  async update(id: string, dto: UpdateProjectsDto): Promise<ProjectsEntity> {
    await this.findOne(id);
    return this.repository.update(id, dto as any);
  }

  async remove(id: string): Promise<boolean> {
    await this.findOne(id);
    return this.repository.delete(id);
  }
}
