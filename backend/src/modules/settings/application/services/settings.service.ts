import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CreateSettingsDto } from '../dto/create-settings.dto';
import { UpdateSettingsDto } from '../dto/update-settings.dto';
import { SettingsEntity } from '../../domain/entities/settings.entity';
import { ISettingsRepository } from '../../domain/repositories/settings.repository.interface';

@Injectable()
export class SettingsService {
  constructor(
    @Inject('ISettingsRepository')
    private readonly repository: ISettingsRepository,
  ) {}

  async create(dto: CreateSettingsDto): Promise<SettingsEntity> {
    return this.repository.create({ ...dto } as any);
  }

  async findAll(): Promise<SettingsEntity[]> {
    return this.repository.findAll();
  }

  async findOne(id: string): Promise<SettingsEntity> {
    const item = await this.repository.findById(id);
    if (!item) {
      throw new NotFoundException(`Settings with ID ${id} not found`);
    }
    return item;
  }

  async update(id: string, dto: UpdateSettingsDto): Promise<SettingsEntity> {
    await this.findOne(id);
    return this.repository.update(id, dto as any);
  }

  async remove(id: string): Promise<boolean> {
    await this.findOne(id);
    return this.repository.delete(id);
  }
}
