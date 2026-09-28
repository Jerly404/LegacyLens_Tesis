import { NotFoundException } from '@nestjs/common';
import { ParserService } from './parser.service';
import { IParserRepository } from '../../domain/repositories/parser.repository.interface';
import { ParserEntity } from '../../domain/entities/parser.entity';

describe('ParserService', () => {
  let service: ParserService;
  let repository: jest.Mocked<IParserRepository>;

  const mockParser: ParserEntity = {
    id: 'parser-1',
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
    service = new ParserService(repository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create parser entity', async () => {
    repository.create.mockResolvedValue(mockParser);
    const result = await service.create({} as any);
    expect(result).toEqual(mockParser);
    expect(repository.create).toHaveBeenCalled();
  });

  it('should find all parser entities', async () => {
    repository.findAll.mockResolvedValue([mockParser]);
    const result = await service.findAll();
    expect(result).toEqual([mockParser]);
  });

  it('should find parser entity by id', async () => {
    repository.findById.mockResolvedValue(mockParser);
    const result = await service.findOne('parser-1');
    expect(result).toEqual(mockParser);
  });

  it('should throw NotFoundException when entity not found', async () => {
    repository.findById.mockResolvedValue(null);
    await expect(service.findOne('invalid')).rejects.toThrow(NotFoundException);
  });

  it('should update parser entity', async () => {
    repository.findById.mockResolvedValue(mockParser);
    repository.update.mockResolvedValue(mockParser);
    const result = await service.update('parser-1', {} as any);
    expect(result).toEqual(mockParser);
  });

  it('should remove parser entity', async () => {
    repository.findById.mockResolvedValue(mockParser);
    repository.delete.mockResolvedValue(true);
    const result = await service.remove('parser-1');
    expect(result).toBe(true);
  });
});
