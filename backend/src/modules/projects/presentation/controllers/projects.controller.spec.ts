import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from '../../application/services/projects.service';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../common/guards/roles.guard';

describe('ProjectsController', () => {
  let controller: ProjectsController;
  let service: jest.Mocked<Partial<ProjectsService>>;

  const mockProject = {
    id: 'proj-1',
    createdAt: new Date(),
    updatedAt: new Date(),
  } as any;

  beforeEach(async () => {
    service = {
      create: jest.fn().mockResolvedValue(mockProject),
      findAll: jest.fn().mockResolvedValue([mockProject]),
      findOne: jest.fn().mockResolvedValue(mockProject),
      update: jest.fn().mockResolvedValue({ ...mockProject }),
      remove: jest.fn().mockResolvedValue(true),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectsController],
      providers: [
        { provide: ProjectsService, useValue: service },
        Reflector,
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<ProjectsController>(ProjectsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call service.create', async () => {
    const result = await controller.create({ name: 'MindGuard API' } as any);
    expect(result).toEqual(mockProject);
    expect(service.create).toHaveBeenCalledWith({ name: 'MindGuard API' });
  });

  it('should call service.findAll', async () => {
    const result = await controller.findAll();
    expect(result).toEqual([mockProject]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should call service.findOne', async () => {
    const result = await controller.findOne('proj-1');
    expect(result).toEqual(mockProject);
    expect(service.findOne).toHaveBeenCalledWith('proj-1');
  });

  it('should call service.update', async () => {
    const result = await controller.update('proj-1', { name: 'Renamed' } as any);
    expect(result).toEqual(mockProject);
    expect(service.update).toHaveBeenCalledWith('proj-1', { name: 'Renamed' });
  });

  it('should call service.remove', async () => {
    const result = await controller.remove('proj-1');
    expect(result).toBe(true);
    expect(service.remove).toHaveBeenCalledWith('proj-1');
  });
});
