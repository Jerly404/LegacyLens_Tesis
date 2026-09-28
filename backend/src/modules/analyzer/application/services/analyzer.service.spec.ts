import { NotFoundException } from '@nestjs/common';
import { AnalyzerService } from './analyzer.service';
import { IAnalyzerRepository } from '../../domain/repositories/analyzer.repository.interface';
import { AnalyzerEntity } from '../../domain/entities/analyzer.entity';

describe('AnalyzerService', () => {
  let service: AnalyzerService;
  let repository: jest.Mocked<IAnalyzerRepository>;

  const mockAnalyzer: AnalyzerEntity = {
    id: 'analyzer-1',
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
    service = new AnalyzerService(repository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create analyzer record', async () => {
    repository.create.mockResolvedValue(mockAnalyzer);
    const result = await service.create({} as any);
    expect(result).toEqual(mockAnalyzer);
    expect(repository.create).toHaveBeenCalled();
  });

  it('should return all analyzer records', async () => {
    repository.findAll.mockResolvedValue([mockAnalyzer]);
    const result = await service.findAll();
    expect(result).toEqual([mockAnalyzer]);
  });

  it('should find analyzer by id', async () => {
    repository.findById.mockResolvedValue(mockAnalyzer);
    const result = await service.findOne('analyzer-1');
    expect(result).toEqual(mockAnalyzer);
  });

  it('should throw NotFoundException on missing analyzer', async () => {
    repository.findById.mockResolvedValue(null);
    await expect(service.findOne('non-existent')).rejects.toThrow(NotFoundException);
  });

  it('should update analyzer', async () => {
    repository.findById.mockResolvedValue(mockAnalyzer);
    repository.update.mockResolvedValue(mockAnalyzer);
    const result = await service.update('analyzer-1', {} as any);
    expect(result).toEqual(mockAnalyzer);
  });

  it('should remove analyzer', async () => {
    repository.findById.mockResolvedValue(mockAnalyzer);
    repository.delete.mockResolvedValue(true);
    const result = await service.remove('analyzer-1');
    expect(result).toBe(true);
  });
});
