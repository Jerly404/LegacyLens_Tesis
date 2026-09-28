import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = '';
    TestBed.configureTestingModule({
      providers: [ThemeService]
    });
    service = TestBed.inject(ThemeService);
  });

  it('should initialize with dark mode by default', () => {
    expect(service.isDarkMode()).toBe(true);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('theme')).toBe('dark');
  });

  it('should toggle theme from dark to light and back', () => {
    service.toggleTheme();
    expect(service.isDarkMode()).toBe(false);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(localStorage.getItem('theme')).toBe('light');

    service.toggleTheme();
    expect(service.isDarkMode()).toBe(true);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('theme')).toBe('dark');
  });

  it('should set explicit theme', () => {
    service.setTheme(false);
    expect(service.isDarkMode()).toBe(false);
    expect(localStorage.getItem('theme')).toBe('light');

    service.setTheme(true);
    expect(service.isDarkMode()).toBe(true);
    expect(localStorage.getItem('theme')).toBe('dark');
  });
});
