import { NotFoundException } from '@nestjs/common';
import { RagService } from './rag.service';
import { IRagRepository } from '../../domain/repositories/rag.repository.interface';
import { RagEntity } from '../../domain/entities/rag.entity';

describe('RagService', () => {
  let service: RagService;
  let repository: jest.Mocked<IRagRepository>;

  const mockRag: RagEntity = {
    id: 'rag-1',
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
    service = new RagService(repository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create RAG document index', async () => {
    repository.create.mockResolvedValue(mockRag);
    const result = await service.create({} as any);
    expect(result).toEqual(mockRag);
  });

  it('should find all RAG indices', async () => {
    repository.findAll.mockResolvedValue([mockRag]);
    const result = await service.findAll();
    expect(result).toEqual([mockRag]);
  });

  it('should find one RAG record by id', async () => {
    repository.findById.mockResolvedValue(mockRag);
    const result = await service.findOne('rag-1');
    expect(result).toEqual(mockRag);
  });

  it('should throw NotFoundException if RAG record is not found', async () => {
    repository.findById.mockResolvedValue(null);
    await expect(service.findOne('invalid')).rejects.toThrow(NotFoundException);
  });
});
