import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { ThemeService } from '../../core/theme/theme.service';
import { SettingsService } from '../../core/settings/settings.service';
import { NotificationService } from '../../core/notifications/notification.service';
import { ProjectService } from '../../core/projects/project.service';
import { AnalysisService } from '../../core/analysis/analysis.service';
import { TranslationService } from '../../core/i18n/translation.service';
import { TranslatePipe } from '../../core/i18n/translate.pipe';
import { ToastComponent } from '../../shared/components/toast/toast.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, ToastComponent, TranslatePipe],
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent {
  authService = inject(AuthService);
  themeService = inject(ThemeService);
  settingsService = inject(SettingsService);
  notificationService = inject(NotificationService);
  projectService = inject(ProjectService);
  analysisService = inject(AnalysisService);
  translationService = inject(TranslationService);
  router = inject(Router);

  isAnalyzing = computed(() => {
    const analysis = this.analysisService.currentAnalysis();
    const proj = this.projectService.selectedProject();
    return analysis.status === 'ANALYZING' || proj.status === 'ANALYZING';
  });

  sidebarOpen = signal<boolean>(true);
  mobileDrawerOpen = signal<boolean>(false);
  notificationsOpen = signal<boolean>(false);
  userMenuOpen = signal<boolean>(false);

  toggleSidebar() {
    this.sidebarOpen.update(v => !v);
  }

  toggleMobileDrawer() {
    this.mobileDrawerOpen.update(v => !v);
  }

  toggleNotifications() {
    this.notificationsOpen.update(v => !v);
  }

  toggleUserMenu() {
    this.userMenuOpen.update(v => !v);
  }

  toggleLanguage() {
    const newLang = this.translationService.isSpanish() ? 'en' : 'es';
    this.translationService.setLanguage(newLang);
    this.notificationService.info('Language Changed', newLang === 'es' ? 'Idioma cambiado a Español' : 'Language set to English');
  }

  switchProject(event: Event) {
    const target = event.target as HTMLSelectElement;
    const selectedId = target.value;
    const proj = this.projectService.projects().find(p => p.id === selectedId);
    if (proj) {
      this.projectService.setSelectedProject(proj);
      this.notificationService.info('Context Switched', `Switched active codebase to ${proj.name}`);
    }
  }
}
