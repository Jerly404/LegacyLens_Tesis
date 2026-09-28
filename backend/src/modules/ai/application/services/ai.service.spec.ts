import { NotFoundException } from '@nestjs/common';
import { AiService } from './ai.service';
import { IAiRepository } from '../../domain/repositories/ai.repository.interface';
import { AiEntity } from '../../domain/entities/ai.entity';

describe('AiService', () => {
  let service: AiService;
  let repository: jest.Mocked<IAiRepository>;

  const mockAi: AiEntity = {
    id: 'ai-1',
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
    service = new AiService(repository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create AI record', async () => {
    repository.create.mockResolvedValue(mockAi);
    const result = await service.create({} as any);
    expect(result).toEqual(mockAi);
  });

  it('should find all AI records', async () => {
    repository.findAll.mockResolvedValue([mockAi]);
    const result = await service.findAll();
    expect(result).toEqual([mockAi]);
  });

  it('should find one AI record', async () => {
    repository.findById.mockResolvedValue(mockAi);
    const result = await service.findOne('ai-1');
    expect(result).toEqual(mockAi);
  });

  it('should throw NotFoundException on non-existent AI record', async () => {
    repository.findById.mockResolvedValue(null);
    await expect(service.findOne('invalid')).rejects.toThrow(NotFoundException);
  });
});
