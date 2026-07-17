import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CreateAuthDto } from '../dto/create-auth.dto';
import { UpdateAuthDto } from '../dto/update-auth.dto';
import { AuthEntity } from '../../domain/entities/auth.entity';
import { IAuthRepository } from '../../domain/repositories/auth.repository.interface';

@Injectable()
export class AuthService {
  constructor(
    @Inject('IAuthRepository')
    private readonly repository: IAuthRepository,
  ) {}

  async create(dto: CreateAuthDto): Promise<AuthEntity> {
    return this.repository.create({ ...dto } as any);
  }

  async findAll(): Promise<AuthEntity[]> {
    return this.repository.findAll();
  }

  async findOne(id: string): Promise<AuthEntity> {
    const item = await this.repository.findById(id);
    if (!item) {
      throw new NotFoundException(`Auth with ID ${id} not found`);
    }
    return item;
  }

  async update(id: string, dto: UpdateAuthDto): Promise<AuthEntity> {
    await this.findOne(id);
    return this.repository.update(id, dto);
  }

  async remove(id: string): Promise<boolean> {
    await this.findOne(id);
    return this.repository.delete(id);
  }
}
