import { Injectable } from '@nestjs/common';

@Injectable()
export class MetricsService {
  private readonly startTime = Date.now();

  getMetrics() {
    return {
      uptime: Math.floor((Date.now() - this.startTime) / 1000),
      memoryUsage: process.memoryUsage(),
      cpuUsage: process.cpuUsage(),
      status: 'healthy',
      timestamp: new Date().toISOString(),
    };
  }
}
