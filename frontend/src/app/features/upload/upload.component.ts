import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProjectService } from '../../core/projects/project.service';
import { SettingsService } from '../../core/settings/settings.service';
import { NotificationService } from '../../core/notifications/notification.service';
import { AnalysisService } from '../../core/analysis/analysis.service';
import { TranslatePipe } from '../../core/i18n/translate.pipe';

export interface MultiAgentConfig {
  id: string;
  name: string;
  role: string;
  icon: string;
  enabled: boolean;
  model: string;
}

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe],
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
  sourceType = signal<'git' | 'zip' | 'folder'>('git');
  
  // Drag & drop state
  isDragging = signal<boolean>(false);
  uploadedFile = signal<File | null>(null);
  uploadProgress = signal<number>(0);
  isUploading = signal<boolean>(false);
  isDetecting = signal<boolean>(false);

  // Project configuration
  projectName = signal<string>('My Enterprise Repository');
  gitRepoUrl = signal<string>('https://github.com/my-org/core-service.git');
  gitBranch = signal<string>('main');
  gitToken = signal<string>('');

  // Auto-detected Stack Properties
  detectedLanguage = signal<string>('Java');
  detectedFramework = signal<string>('Spring Boot 3.x / Hibernate');
  detectedArchitecture = signal<string>('Layered Architecture');
  estimatedLoc = signal<number>(45000);
  estimatedFiles = signal<number>(380);
  detectedBreakdown = signal<Array<{ name: string; percentage: number; color: string }>>([
    { name: 'Java', percentage: 70, color: '#f89820' },
    { name: 'SQL', percentage: 18, color: '#10B981' },
    { name: 'XML / Config', percentage: 12, color: '#A855F7' }
  ]);

  // Multi-Agent Architecture Team Configuration
  agentTeam = signal<MultiAgentConfig[]>([
    { id: 'orchestrator', name: 'Master Orchestrator Agent', role: 'Coordinates execution flow, task decomposition and result synthesis', icon: 'psychology', enabled: true, model: 'Qwen 2.5 Coder 7B' },
    { id: 'code_analysis', name: 'Code Analysis Agent', role: 'Extracts AST nodes, symbols, classes, methods and cyclomatic complexity', icon: 'code', enabled: true, model: 'Qwen 2.5 Coder 7B' },
    { id: 'architecture', name: 'Architecture Agent', role: 'Recovers high-level design patterns (Layered, Clean, Hexagonal, MVC)', icon: 'account_tree', enabled: true, model: 'Qwen 2.5 Coder 7B' },
    { id: 'dependency', name: 'Dependency Agent', role: 'Parses package manifests and constructs multi-tier call graphs', icon: 'schema', enabled: true, model: 'Qwen 2.5 Coder 7B' },
    { id: 'documentation', name: 'Documentation Agent', role: 'Generates OpenAPI specs, database dictionaries and system docs', icon: 'description', enabled: true, model: 'Qwen 2.5 Coder 7B' },
    { id: 'security', name: 'Security & Audit Agent', role: 'Detects hardcoded secrets, SQL injection risks and auth anti-patterns', icon: 'security', enabled: true, model: 'Qwen 2.5 Coder 7B' },
    { id: 'testing', name: 'Testing Advisor Agent', role: 'Analyzes test coverage gaps and suggests unit/integration test suites', icon: 'checklist', enabled: true, model: 'Qwen 2.5 Coder 7B' }
  ]);

  autoDetectStack() {
    this.isDetecting.set(true);
    const url = this.gitRepoUrl().toLowerCase();
    const fileName = (this.uploadedFile()?.name || '').toLowerCase();
    const combined = url + ' ' + fileName;

    setTimeout(() => {
      if (combined.includes('ehr') || combined.includes('clinical') || combined.includes('patient') || combined.includes('health')) {
        this.projectName.set('Clinical Electronic Health Record (EHR) API');
        this.detectedLanguage.set('Python');
        this.detectedFramework.set('FastAPI & Async SQLAlchemy 2.0 / PostgreSQL');
        this.detectedArchitecture.set('Layered Architecture');
        this.detectedBreakdown.set([
          { name: 'Python', percentage: 80, color: '#3572A5' },
          { name: 'SQL / ORM', percentage: 15, color: '#336791' },
          { name: 'Docker / YAML', percentage: 5, color: '#384d54' }
        ]);
      } else if (combined.includes('csharp') || combined.includes('.net') || combined.includes('dotnet') || combined.includes('.cs')) {
        this.projectName.set('C# .NET Enterprise Core');
        this.detectedLanguage.set('C#');
        this.detectedFramework.set('.NET 8 / ASP.NET Core & Entity Framework');
        this.detectedArchitecture.set('Clean Architecture');
        this.detectedBreakdown.set([
          { name: 'C#', percentage: 76, color: '#178600' },
          { name: 'T-SQL', percentage: 14, color: '#e38c00' },
          { name: 'JSON/Config', percentage: 10, color: '#555555' }
        ]);
      } else if (combined.includes('python') || combined.includes('django') || combined.includes('flask') || combined.includes('fastapi') || combined.includes('.py')) {
        this.projectName.set('Python Data & API Gateway');
        this.detectedLanguage.set('Python');
        this.detectedFramework.set('FastAPI & SQLAlchemy / Celery');
        this.detectedArchitecture.set('Microservices Architecture');
        this.detectedBreakdown.set([
          { name: 'Python', percentage: 84, color: '#3572A5' },
          { name: 'SQL', percentage: 10, color: '#336791' },
          { name: 'Docker/YAML', percentage: 6, color: '#384d54' }
        ]);
      } else if (combined.includes('node') || combined.includes('nest') || combined.includes('angular') || combined.includes('react') || combined.includes('typescript') || combined.includes('.ts')) {
        this.projectName.set('TypeScript Fullstack Monorepo');
        this.detectedLanguage.set('TypeScript');
        this.detectedFramework.set('NestJS & Prisma / PostgreSQL');
        this.detectedArchitecture.set('Hexagonal Architecture');
        this.detectedBreakdown.set([
          { name: 'TypeScript', percentage: 82, color: '#3178C6' },
          { name: 'HTML/CSS', percentage: 12, color: '#E34F26' },
          { name: 'SQL', percentage: 6, color: '#336791' }
        ]);
      } else if (combined.includes('php') || combined.includes('laravel') || combined.includes('symfony') || combined.includes('.php')) {
        this.projectName.set('PHP Web Application');
        this.detectedLanguage.set('PHP');
        this.detectedFramework.set('Laravel / Blade & MySQL');
        this.detectedArchitecture.set('MVC Architecture');
        this.detectedBreakdown.set([
          { name: 'PHP', percentage: 68, color: '#4F5D95' },
          { name: 'JavaScript', percentage: 20, color: '#F7DF1E' },
          { name: 'SQL', percentage: 12, color: '#336791' }
        ]);
      } else if (combined.includes('go') || combined.includes('golang')) {
        this.projectName.set('Go Distributed Microservice');
        this.detectedLanguage.set('Go');
        this.detectedFramework.set('Go 1.22 / gRPC & Kafka');
        this.detectedArchitecture.set('Event-Driven Architecture');
        this.detectedBreakdown.set([
          { name: 'Go', percentage: 90, color: '#00ADD8' },
          { name: 'Protobuf', percentage: 10, color: '#555555' }
        ]);
      } else {
        this.projectName.set('Java Enterprise System');
        this.detectedLanguage.set('Java');
        this.detectedFramework.set('Spring Boot & Hibernate');
        this.detectedArchitecture.set('Layered Architecture');
        this.detectedBreakdown.set([
          { name: 'Java', percentage: 70, color: '#f89820' },
          { name: 'SQL', percentage: 18, color: '#10B981' },
          { name: 'XML / Config', percentage: 12, color: '#A855F7' }
        ]);
      }

      this.isDetecting.set(false);
      this.notificationService.success('Stack Auto-Detected', `Found ${this.detectedLanguage()} · ${this.detectedFramework()}`);
    }, 400);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging.set(true);
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
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
    this.uploadProgress.set(25);

    const interval = setInterval(() => {
      const p = this.uploadProgress() + 25;
      if (p >= 100) {
        this.uploadProgress.set(100);
        this.isUploading.set(false);
        clearInterval(interval);
        this.autoDetectStack();
      } else {
        this.uploadProgress.set(p);
      }
    }, 150);
  }

  toggleAgent(id: string) {
    this.agentTeam.update(list => list.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a));
  }

  nextStep() {
    if (this.currentStep() === 1) {
      this.autoDetectStack();
    }
    this.currentStep.update(s => Math.min(4, s + 1));
  }

  prevStep() {
    this.currentStep.update(s => Math.max(1, s - 1));
  }

  startAnalysis() {
    const projData = {
      name: this.projectName(),
      repositoryUrl: this.sourceType() === 'git' ? this.gitRepoUrl() : undefined,
      mainLanguage: this.detectedLanguage(),
      framework: this.detectedFramework(),
      branch: this.gitBranch(),
      architecture: this.detectedArchitecture(),
      confidence: 94
    };

    this.projectService.createProject(projData).subscribe(newProj => {
      this.analysisService.restartSimulation(newProj.id);
      this.notificationService.info('Multi-Agent Analysis Started', `Orchestrator dispatched tasks for ${newProj.name}`);
      this.router.navigate(['/analysis-progress']);
    });
  }
}
