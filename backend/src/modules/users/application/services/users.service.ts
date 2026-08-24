import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CreateUsersDto } from '../dto/create-users.dto';
import { UpdateUsersDto } from '../dto/update-users.dto';
import { UsersEntity } from '../../domain/entities/users.entity';
import { IUsersRepository } from '../../domain/repositories/users.repository.interface';

@Injectable()
export class UsersService {
  constructor(
    @Inject('IUsersRepository')
    private readonly repository: IUsersRepository,
  ) {}

  async create(dto: CreateUsersDto): Promise<UsersEntity> {
    return this.repository.create({ ...dto } as any);
  }

  async findAll(): Promise<UsersEntity[]> {
    return this.repository.findAll();
  }

  async findOne(id: string): Promise<UsersEntity> {
    const item = await this.repository.findById(id);
    if (!item) {
      throw new NotFoundException(`Users with ID ${id} not found`);
    }
    return item;
  }

  async update(id: string, dto: UpdateUsersDto): Promise<UsersEntity> {
    await this.findOne(id);
    return this.repository.update(id, dto as any);
  }

  async remove(id: string): Promise<boolean> {
    await this.findOne(id);
    return this.repository.delete(id);
  }
}
