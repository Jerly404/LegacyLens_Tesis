import { TestBed } from '@angular/core/testing';
import { SettingsService } from './settings.service';

describe('SettingsService', () => {
  let service: SettingsService;

  beforeEach(() => {
    const mockFetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: async () => ({
          models: [
            { name: 'qwen2.5-coder:7b' },
            { name: 'deepseek-coder:6.7b' }
          ]
        })
      })
    );
    (globalThis as any).fetch = mockFetch;
    (window as any).fetch = mockFetch;

    TestBed.configureTestingModule({
      providers: [SettingsService]
    });
    service = TestBed.inject(SettingsService);
  });

  it('should initialize with available models and default model', () => {
    expect(service.models().length).toBeGreaterThan(0);
    expect(service.selectedModelId()).toBe('qwen2.5-coder:7b');
  });

  it('should ping Ollama server and update connection state', (done) => {
    service.pingServer().subscribe(res => {
      expect(res.connected).toBe(true);
      expect(service.isOllamaConnected()).toBe(true);
      expect(service.installedOllamaModels()).toContain('qwen2.5-coder:7b');
      done();
    });
  });

  it('should select model and update system health telemetry', () => {
    service.selectModel('deepseek-coder:6.7b');
    expect(service.selectedModelId()).toBe('deepseek-coder:6.7b');
    expect(service.systemHealth().activeModel).toBe('DeepSeek Coder 6.7B Instruct');
  });

  it('should update general settings', () => {
    service.updateSettings({
      autoSave: false,
      notificationsEnabled: false,
      language: 'es'
    });
    expect(service.autoSave()).toBe(false);
    expect(service.notificationsEnabled()).toBe(false);
    expect(service.language()).toBe('es');
  });
});
