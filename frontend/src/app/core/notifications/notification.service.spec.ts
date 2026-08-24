import { TestBed } from '@angular/core/testing';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NotificationService]
    });
    service = TestBed.inject(NotificationService);
  });

  it('should initialize with notifications', () => {
    expect(service.notifications().length).toBeGreaterThan(0);
  });

  it('should push new success toast', () => {
    service.success('Test Toast', 'Operation finished successfully');
    expect(service.activeToast()).toBeDefined();
    expect(service.activeToast()?.title).toBe('Test Toast');
    expect(service.activeToast()?.type).toBe('success');
  });

  it('should dismiss toast', () => {
    service.info('Info Toast', 'Information details');
    expect(service.activeToast()).not.toBeNull();
    service.dismissToast();
    expect(service.activeToast()).toBeNull();
  });
});
