import { Injectable, signal } from '@angular/core';
import { AIModelConfig, SystemHealth } from '@codelens/shared';
import { Observable, from, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  models = signal<AIModelConfig[]>([
    {
      id: 'qwen2.5-coder:7b',
      name: 'Qwen 2.5 Coder 7B Instruct (Recommended)',
      provider: 'Alibaba / Ollama',
      parameters: '7.6 Billion',
      contextWindow: '32k tokens',
      status: 'ONLINE',
      localEndpoint: 'http://localhost:11434/api/generate',
      description: 'Top-tier code reasoning model optimized for RTX 3050 (4GB VRAM). Excels at reverse-engineering, AST analysis, and refactoring.',
      isDefault: true
    },
    {
      id: 'deepseek-coder:6.7b',
      name: 'DeepSeek Coder 6.7B Instruct',
      provider: 'DeepSeek / Ollama',
      parameters: '6.7 Billion',
      contextWindow: '16k tokens',
      status: 'ONLINE',
      localEndpoint: 'http://localhost:11434/api/generate',
      description: 'Compact code intelligence model that fits 100% inside 4GB VRAM for blazing-fast inference speeds (40+ tokens/sec).',
      isDefault: false
    },
    {
      id: 'qwen2.5-coder:1.5b',
      name: 'Qwen 2.5 Coder 1.5B (Ultra-Light)',
      provider: 'Alibaba / Ollama',
      parameters: '1.5 Billion',
      contextWindow: '32k tokens',
      status: 'ONLINE',
      localEndpoint: 'http://localhost:11434/api/generate',
      description: 'Extremely lightweight model (~1GB VRAM) for low-latency symbol resolution and instant code explanations.',
      isDefault: false
    },
    {
      id: 'codestral:22b',
      name: 'Mistral Codestral 22B',
      provider: 'Mistral AI / Ollama',
      parameters: '22 Billion',
      contextWindow: '32k tokens',
      status: 'ONLINE',
      localEndpoint: 'http://localhost:11434/api/generate',
      description: 'Heavyweight architecture audit model. Supports 80+ programming languages using GPU VRAM + CPU RAM offload.',
      isDefault: false
    },
    {
      id: 'qwen2.5-coder:14b',
      name: 'Qwen 2.5 Coder 14B',
      provider: 'Alibaba / Ollama',
      parameters: '14.7 Billion',
      contextWindow: '32k tokens',
      status: 'ONLINE',
      localEndpoint: 'http://localhost:11434/api/generate',
      description: 'Deep mathematical and structural reasoning model for enterprise security review and architectural compliance.',
      isDefault: false
    }
  ]);

  systemHealth = signal<SystemHealth>({
    status: 'ONLINE',
    activeModel: 'Qwen 2.5 Coder 7B',
    gpuName: 'NVIDIA GeForce RTX 3050 (4GB VRAM)',
    vramUsedGB: 3.4,
    vramTotalGB: 4.0,
    gpuUtilization: 37,
    gpuTemperature: 50,
    currentWorkload: 'Low',
    ollamaEndpoint: 'http://localhost:11434',
    activeAnalysesCount: 1
  });

  serverUrl = signal<string>('http://localhost:11434');
  isOllamaConnected = signal<boolean>(false);
  installedOllamaModels = signal<string[]>([]);
  autoSave = signal<boolean>(true);
  notificationsEnabled = signal<boolean>(true);
  selectedModelId = signal<string>('qwen2.5-coder:7b');
  language = signal<'en' | 'es'>('en');

  constructor() {
    this.checkOllamaConnection();
  }

  checkOllamaConnection() {
    this.pingServer().subscribe();
  }

  pingServer(): Observable<{ connected: boolean; latencyMs: number; models?: string[]; message?: string }> {
    const startTime = performance.now();
    const endpoint = `${this.serverUrl()}/api/tags`;

    return from(
      fetch(endpoint, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
        .then(async res => {
          const latencyMs = Math.round(performance.now() - startTime);
          if (res.ok) {
            const data = await res.json();
            const modelNames = (data.models || []).map((m: any) => m.name || m.model);
            this.isOllamaConnected.set(true);
            this.installedOllamaModels.set(modelNames);
            this.systemHealth.update(h => ({ ...h, status: 'ONLINE' }));
            return { connected: true, latencyMs, models: modelNames, message: `Connected to Ollama (${modelNames.length} models installed)` };
          } else {
            this.isOllamaConnected.set(false);
            return { connected: false, latencyMs, message: `Ollama returned HTTP ${res.status}` };
          }
        })
        .catch(err => {
          const latencyMs = Math.round(performance.now() - startTime);
          this.isOllamaConnected.set(false);
          return { connected: false, latencyMs, message: 'Could not connect to Ollama server at ' + this.serverUrl() + '. (Start with: ollama serve)' };
        })
    );
  }

  selectModel(id: string) {
    this.selectedModelId.set(id);
    const model = this.models().find(m => m.id === id);
    if (model) {
      this.systemHealth.update(health => ({
        ...health,
        activeModel: model.name
      }));
    }
  }

  updateSettings(data: { serverUrl?: string; autoSave?: boolean; notificationsEnabled?: boolean; language?: 'en' | 'es' }) {
    if (data.serverUrl) {
      this.serverUrl.set(data.serverUrl);
      this.checkOllamaConnection();
    }
    if (data.autoSave !== undefined) this.autoSave.set(data.autoSave);
    if (data.notificationsEnabled !== undefined) this.notificationsEnabled.set(data.notificationsEnabled);
    if (data.language) this.language.set(data.language);
  }
}
