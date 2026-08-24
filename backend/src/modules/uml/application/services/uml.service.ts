import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CreateUmlDto } from '../dto/create-uml.dto';
import { UpdateUmlDto } from '../dto/update-uml.dto';
import { UmlEntity } from '../../domain/entities/uml.entity';
import { IUmlRepository } from '../../domain/repositories/uml.repository.interface';

@Injectable()
export class UmlService {
  constructor(
    @Inject('IUmlRepository')
    private readonly repository: IUmlRepository,
  ) {}

  async create(dto: CreateUmlDto): Promise<UmlEntity> {
    return this.repository.create({ ...dto } as any);
  }

  async findAll(): Promise<UmlEntity[]> {
    return this.repository.findAll();
  }

  async findOne(id: string): Promise<UmlEntity> {
    const item = await this.repository.findById(id);
    if (!item) {
      throw new NotFoundException(`Uml with ID ${id} not found`);
    }
    return item;
  }

  async update(id: string, dto: UpdateUmlDto): Promise<UmlEntity> {
    await this.findOne(id);
    return this.repository.update(id, dto as any);
  }

  async remove(id: string): Promise<boolean> {
    await this.findOne(id);
    return this.repository.delete(id);
  }
}
