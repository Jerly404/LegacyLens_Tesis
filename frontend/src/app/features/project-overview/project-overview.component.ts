import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ProjectService } from '../../core/projects/project.service';
import { ArchitectureService } from '../../core/architecture/architecture.service';
import { NotificationService } from '../../core/notifications/notification.service';
import { TranslationService } from '../../core/i18n/translation.service';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { CodeViewerComponent } from '../../shared/components/code-viewer/code-viewer.component';
import { DependencyGraphComponent } from '../../shared/components/dependency-graph/dependency-graph.component';
import { FileNode, DependencyGraphData } from '@codelens/shared';

@Component({
  selector: 'app-project-overview',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    RouterModule, 
    BadgeComponent, 
    CodeViewerComponent, 
    DependencyGraphComponent
  ],
  templateUrl: './project-overview.component.html',
  styleUrls: ['./project-overview.component.css']
})
export class ProjectOverviewComponent implements OnInit {
  projectService = inject(ProjectService);
  architectureService = inject(ArchitectureService);
  notificationService = inject(NotificationService);
  translationService = inject(TranslationService);
  router = inject(Router);

  activeTab = signal<'overview' | 'files' | 'dependencies' | 'metrics'>('overview');
  fileTree = signal<FileNode[]>([]);
  selectedFile = signal<FileNode | null>(null);
  dependencyData = signal<DependencyGraphData>({ nodes: [], links: [] });
  fileSearchQuery = signal<string>('');

  ngOnInit() {
    const files = this.projectService.getFileTree();
    this.fileTree.set(files);
    
    // Select first leaf file by default
    if (files.length > 0 && files[0].children && files[0].children.length > 0 && files[0].children[0].children) {
      this.selectedFile.set(files[0].children[0].children[0]);
    }

    this.dependencyData.set(this.projectService.getDependencyGraph());
  }

  selectFile(file: FileNode) {
    if (file.type === 'file') {
      this.selectedFile.set(file);
      this.notificationService.info('File Opened', file.path);
    }
  }

  askAiAboutCode(code: string) {
    this.notificationService.info('Opening AI Assistant', 'Querying context for selected code...');
    this.router.navigate(['/ai-chat']);
  }

  explainCode(code: string) {
    this.notificationService.info('Generating Explanation', 'Qwen 2.5 Coder is analyzing class AST...');
    this.router.navigate(['/ai-chat']);
  }

  explainWithAI(file: any) {
    this.notificationService.info('Generating Explanation', 'Qwen 2.5 Coder is analyzing class AST...');
    this.router.navigate(['/ai-chat']);
  }

  reanalyze() {
    this.router.navigate(['/analysis-progress']);
  }
}
