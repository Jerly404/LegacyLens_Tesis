import { NotFoundException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { IAuthRepository } from '../../domain/repositories/auth.repository.interface';
import { AuthEntity } from '../../domain/entities/auth.entity';

describe('AuthService', () => {
  let service: AuthService;
  let repository: jest.Mocked<IAuthRepository>;

  const mockAuth: AuthEntity = {
    id: 'auth-1',
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
    service = new AuthService(repository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an auth record', async () => {
      repository.create.mockResolvedValue(mockAuth);
      const result = await service.create({} as any);
      expect(result).toEqual(mockAuth);
      expect(repository.create).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all auth records', async () => {
      repository.findAll.mockResolvedValue([mockAuth]);
      const result = await service.findAll();
      expect(result).toEqual([mockAuth]);
      expect(repository.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return auth record when found', async () => {
      repository.findById.mockResolvedValue(mockAuth);
      const result = await service.findOne('auth-1');
      expect(result).toEqual(mockAuth);
      expect(repository.findById).toHaveBeenCalledWith('auth-1');
    });

    it('should throw NotFoundException when auth record does not exist', async () => {
      repository.findById.mockResolvedValue(null);
      await expect(service.findOne('non-existent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update auth record', async () => {
      repository.findById.mockResolvedValue(mockAuth);
      repository.update.mockResolvedValue(mockAuth);
      const result = await service.update('auth-1', {} as any);
      expect(result).toEqual(mockAuth);
    });

    it('should throw NotFoundException when updating non-existent record', async () => {
      repository.findById.mockResolvedValue(null);
      await expect(service.update('non-existent', {} as any)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove auth record', async () => {
      repository.findById.mockResolvedValue(mockAuth);
      repository.delete.mockResolvedValue(true);
      const result = await service.remove('auth-1');
      expect(result).toBe(true);
    });

    it('should throw NotFoundException when removing non-existent record', async () => {
      repository.findById.mockResolvedValue(null);
      await expect(service.remove('non-existent')).rejects.toThrow(NotFoundException);
    });
  });
});
