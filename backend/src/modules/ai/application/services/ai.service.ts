import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CreateAiDto } from '../dto/create-ai.dto';
import { UpdateAiDto } from '../dto/update-ai.dto';
import { AiEntity } from '../../domain/entities/ai.entity';
import { IAiRepository } from '../../domain/repositories/ai.repository.interface';

@Injectable()
export class AiService {
  constructor(
    @Inject('IAiRepository')
    private readonly repository: IAiRepository,
  ) {}

  async create(dto: CreateAiDto): Promise<AiEntity> {
    return this.repository.create({ ...dto } as any);
  }

  async findAll(): Promise<AiEntity[]> {
    return this.repository.findAll();
  }

  async findOne(id: string): Promise<AiEntity> {
    const item = await this.repository.findById(id);
    if (!item) {
      throw new NotFoundException(`Ai with ID ${id} not found`);
    }
    return item;
  }

  async update(id: string, dto: UpdateAiDto): Promise<AiEntity> {
    await this.findOne(id);
    return this.repository.update(id, dto as any);
  }

  async remove(id: string): Promise<boolean> {
    await this.findOne(id);
    return this.repository.delete(id);
  }
}
