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

  activeType = signal<UMLType>('architecture');
  currentDiagram = signal<UMLDiagram | null>(null);
  isRegenerating = signal<boolean>(false);

  tabs: Array<{ type: UMLType; label: string; icon: string }> = [
    { type: 'architecture', label: 'Fullstack Architecture', icon: 'account_tree' },
    { type: 'database', label: 'Database Schema (ERD)', icon: 'database' },
    { type: 'c4', label: 'C4 Container Model', icon: 'grid_view' },
    { type: 'class', label: 'Class Hierarchy', icon: 'class' },
    { type: 'sequence', label: 'Sequence Flow', icon: 'swap_horiz' },
    { type: 'component', label: 'Module Boundaries', icon: 'view_module' },
    { type: 'deployment', label: 'Deployment & Docker', icon: 'dns' },
    { type: 'flow', label: 'Business Process Flow', icon: 'alt_route' }
  ];

  ngOnInit() {
    this.loadDiagram(this.activeType());
  }

  loadDiagram(type: UMLType) {
    this.activeType.set(type);
    this.diagramService.getDiagram(type, this.projectService.selectedProject().id).subscribe(diag => {
      this.currentDiagram.set(diag);
    });
  }

  regenerate() {
    this.isRegenerating.set(true);
    setTimeout(() => {
      this.diagramService.getDiagram(this.activeType(), this.projectService.selectedProject().id).subscribe(diag => {
        this.currentDiagram.set(diag);
        this.isRegenerating.set(false);
        this.notificationService.success('Diagram Regenerated', `Updated ${this.activeType().toUpperCase()} diagram for ${this.projectService.selectedProject().name}`);
      });
    }, 600);
  }
}
