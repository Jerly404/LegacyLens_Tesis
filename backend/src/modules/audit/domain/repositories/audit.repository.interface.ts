import { AuditEntity } from '../entities/audit.entity';

export interface IAuditRepository {
  findById(id: string): Promise<AuditEntity | null>;
  findAll(): Promise<AuditEntity[]>;
  create(entity: Partial<AuditEntity>): Promise<AuditEntity>;
  update(id: string, entity: Partial<AuditEntity>): Promise<AuditEntity>;
  delete(id: string): Promise<boolean>;
}
