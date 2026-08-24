import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SettingsService } from '../../core/settings/settings.service';
import { ThemeService } from '../../core/theme/theme.service';
import { NotificationService } from '../../core/notifications/notification.service';
import { BadgeComponent } from '../../shared/components/badge/badge.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, BadgeComponent],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  settingsService = inject(SettingsService);
  themeService = inject(ThemeService);
  notificationService = inject(NotificationService);

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
      this.pingResult.set(`Connected successfully (${res.latencyMs}ms latency)`);
      this.notificationService.success('AI Server Connected', `Ollama endpoint reachable at ${this.serverUrl()}`);
    });
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
