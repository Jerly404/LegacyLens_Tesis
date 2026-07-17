import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CreateDocumentationDto } from '../dto/create-documentation.dto';
import { UpdateDocumentationDto } from '../dto/update-documentation.dto';
import { DocumentationEntity } from '../../domain/entities/documentation.entity';
import { IDocumentationRepository } from '../../domain/repositories/documentation.repository.interface';

@Injectable()
export class DocumentationService {
  constructor(
    @Inject('IDocumentationRepository')
    private readonly repository: IDocumentationRepository,
  ) {}

  async create(dto: CreateDocumentationDto): Promise<DocumentationEntity> {
    return this.repository.create({ ...dto } as any);
  }

  async findAll(): Promise<DocumentationEntity[]> {
    return this.repository.findAll();
  }

  async findOne(id: string): Promise<DocumentationEntity> {
    const item = await this.repository.findById(id);
    if (!item) {
      throw new NotFoundException(`Documentation with ID ${id} not found`);
    }
    return item;
  }

  async update(id: string, dto: UpdateDocumentationDto): Promise<DocumentationEntity> {
    await this.findOne(id);
    return this.repository.update(id, dto);
  }

  async remove(id: string): Promise<boolean> {
    await this.findOne(id);
    return this.repository.delete(id);
  }
}
