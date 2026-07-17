import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CreateUploadDto } from '../dto/create-upload.dto';
import { UpdateUploadDto } from '../dto/update-upload.dto';
import { UploadEntity } from '../../domain/entities/upload.entity';
import { IUploadRepository } from '../../domain/repositories/upload.repository.interface';

@Injectable()
export class UploadService {
  constructor(
    @Inject('IUploadRepository')
    private readonly repository: IUploadRepository,
  ) {}

  async create(dto: CreateUploadDto): Promise<UploadEntity> {
    return this.repository.create({ ...dto } as any);
  }

  async findAll(): Promise<UploadEntity[]> {
    return this.repository.findAll();
  }

  async findOne(id: string): Promise<UploadEntity> {
    const item = await this.repository.findById(id);
    if (!item) {
      throw new NotFoundException(`Upload with ID ${id} not found`);
    }
    return item;
  }

  async update(id: string, dto: UpdateUploadDto): Promise<UploadEntity> {
    await this.findOne(id);
    return this.repository.update(id, dto);
  }

  async remove(id: string): Promise<boolean> {
    await this.findOne(id);
    return this.repository.delete(id);
  }
}
