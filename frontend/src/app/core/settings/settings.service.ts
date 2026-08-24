import { Injectable, signal } from '@angular/core';
import { AIModelConfig, SystemHealth } from '@codelens/shared';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  models = signal<AIModelConfig[]>([
    {
      id: 'deepseek-coder-33b',
      name: 'DeepSeek Coder 33B Instruct',
      provider: 'DeepSeek / Ollama',
      parameters: '33 Billion',
      contextWindow: '32k tokens',
      status: 'ONLINE',
      localEndpoint: 'http://localhost:11434/api/generate',
      description: 'State-of-the-art open-source code reasoning model optimized for AST comprehension and legacy refactoring.',
      isDefault: true
    },
    {
      id: 'qwen-2.5-coder-32b',
      name: 'Qwen 2.5 Coder 32B',
      provider: 'Alibaba / Ollama',
      parameters: '32.5 Billion',
      contextWindow: '64k tokens',
      status: 'ONLINE',
      localEndpoint: 'http://localhost:11434/api/generate',
      description: 'Ultra-long context model ideal for full-repository dependency mapping and architecture detection.',
      isDefault: false
    },
    {
      id: 'codestral-22b',
      name: 'Mistral Codestral 22B',
      provider: 'Mistral AI / Ollama',
      parameters: '22 Billion',
      contextWindow: '32k tokens',
      status: 'ONLINE',
      localEndpoint: 'http://localhost:11434/api/generate',
      description: 'Fast inference code completion and inline documentation generator with 80+ language support.',
      isDefault: false
    },
    {
      id: 'llama-3-code-70b',
      name: 'Llama 3 Code 70B Q4',
      provider: 'Meta / Ollama',
      parameters: '70 Billion',
      contextWindow: '16k tokens',
      status: 'OFFLINE',
      localEndpoint: 'http://localhost:11434/api/generate',
      description: 'High-capability reasoning model for enterprise security audit and compliance reports (requires >24GB VRAM).',
      isDefault: false
    }
  ]);

  systemHealth = signal<SystemHealth>({
    status: 'ONLINE',
    activeModel: 'DeepSeek Coder 33B',
    gpuName: 'NVIDIA GeForce RTX 3050',
    vramUsedGB: 7.2,
    vramTotalGB: 8.0,
    gpuUtilization: 42,
    gpuTemperature: 61,
    currentWorkload: 'Low',
    ollamaEndpoint: 'http://localhost:11434',
    activeAnalysesCount: 1
  });

  serverUrl = signal<string>('http://localhost:11434');
  autoSave = signal<boolean>(true);
  notificationsEnabled = signal<boolean>(true);
  selectedModelId = signal<string>('deepseek-coder-33b');
  language = signal<'en' | 'es'>('en');

  pingServer(): Observable<{ connected: boolean; latencyMs: number }> {
    return of({
      connected: true,
      latencyMs: Math.floor(Math.random() * 15 + 8)
    }).pipe(delay(350));
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
    if (data.serverUrl) this.serverUrl.set(data.serverUrl);
    if (data.autoSave !== undefined) this.autoSave.set(data.autoSave);
    if (data.notificationsEnabled !== undefined) this.notificationsEnabled.set(data.notificationsEnabled);
    if (data.language) this.language.set(data.language);
  }
}
