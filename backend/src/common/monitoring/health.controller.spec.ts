import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { MetricsService } from './metrics.service';

describe('HealthController', () => {
  let controller: HealthController;
  let metricsService: MetricsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [MetricsService],
    }).compile();

    controller = module.get<HealthController>(HealthController);
    metricsService = module.get<MetricsService>(MetricsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(metricsService).toBeDefined();
  });

  it('should return system health metrics', () => {
    const result = controller.check();
    expect(result).toBeDefined();
    expect(result.status).toBe('healthy');
    expect(typeof result.uptime).toBe('number');
    expect(result.memoryUsage).toBeDefined();
    expect(result.timestamp).toBeDefined();
  });
});
