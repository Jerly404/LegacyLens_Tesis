import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AnalysisService } from '../../core/analysis/analysis.service';
import { ProjectService } from '../../core/projects/project.service';
import { NotificationService } from '../../core/notifications/notification.service';
import { AnalysisProgress } from '@codelens/shared';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-analysis-progress',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './analysis-progress.component.html',
  styleUrls: ['./analysis-progress.component.css']
})
export class AnalysisProgressComponent implements OnInit, OnDestroy {
  analysisService = inject(AnalysisService);
  projectService = inject(ProjectService);
  notificationService = inject(NotificationService);
  router = inject(Router);

  progressData = signal<AnalysisProgress | null>(null);
  private sub?: Subscription;

  ngOnInit() {
    const selectedProj = this.projectService.selectedProject();
    this.sub = this.analysisService.getAnalysisProgress(selectedProj.id).subscribe(data => {
      this.progressData.set(data);
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  restart() {
    this.analysisService.restartSimulation();
    this.notificationService.info('Pipeline Reset', 'Restarted analysis worker.');
  }

  viewProject() {
    this.router.navigate(['/project-overview']);
  }
}
