import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiagramService } from '../../core/diagrams/diagram.service';
import { ProjectService } from '../../core/projects/project.service';
import { NotificationService } from '../../core/notifications/notification.service';
import { DiagramViewerComponent } from '../../shared/components/diagram-viewer/diagram-viewer.component';
import { UMLDiagram, UMLType } from '@codelens/shared';

@Component({
  selector: 'app-uml',
  standalone: true,
  imports: [CommonModule, DiagramViewerComponent],
  templateUrl: './uml.component.html',
  styleUrls: ['./uml.component.css']
})
export class UmlComponent implements OnInit {
  diagramService = inject(DiagramService);
  projectService = inject(ProjectService);
  notificationService = inject(NotificationService);

  activeType = signal<UMLType>('class');
  currentDiagram = signal<UMLDiagram | null>(null);
  isRegenerating = signal<boolean>(false);

  ngOnInit() {
    this.loadDiagram(this.activeType());
  }

  loadDiagram(type: UMLType) {
    this.activeType.set(type);
    this.diagramService.getDiagram(type).subscribe(diag => {
      this.currentDiagram.set(diag);
    });
  }

  regenerate() {
    this.isRegenerating.set(true);
    setTimeout(() => {
      this.isRegenerating.set(false);
      this.notificationService.success('UML Diagram Regenerated', `Updated ${this.activeType().toUpperCase()} diagram.`);
    }, 600);
  }
}
