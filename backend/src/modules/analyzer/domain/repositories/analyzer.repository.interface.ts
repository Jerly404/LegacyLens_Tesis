import { AnalyzerEntity } from '../entities/analyzer.entity';

export interface IAnalyzerRepository {
  findById(id: string): Promise<AnalyzerEntity | null>;
  findAll(): Promise<AnalyzerEntity[]>;
  create(entity: Partial<AnalyzerEntity>): Promise<AnalyzerEntity>;
  update(id: string, entity: Partial<AnalyzerEntity>): Promise<AnalyzerEntity>;
  delete(id: string): Promise<boolean>;
}
