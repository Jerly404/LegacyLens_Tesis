import { ReportsEntity } from '../entities/reports.entity';

export interface IReportsRepository {
  findById(id: string): Promise<ReportsEntity | null>;
  findAll(): Promise<ReportsEntity[]>;
  create(entity: Partial<ReportsEntity>): Promise<ReportsEntity>;
  update(id: string, entity: Partial<ReportsEntity>): Promise<ReportsEntity>;
  delete(id: string): Promise<boolean>;
}
