import { RagEntity } from '../entities/rag.entity';

export interface IRagRepository {
  findById(id: string): Promise<RagEntity | null>;
  findAll(): Promise<RagEntity[]>;
  create(entity: Partial<RagEntity>): Promise<RagEntity>;
  update(id: string, entity: Partial<RagEntity>): Promise<RagEntity>;
  delete(id: string): Promise<boolean>;
}
