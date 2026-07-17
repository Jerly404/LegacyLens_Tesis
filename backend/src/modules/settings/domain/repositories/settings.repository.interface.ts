import { SettingsEntity } from '../entities/settings.entity';

export interface ISettingsRepository {
  findById(id: string): Promise<SettingsEntity | null>;
  findAll(): Promise<SettingsEntity[]>;
  create(entity: Partial<SettingsEntity>): Promise<SettingsEntity>;
  update(id: string, entity: Partial<SettingsEntity>): Promise<SettingsEntity>;
  delete(id: string): Promise<boolean>;
}
