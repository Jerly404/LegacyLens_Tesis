import { NotFoundException } from '@nestjs/common';
import { ArchitectureService } from './architecture.service';
import { IArchitectureRepository } from '../../domain/repositories/architecture.repository.interface';
import { ArchitectureEntity } from '../../domain/entities/architecture.entity';

describe('ArchitectureService', () => {
  let service: ArchitectureService;
  let repository: jest.Mocked<IArchitectureRepository>;

  const mockArch: ArchitectureEntity = {
    id: 'arch-1',
    createdAt: new Date(),
    updatedAt: new Date(),
  } as any;

  beforeEach(() => {
    repository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    service = new ArchitectureService(repository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create architecture record', async () => {
    repository.create.mockResolvedValue(mockArch);
    const result = await service.create({} as any);
    expect(result).toEqual(mockArch);
  });

  it('should find all architecture records', async () => {
    repository.findAll.mockResolvedValue([mockArch]);
    const result = await service.findAll();
    expect(result).toEqual([mockArch]);
  });

  it('should find architecture by id', async () => {
    repository.findById.mockResolvedValue(mockArch);
    const result = await service.findOne('arch-1');
    expect(result).toEqual(mockArch);
  });

  it('should throw NotFoundException when not found', async () => {
    repository.findById.mockResolvedValue(null);
    await expect(service.findOne('not-found')).rejects.toThrow(NotFoundException);
  });
});
