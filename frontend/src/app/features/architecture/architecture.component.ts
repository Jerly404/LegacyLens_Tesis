import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ArchitectureService } from '../../core/architecture/architecture.service';
import { ProjectService } from '../../core/projects/project.service';
import { NotificationService } from '../../core/notifications/notification.service';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { ArchitectureAnalysis, AIRecommendation } from '@codelens/shared';

@Component({
  selector: 'app-architecture',
  standalone: true,
  imports: [CommonModule, RouterModule, BadgeComponent],
  templateUrl: './architecture.component.html',
  styleUrls: ['./architecture.component.css']
})
export class ArchitectureComponent implements OnInit {
  architectureService = inject(ArchitectureService);
  projectService = inject(ProjectService);
  notificationService = inject(NotificationService);
  router = inject(Router);

  architectureData = signal<ArchitectureAnalysis | null>(null);
  recommendations = signal<AIRecommendation[]>([]);

  architectureStyles = [
    { name: 'Layered', confidence: 94, match: true },
    { name: 'Monolithic', confidence: 68, match: false },
    { name: 'MVC', confidence: 62, match: false },
    { name: 'Hexagonal', confidence: 24, match: false },
    { name: 'Clean Architecture', confidence: 18, match: false },
    { name: 'Microservices', confidence: 8, match: false },
    { name: 'Event-Driven', confidence: 12, match: false }
  ];

  ngOnInit() {
    this.architectureService.getArchitecture().subscribe(data => {
      this.architectureData.set(data);
    });

    this.architectureService.getRecommendations().subscribe(recs => {
      this.recommendations.set(recs);
    });
  }

  askAiAboutRecommendation(rec: AIRecommendation) {
    this.notificationService.info('Refactoring Inquiry', `Opening AI chat for ${rec.title}...`);
    this.router.navigate(['/ai-chat']);
  }
}
