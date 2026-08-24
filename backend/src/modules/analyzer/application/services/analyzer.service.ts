import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CreateAnalyzerDto } from '../dto/create-analyzer.dto';
import { UpdateAnalyzerDto } from '../dto/update-analyzer.dto';
import { AnalyzerEntity } from '../../domain/entities/analyzer.entity';
import { IAnalyzerRepository } from '../../domain/repositories/analyzer.repository.interface';

@Injectable()
export class AnalyzerService {
  constructor(
    @Inject('IAnalyzerRepository')
    private readonly repository: IAnalyzerRepository,
  ) {}

  async create(dto: CreateAnalyzerDto): Promise<AnalyzerEntity> {
    return this.repository.create({ ...dto } as any);
  }

  async findAll(): Promise<AnalyzerEntity[]> {
    return this.repository.findAll();
  }

  async findOne(id: string): Promise<AnalyzerEntity> {
    const item = await this.repository.findById(id);
    if (!item) {
      throw new NotFoundException(`Analyzer with ID ${id} not found`);
    }
    return item;
  }

  async update(id: string, dto: UpdateAnalyzerDto): Promise<AnalyzerEntity> {
    await this.findOne(id);
    return this.repository.update(id, dto as any);
  }

  async remove(id: string): Promise<boolean> {
    await this.findOne(id);
    return this.repository.delete(id);
  }
}
