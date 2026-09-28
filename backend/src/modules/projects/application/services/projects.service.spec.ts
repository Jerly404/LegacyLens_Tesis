import { NotFoundException } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { IProjectsRepository } from '../../domain/repositories/projects.repository.interface';
import { ProjectsEntity } from '../../domain/entities/projects.entity';

describe('ProjectsService', () => {
  let service: ProjectsService;
  let repository: jest.Mocked<IProjectsRepository>;

  const mockProject: ProjectsEntity = {
    id: 'proj-1',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    repository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    service = new ProjectsService(repository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should successfully create a new project', async () => {
      repository.create.mockResolvedValue(mockProject);
      const result = await service.create({ name: 'MindGuard Platform' } as any);
      expect(result).toEqual(mockProject);
      expect(repository.create).toHaveBeenCalledWith({ name: 'MindGuard Platform' });
    });
  });

  describe('findAll', () => {
    it('should return an array of projects', async () => {
      repository.findAll.mockResolvedValue([mockProject]);
      const result = await service.findAll();
      expect(result).toEqual([mockProject]);
      expect(repository.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a project when found by id', async () => {
      repository.findById.mockResolvedValue(mockProject);
      const result = await service.findOne('proj-1');
      expect(result).toEqual(mockProject);
      expect(repository.findById).toHaveBeenCalledWith('proj-1');
    });

    it('should throw NotFoundException when project is not found', async () => {
      repository.findById.mockResolvedValue(null);
      await expect(service.findOne('non-existing')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update and return the project when it exists', async () => {
      const updated = { ...mockProject, updatedAt: new Date() };
      repository.findById.mockResolvedValue(mockProject);
      repository.update.mockResolvedValue(updated);

      const result = await service.update('proj-1', { name: 'Updated Name' } as any);
      expect(result).toEqual(updated);
      expect(repository.update).toHaveBeenCalledWith('proj-1', { name: 'Updated Name' });
    });

    it('should throw NotFoundException when updating non-existent project', async () => {
      repository.findById.mockResolvedValue(null);
      await expect(service.update('non-existing', { name: 'New' } as any)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete project when it exists', async () => {
      repository.findById.mockResolvedValue(mockProject);
      repository.delete.mockResolvedValue(true);

      const result = await service.remove('proj-1');
      expect(result).toBe(true);
      expect(repository.delete).toHaveBeenCalledWith('proj-1');
    });

    it('should throw NotFoundException when deleting non-existent project', async () => {
      repository.findById.mockResolvedValue(null);
      await expect(service.remove('non-existing')).rejects.toThrow(NotFoundException);
    });
  });
});
