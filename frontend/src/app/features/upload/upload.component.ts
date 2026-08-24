import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProjectService } from '../../core/projects/project.service';
import { SettingsService } from '../../core/settings/settings.service';
import { NotificationService } from '../../core/notifications/notification.service';
import { AnalysisService } from '../../core/analysis/analysis.service';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent {
  projectService = inject(ProjectService);
  settingsService = inject(SettingsService);
  notificationService = inject(NotificationService);
  analysisService = inject(AnalysisService);
  router = inject(Router);

  currentStep = signal<number>(1);
  sourceType = signal<'zip' | 'git' | 'folder'>('zip');
  
  // Drag and drop state
  isDragging = signal<boolean>(false);
  uploadedFile = signal<File | null>(null);
  uploadProgress = signal<number>(0);
  isUploading = signal<boolean>(false);

  // Project configuration
  projectName = signal<string>('Legacy Core Service');
  gitRepoUrl = signal<string>('https://github.com/enterprise/legacy-core-service.git');
  gitBranch = signal<string>('main');
  gitToken = signal<string>('');
  mainLanguage = signal<string>('Java');
  framework = signal<string>('Spring Boot 2.x');
  analysisDepth = signal<'quick' | 'standard' | 'deep'>('deep');

  // AI Configuration
  selectedModel = signal<string>('deepseek-coder-33b');
  contextWindow = signal<string>('32k');
  docLevel = signal<'minimal' | 'standard' | 'enterprise'>('enterprise');
  detectArchitecture = signal<boolean>(true);
  analyzeDependencies = signal<boolean>(true);
  generateUml = signal<boolean>(true);
  buildKnowledgeBase = signal<boolean>(true);

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(true);
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      this.handleFile(event.dataTransfer.files[0]);
    }
  }

  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.handleFile(target.files[0]);
    }
  }

  private handleFile(file: File) {
    this.uploadedFile.set(file);
    this.projectName.set(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
    this.isUploading.set(true);
    this.uploadProgress.set(15);

    const interval = setInterval(() => {
      const p = this.uploadProgress() + 25;
      if (p >= 100) {
        this.uploadProgress.set(100);
        this.isUploading.set(false);
        clearInterval(interval);
        this.notificationService.success('Archive Uploaded', `${file.name} ready for configuration.`);
      } else {
        this.uploadProgress.set(p);
      }
    }, 200);
  }

  nextStep() {
    this.currentStep.update(s => Math.min(4, s + 1));
  }

  prevStep() {
    this.currentStep.update(s => Math.max(1, s - 1));
  }

  startAnalysis() {
    const projData = {
      name: this.projectName(),
      repositoryUrl: this.sourceType() === 'git' ? this.gitRepoUrl() : undefined,
      mainLanguage: this.mainLanguage(),
      framework: this.framework(),
      branch: this.gitBranch()
    };

    this.projectService.createProject(projData).subscribe(newProj => {
      this.analysisService.restartSimulation(newProj.id);
      this.notificationService.info('Analysis Started', `AI analysis pipeline initiated for ${newProj.name}`);
      this.router.navigate(['/analysis-progress']);
    });
  }
}
