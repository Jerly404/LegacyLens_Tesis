import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CreateAuditDto } from '../dto/create-audit.dto';
import { UpdateAuditDto } from '../dto/update-audit.dto';
import { AuditEntity } from '../../domain/entities/audit.entity';
import { IAuditRepository } from '../../domain/repositories/audit.repository.interface';

@Injectable()
export class AuditService {
  constructor(
    @Inject('IAuditRepository')
    private readonly repository: IAuditRepository,
  ) {}

  async create(dto: CreateAuditDto): Promise<AuditEntity> {
    return this.repository.create({ ...dto } as any);
  }

  async findAll(): Promise<AuditEntity[]> {
    return this.repository.findAll();
  }

  async findOne(id: string): Promise<AuditEntity> {
    const item = await this.repository.findById(id);
    if (!item) {
      throw new NotFoundException(`Audit with ID ${id} not found`);
    }
    return item;
  }

  async update(id: string, dto: UpdateAuditDto): Promise<AuditEntity> {
    await this.findOne(id);
    return this.repository.update(id, dto);
  }

  async remove(id: string): Promise<boolean> {
    await this.findOne(id);
    return this.repository.delete(id);
  }
}
