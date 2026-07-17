import { DocumentationEntity } from '../entities/documentation.entity';

export interface IDocumentationRepository {
  findById(id: string): Promise<DocumentationEntity | null>;
  findAll(): Promise<DocumentationEntity[]>;
  create(entity: Partial<DocumentationEntity>): Promise<DocumentationEntity>;
  update(id: string, entity: Partial<DocumentationEntity>): Promise<DocumentationEntity>;
  delete(id: string): Promise<boolean>;
}
