import { NotFoundException } from '@nestjs/common';
import { DocumentationService } from './documentation.service';
import { IDocumentationRepository } from '../../domain/repositories/documentation.repository.interface';
import { DocumentationEntity } from '../../domain/entities/documentation.entity';

describe('DocumentationService', () => {
  let service: DocumentationService;
  let repository: jest.Mocked<IDocumentationRepository>;

  const mockDoc: DocumentationEntity = {
    id: 'doc-1',
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
    service = new DocumentationService(repository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create documentation record', async () => {
    repository.create.mockResolvedValue(mockDoc);
    const result = await service.create({} as any);
    expect(result).toEqual(mockDoc);
  });

  it('should find all documentation records', async () => {
    repository.findAll.mockResolvedValue([mockDoc]);
    const result = await service.findAll();
    expect(result).toEqual([mockDoc]);
  });

  it('should find documentation by id', async () => {
    repository.findById.mockResolvedValue(mockDoc);
    const result = await service.findOne('doc-1');
    expect(result).toEqual(mockDoc);
  });

  it('should throw NotFoundException on non-existent document', async () => {
    repository.findById.mockResolvedValue(null);
    await expect(service.findOne('doc-x')).rejects.toThrow(NotFoundException);
  });
});
