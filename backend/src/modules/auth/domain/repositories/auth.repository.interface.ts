import { AuthEntity } from '../entities/auth.entity';

export interface IAuthRepository {
  findById(id: string): Promise<AuthEntity | null>;
  findAll(): Promise<AuthEntity[]>;
  create(entity: Partial<AuthEntity>): Promise<AuthEntity>;
  update(id: string, entity: Partial<AuthEntity>): Promise<AuthEntity>;
  delete(id: string): Promise<boolean>;
}
