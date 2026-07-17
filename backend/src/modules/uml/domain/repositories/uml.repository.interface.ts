import { UmlEntity } from '../entities/uml.entity';

export interface IUmlRepository {
  findById(id: string): Promise<UmlEntity | null>;
  findAll(): Promise<UmlEntity[]>;
  create(entity: Partial<UmlEntity>): Promise<UmlEntity>;
  update(id: string, entity: Partial<UmlEntity>): Promise<UmlEntity>;
  delete(id: string): Promise<boolean>;
}
