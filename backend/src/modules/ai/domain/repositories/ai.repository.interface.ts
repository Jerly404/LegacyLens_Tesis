import { AiEntity } from '../entities/ai.entity';

export interface IAiRepository {
  findById(id: string): Promise<AiEntity | null>;
  findAll(): Promise<AiEntity[]>;
  create(entity: Partial<AiEntity>): Promise<AiEntity>;
  update(id: string, entity: Partial<AiEntity>): Promise<AiEntity>;
  delete(id: string): Promise<boolean>;
}
