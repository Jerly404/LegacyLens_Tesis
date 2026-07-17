import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CreateArchitectureDto } from '../dto/create-architecture.dto';
import { UpdateArchitectureDto } from '../dto/update-architecture.dto';
import { ArchitectureEntity } from '../../domain/entities/architecture.entity';
import { IArchitectureRepository } from '../../domain/repositories/architecture.repository.interface';

@Injectable()
export class ArchitectureService {
  constructor(
    @Inject('IArchitectureRepository')
    private readonly repository: IArchitectureRepository,
  ) {}

  async create(dto: CreateArchitectureDto): Promise<ArchitectureEntity> {
    return this.repository.create({ ...dto } as any);
  }

  async findAll(): Promise<ArchitectureEntity[]> {
    return this.repository.findAll();
  }

  async findOne(id: string): Promise<ArchitectureEntity> {
    const item = await this.repository.findById(id);
    if (!item) {
      throw new NotFoundException(`Architecture with ID ${id} not found`);
    }
    return item;
  }

  async update(id: string, dto: UpdateArchitectureDto): Promise<ArchitectureEntity> {
    await this.findOne(id);
    return this.repository.update(id, dto);
  }

  async remove(id: string): Promise<boolean> {
    await this.findOne(id);
    return this.repository.delete(id);
  }
}
