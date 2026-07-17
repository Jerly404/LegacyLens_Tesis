import { Injectable, signal } from '@angular/core';

export interface UserSettings {
  defaultLanguageModel: string;
  autoAnalyzeOnUpload: boolean;
  enableNotifications: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  settings = signal<UserSettings>({
    defaultLanguageModel: 'Qwen2.5-Coder',
    autoAnalyzeOnUpload: true,
    enableNotifications: true
  });

  updateSettings(newSettings: Partial<UserSettings>) {
    this.settings.update(s => ({ ...s, ...newSettings }));
  }
}
