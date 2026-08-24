import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CreateReportsDto } from '../dto/create-reports.dto';
import { UpdateReportsDto } from '../dto/update-reports.dto';
import { ReportsEntity } from '../../domain/entities/reports.entity';
import { IReportsRepository } from '../../domain/repositories/reports.repository.interface';

@Injectable()
export class ReportsService {
  constructor(
    @Inject('IReportsRepository')
    private readonly repository: IReportsRepository,
  ) {}

  async create(dto: CreateReportsDto): Promise<ReportsEntity> {
    return this.repository.create({ ...dto } as any);
  }

  async findAll(): Promise<ReportsEntity[]> {
    return this.repository.findAll();
  }

  async findOne(id: string): Promise<ReportsEntity> {
    const item = await this.repository.findById(id);
    if (!item) {
      throw new NotFoundException(`Reports with ID ${id} not found`);
    }
    return item;
  }

  async update(id: string, dto: UpdateReportsDto): Promise<ReportsEntity> {
    await this.findOne(id);
    return this.repository.update(id, dto as any);
  }

  async remove(id: string): Promise<boolean> {
    await this.findOne(id);
    return this.repository.delete(id);
  }
}
