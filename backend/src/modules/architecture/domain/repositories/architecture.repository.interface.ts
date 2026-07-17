import { ArchitectureEntity } from '../entities/architecture.entity';

export interface IArchitectureRepository {
  findById(id: string): Promise<ArchitectureEntity | null>;
  findAll(): Promise<ArchitectureEntity[]>;
  create(entity: Partial<ArchitectureEntity>): Promise<ArchitectureEntity>;
  update(id: string, entity: Partial<ArchitectureEntity>): Promise<ArchitectureEntity>;
  delete(id: string): Promise<boolean>;
}
