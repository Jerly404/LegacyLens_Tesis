import { UsersEntity } from '../entities/users.entity';

export interface IUsersRepository {
  findById(id: string): Promise<UsersEntity | null>;
  findAll(): Promise<UsersEntity[]>;
  create(entity: Partial<UsersEntity>): Promise<UsersEntity>;
  update(id: string, entity: Partial<UsersEntity>): Promise<UsersEntity>;
  delete(id: string): Promise<boolean>;
}
