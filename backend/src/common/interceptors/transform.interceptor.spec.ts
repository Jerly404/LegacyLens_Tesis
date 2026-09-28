import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of } from 'rxjs';
import { TransformInterceptor } from './transform.interceptor';

describe('TransformInterceptor', () => {
  let interceptor: TransformInterceptor<any>;

  beforeEach(() => {
    interceptor = new TransformInterceptor();
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should wrap response data in { data, timestamp } structure', (done) => {
    const mockData = { id: '123', name: 'Legacy Project' };
    const mockCallHandler: CallHandler = {
      handle: () => of(mockData),
    };
    const mockContext = {} as ExecutionContext;

    interceptor.intercept(mockContext, mockCallHandler).subscribe((result) => {
      expect(result).toBeDefined();
      expect(result.data).toEqual(mockData);
      expect(typeof result.timestamp).toBe('string');
      expect(new Date(result.timestamp).getTime()).not.toBeNaN();
      done();
    });
  });
});
