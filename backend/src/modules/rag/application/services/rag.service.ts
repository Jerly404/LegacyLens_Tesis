import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CreateRagDto } from '../dto/create-rag.dto';
import { UpdateRagDto } from '../dto/update-rag.dto';
import { RagEntity } from '../../domain/entities/rag.entity';
import { IRagRepository } from '../../domain/repositories/rag.repository.interface';

@Injectable()
export class RagService {
  constructor(
    @Inject('IRagRepository')
    private readonly repository: IRagRepository,
  ) {}

  async create(dto: CreateRagDto): Promise<RagEntity> {
    return this.repository.create({ ...dto } as any);
  }

  async findAll(): Promise<RagEntity[]> {
    return this.repository.findAll();
  }

  async findOne(id: string): Promise<RagEntity> {
    const item = await this.repository.findById(id);
    if (!item) {
      throw new NotFoundException(`Rag with ID ${id} not found`);
    }
    return item;
  }

  async update(id: string, dto: UpdateRagDto): Promise<RagEntity> {
    await this.findOne(id);
    return this.repository.update(id, dto);
  }

  async remove(id: string): Promise<boolean> {
    await this.findOne(id);
    return this.repository.delete(id);
  }
}
