import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { ProjectService } from '../../core/projects/project.service';
import { SettingsService } from '../../core/settings/settings.service';
import { NotificationService } from '../../core/notifications/notification.service';
import { TranslationService } from '../../core/i18n/translation.service';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { Project } from '@codelens/shared';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, StatCardComponent, BadgeComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  authService = inject(AuthService);
  projectService = inject(ProjectService);
  settingsService = inject(SettingsService);
  notificationService = inject(NotificationService);
  translationService = inject(TranslationService);

  totalProjects = computed(() => this.projectService.projects().length);
  
  totalFiles = computed(() => {
    const projs = this.projectService.projects();
    if (projs.length === 0) return '0';
    const sum = projs.reduce((acc, p) => acc + (p.fileCount || 0), 0);
    return sum.toLocaleString();
  });

  totalDocs = computed(() => {
    const count = this.projectService.projects().length;
    return count > 0 ? `${count * 5} Pages` : '0 Pages';
  });

  avgConfidence = computed(() => {
    const projs = this.projectService.projects();
    if (projs.length === 0) return '--';
    const avg = Math.round(projs.reduce((acc, p) => acc + (p.confidence || 90), 0) / projs.length);
    return `${avg}% Conf.`;
  });

  avgTime = computed(() => {
    return this.projectService.projects().length > 0 ? '00:15 min' : '--';
  });

  recentActivities = computed(() => {
    const projs = this.projectService.projects();
    return projs.map((p, idx) => ({
      id: `act-${p.id}`,
      title: p.status === 'COMPLETED' ? 'Análisis Completado' : 'Analizando con IA',
      project: p.slug,
      time: `${idx * 10 + 2} min atrás`,
      icon: p.status === 'COMPLETED' ? 'check_circle' : 'pending',
      color: p.status === 'COMPLETED' ? 'text-emerald-400' : 'text-amber-400',
      description: `Ingeniería inversa de ${p.fileCount} archivos (${p.architecture}).`
    }));
  });

  selectProject(proj: Project) {
    this.projectService.setSelectedProject(proj);
    this.notificationService.info('Active Project', `Selected ${proj.name}`);
  }

  clearWorkspace() {
    this.projectService.clearAllProjects().subscribe(() => {
      this.notificationService.info('Workspace Limpio', 'Se han limpiado todos los proyectos del sistema.');
    });
  }
}
