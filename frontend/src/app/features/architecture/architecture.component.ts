import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ArchitectureService } from '../../core/architecture/architecture.service';
import { ProjectService } from '../../core/projects/project.service';
import { NotificationService } from '../../core/notifications/notification.service';
import { TranslationService } from '../../core/i18n/translation.service';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { ArchitectureAnalysis, AIRecommendation, ArchitectureInferenceItem } from '@codelens/shared';

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
  translationService = inject(TranslationService);
  router = inject(Router);

  architectureData = signal<ArchitectureAnalysis | null>(null);
  recommendations = signal<AIRecommendation[]>([]);
  selectedInferenceItem = signal<ArchitectureInferenceItem | null>(null);

  architectureStyles = [
    { name: 'Layered', confidence: 96, match: true, status: 'CONCLUYENTE' },
    { name: 'Microservices', confidence: 88, match: true, status: 'CONCLUYENTE' },
    { name: 'MVC', confidence: 58, match: false, status: 'DESCARTADO' },
    { name: 'Hexagonal', confidence: 24, match: false, status: 'INSUFICIENTE' },
    { name: 'Clean Architecture', confidence: 18, match: false, status: 'INSUFICIENTE' },
    { name: 'Event-Driven', confidence: 12, match: false, status: 'INSUFICIENTE' }
  ];

  ngOnInit() {
    this.architectureService.getAnalysis().subscribe(data => {
      this.architectureData.set(data);
      if (data.inferenceItems && data.inferenceItems.length > 1) {
        this.selectedInferenceItem.set(data.inferenceItems[1]); // Default to Business Logic Layer
      } else if (data.inferenceItems && data.inferenceItems.length > 0) {
        this.selectedInferenceItem.set(data.inferenceItems[0]);
      }
    });

    this.architectureService.getRecommendations().subscribe(recs => {
      this.recommendations.set(recs);
    });
  }

  selectInferenceItem(item: ArchitectureInferenceItem) {
    this.selectedInferenceItem.set(item);
  }

  askAiAboutRecommendation(rec: AIRecommendation) {
    this.notificationService.info(
      this.translationService.isSpanish() ? 'Solicitud de Refactorización' : 'Refactoring Inquiry',
      `Opening AI chat for ${rec.title}...`
    );
    this.router.navigate(['/ai-chat']);
  }
}
