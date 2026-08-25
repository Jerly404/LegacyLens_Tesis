import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SettingsService } from '../../core/settings/settings.service';
import { ThemeService } from '../../core/theme/theme.service';
import { NotificationService } from '../../core/notifications/notification.service';
import { TranslationService, SupportedLanguage } from '../../core/i18n/translation.service';
import { TranslatePipe } from '../../core/i18n/translate.pipe';
import { BadgeComponent } from '../../shared/components/badge/badge.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, BadgeComponent, TranslatePipe],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  settingsService = inject(SettingsService);
  themeService = inject(ThemeService);
  notificationService = inject(NotificationService);
  translationService = inject(TranslationService);

  serverUrl = signal<string>('http://localhost:11434');
  autoSave = signal<boolean>(true);
  notificationsEnabled = signal<boolean>(true);
  isTesting = signal<boolean>(false);
  pingResult = signal<string | null>(null);

  selectModel(id: string) {
    this.settingsService.selectModel(id);
    const m = this.settingsService.models().find(model => model.id === id);
    this.notificationService.success('Active Model Changed', `Switched default inference engine to ${m?.name}`);
  }

  testConnection() {
    this.isTesting.set(true);
    this.pingResult.set(null);

    this.settingsService.pingServer().subscribe(res => {
      this.isTesting.set(false);
      this.pingResult.set(res.message || `Connected successfully (${res.latencyMs}ms latency)`);
      if (res.connected) {
        this.notificationService.success('AI Server Connected', `Ollama active with ${res.models?.length || 0} models.`);
      } else {
        this.notificationService.warning('Connection Issue', res.message || 'Could not reach Ollama.');
      }
    });
  }

  onLanguageChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const newLang = target.value as SupportedLanguage;
    this.translationService.setLanguage(newLang);
    this.notificationService.info('Language Updated', newLang === 'es' ? 'Idioma cambiado a Español' : 'Language switched to English');
  }

  savePreferences() {
    this.settingsService.updateSettings({
      serverUrl: this.serverUrl(),
      autoSave: this.autoSave(),
      notificationsEnabled: this.notificationsEnabled()
    });
    this.notificationService.success('Preferences Saved', 'Your workspace preferences were updated.');
  }
}
