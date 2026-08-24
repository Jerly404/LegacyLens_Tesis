import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ProjectService } from '../../core/projects/project.service';
import { NotificationService } from '../../core/notifications/notification.service';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { Project } from '@codelens/shared';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, BadgeComponent, EmptyStateComponent],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent {
  projectService = inject(ProjectService);
  notificationService = inject(NotificationService);
  router = inject(Router);

  searchQuery = signal<string>('');
  selectedFilter = signal<'ALL' | 'COMPLETED' | 'ANALYZING' | 'FAILED'>('ALL');
  viewMode = signal<'grid' | 'table'>('grid');

  filteredProjects = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const f = this.selectedFilter();

    return this.projectService.projects().filter(p => {
      const matchesSearch = !q || p.name.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q) || p.mainLanguage.toLowerCase().includes(q) || p.architecture.toLowerCase().includes(q);
      const matchesFilter = f === 'ALL' || p.status === f;
      return matchesSearch && matchesFilter;
    });
  });

  openProject(proj: Project) {
    this.projectService.setSelectedProject(proj);
    this.router.navigate(['/project-overview']);
  }

  deleteProject(event: Event, proj: Project) {
    event.stopPropagation();
    if (confirm(`Are you sure you want to delete "${proj.name}"?`)) {
      this.projectService.deleteProject(proj.id).subscribe(() => {
        this.notificationService.success('Project Deleted', `Removed ${proj.name}`);
      });
    }
  }
}
