import { UploadEntity } from '../entities/upload.entity';

export interface IUploadRepository {
  findById(id: string): Promise<UploadEntity | null>;
  findAll(): Promise<UploadEntity[]>;
  create(entity: Partial<UploadEntity>): Promise<UploadEntity>;
  update(id: string, entity: Partial<UploadEntity>): Promise<UploadEntity>;
  delete(id: string): Promise<boolean>;
}
