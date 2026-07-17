import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CreateNotificationsDto } from '../dto/create-notifications.dto';
import { UpdateNotificationsDto } from '../dto/update-notifications.dto';
import { NotificationsEntity } from '../../domain/entities/notifications.entity';
import { INotificationsRepository } from '../../domain/repositories/notifications.repository.interface';

@Injectable()
export class NotificationsService {
  constructor(
    @Inject('INotificationsRepository')
    private readonly repository: INotificationsRepository,
  ) {}

  async create(dto: CreateNotificationsDto): Promise<NotificationsEntity> {
    return this.repository.create({ ...dto } as any);
  }

  async findAll(): Promise<NotificationsEntity[]> {
    return this.repository.findAll();
  }

  async findOne(id: string): Promise<NotificationsEntity> {
    const item = await this.repository.findById(id);
    if (!item) {
      throw new NotFoundException(`Notifications with ID ${id} not found`);
    }
    return item;
  }

  async update(id: string, dto: UpdateNotificationsDto): Promise<NotificationsEntity> {
    await this.findOne(id);
    return this.repository.update(id, dto);
  }

  async remove(id: string): Promise<boolean> {
    await this.findOne(id);
    return this.repository.delete(id);
  }
}
