import { NotFoundException } from '@nestjs/common';
import { UmlService } from './uml.service';
import { IUmlRepository } from '../../domain/repositories/uml.repository.interface';
import { UmlEntity } from '../../domain/entities/uml.entity';

describe('UmlService', () => {
  let service: UmlService;
  let repository: jest.Mocked<IUmlRepository>;

  const mockUml: UmlEntity = {
    id: 'uml-1',
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
    service = new UmlService(repository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create UML diagram record', async () => {
    repository.create.mockResolvedValue(mockUml);
    const result = await service.create({} as any);
    expect(result).toEqual(mockUml);
  });

  it('should find all UML diagrams', async () => {
    repository.findAll.mockResolvedValue([mockUml]);
    const result = await service.findAll();
    expect(result).toEqual([mockUml]);
  });

  it('should find UML diagram by id', async () => {
    repository.findById.mockResolvedValue(mockUml);
    const result = await service.findOne('uml-1');
    expect(result).toEqual(mockUml);
  });

  it('should throw NotFoundException on non-existent diagram', async () => {
    repository.findById.mockResolvedValue(null);
    await expect(service.findOne('invalid')).rejects.toThrow(NotFoundException);
  });
});
