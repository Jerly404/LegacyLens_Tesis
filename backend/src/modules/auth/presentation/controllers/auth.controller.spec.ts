import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../../application/services/auth.service';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../common/guards/roles.guard';

describe('AuthController', () => {
  let controller: AuthController;
  let service: jest.Mocked<Partial<AuthService>>;

  const mockAuth = {
    id: 'auth-1',
  } as any;

  beforeEach(async () => {
    service = {
      create: jest.fn().mockResolvedValue(mockAuth),
      findAll: jest.fn().mockResolvedValue([mockAuth]),
      findOne: jest.fn().mockResolvedValue(mockAuth),
      update: jest.fn().mockResolvedValue(mockAuth),
      remove: jest.fn().mockResolvedValue(true),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: service },
        Reflector,
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create auth record', async () => {
    const result = await controller.create({} as any);
    expect(result).toEqual(mockAuth);
    expect(service.create).toHaveBeenCalled();
  });

  it('should get all auth records', async () => {
    const result = await controller.findAll();
    expect(result).toEqual([mockAuth]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should get auth record by ID', async () => {
    const result = await controller.findOne('auth-1');
    expect(result).toEqual(mockAuth);
    expect(service.findOne).toHaveBeenCalledWith('auth-1');
  });

  it('should update auth record', async () => {
    const result = await controller.update('auth-1', {} as any);
    expect(result).toEqual(mockAuth);
    expect(service.update).toHaveBeenCalledWith('auth-1', {});
  });

  it('should remove auth record', async () => {
    const result = await controller.remove('auth-1');
    expect(result).toBe(true);
    expect(service.remove).toHaveBeenCalledWith('auth-1');
  });
});
