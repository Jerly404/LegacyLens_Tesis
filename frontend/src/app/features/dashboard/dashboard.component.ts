import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { ProjectService } from '../../core/projects/project.service';
import { SettingsService } from '../../core/settings/settings.service';
import { NotificationService } from '../../core/notifications/notification.service';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
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

  recentActivities = signal([
    {
      id: 'act-1',
      title: 'Analysis completed',
      project: 'legacy-banking-api',
      time: '12 min ago',
      icon: 'check_circle',
      color: 'text-emerald-400',
      description: 'Reverse-engineered 1,842 files and recovered Layered Architecture.'
    },
    {
      id: 'act-2',
      title: 'Documentation generated',
      project: 'ecommerce-system',
      time: '1 hour ago',
      icon: 'description',
      color: 'text-blue-400',
      description: 'Compiled OpenAPI specifications & Database dictionary.'
    },
    {
      id: 'act-3',
      title: 'Architecture detected',
      project: 'healthcare-hl7-api',
      time: '3 hours ago',
      icon: 'account_tree',
      color: 'text-purple-400',
      description: 'Layered architecture verified with 91% AI confidence.'
    },
    {
      id: 'act-4',
      title: 'Project uploaded',
      project: 'payment-gateway',
      time: '5 hours ago',
      icon: 'cloud_upload',
      color: 'text-amber-400',
      description: 'Repository unpacked and AST indexing started.'
    }
  ]);

  selectProject(proj: Project) {
    this.projectService.setSelectedProject(proj);
    this.notificationService.info('Active Project', `Selected ${proj.name}`);
  }
}
