import { ProjectsEntity } from '../entities/projects.entity';

export interface IProjectsRepository {
  findById(id: string): Promise<ProjectsEntity | null>;
  findAll(): Promise<ProjectsEntity[]>;
  create(entity: Partial<ProjectsEntity>): Promise<ProjectsEntity>;
  update(id: string, entity: Partial<ProjectsEntity>): Promise<ProjectsEntity>;
  delete(id: string): Promise<boolean>;
}
