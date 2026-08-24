import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

describe('AuthService', () => {
  let service: AuthService;
  let routerSpy = { navigate: jasmine.createSpy('navigate') };

  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: Router, useValue: routerSpy }
      ]
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created and have default session', () => {
    expect(service).toBeTruthy();
    expect(service.isAuthenticated()).toBeTrue();
    expect(service.currentUser()?.role).toBe('ADMIN');
  });

  it('should perform login and update session', (done) => {
    service.login('developer@legacyai.io', 'pass', true, 'DEVELOPER').subscribe(success => {
      expect(success).toBeTrue();
      expect(service.currentUser()?.email).toBe('developer@legacyai.io');
      expect(service.currentUser()?.role).toBe('DEVELOPER');
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
      done();
    });
  });

  it('should logout and clear tokens', () => {
    service.logout();
    expect(service.currentUser()).toBeNull();
    expect(service.isAuthenticated()).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });
});
