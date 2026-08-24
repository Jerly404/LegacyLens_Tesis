import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CreateParserDto } from '../dto/create-parser.dto';
import { UpdateParserDto } from '../dto/update-parser.dto';
import { ParserEntity } from '../../domain/entities/parser.entity';
import { IParserRepository } from '../../domain/repositories/parser.repository.interface';

@Injectable()
export class ParserService {
  constructor(
    @Inject('IParserRepository')
    private readonly repository: IParserRepository,
  ) {}

  async create(dto: CreateParserDto): Promise<ParserEntity> {
    return this.repository.create({ ...dto } as any);
  }

  async findAll(): Promise<ParserEntity[]> {
    return this.repository.findAll();
  }

  async findOne(id: string): Promise<ParserEntity> {
    const item = await this.repository.findById(id);
    if (!item) {
      throw new NotFoundException(`Parser with ID ${id} not found`);
    }
    return item;
  }

  async update(id: string, dto: UpdateParserDto): Promise<ParserEntity> {
    await this.findOne(id);
    return this.repository.update(id, dto as any);
  }

  async remove(id: string): Promise<boolean> {
    await this.findOne(id);
    return this.repository.delete(id);
  }
}
