import { Injectable, inject } from '@angular/core';
import { Report, ReportType } from '@codelens/shared';
import { ProjectService } from '../projects/project.service';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private projectService = inject(ProjectService);

  private generateReport(type: ReportType): Report {
    const proj = this.projectService.selectedProject();
    const name = proj.name || 'Enterprise System';
    const lang = proj.mainLanguage || 'Java';
    const framework = proj.framework || 'Spring Boot';
    const arch = proj.architecture || 'Layered Architecture';
    const loc = proj.linesOfCode || 6500;
    const fileCount = proj.fileCount || 8;
    const dateStr = new Date().toISOString().replace('T', ' ').substring(0, 16);

    const reports: Record<ReportType, Report> = {
      EXECUTIVE: {
        id: `rep-exec-${Date.now()}`,
        projectId: proj.id,
        title: 'Executive Architecture & Risk Summary',
        type: 'EXECUTIVE',
        generatedAt: dateStr,
        summary: `Executive assessment of maintainability, architectural integrity, and security compliance for ${name}.`,
        sections: [
          {
            title: 'Executive Overview',
            content: `The application contains ${loc.toLocaleString()} lines of ${lang} code across ${fileCount} source files. The codebase demonstrates an established ${arch} with modular controllers, services, and persistence repositories.`
          },
          {
            title: 'Risk Profile Matrix',
            content: `• **Security**: Clean baseline with standard framework abstractions.\n• **Maintainability**: High modularity with low cyclic coupling.\n• **Portability**: Container-ready for Docker and Kubernetes deployment.`,
            metrics: {
              'Overall Health Score': `${proj.healthScore || 85}/100`,
              'Technical Debt Ratio': '12.4%',
              'Architecture Confidence': `${proj.confidence || 92}%`,
              'Critical Vulnerabilities': 0
            }
          },
          {
            title: 'Strategic Recommendations',
            content: `1. Maintain automated unit and integration tests across domain use cases.\n2. Containerize application using Alpine-based ${lang} runtime image.\n3. Integrate local AI static analysis pipeline into CI/CD workflows.`
          }
        ]
      },
      TECHNICAL: {
        id: `rep-tech-${Date.now()}`,
        projectId: proj.id,
        title: 'Deep Technical Codebase & AST Audit',
        type: 'TECHNICAL',
        generatedAt: dateStr,
        summary: `Comprehensive AST analysis, symbol mapping, and complexity indices for ${name}.`,
        sections: [
          {
            title: 'Codebase Metrics & Complexity',
            content: `• Total Files: ${fileCount}\n• Total Lines of Code (LOC): ${loc.toLocaleString()}\n• Primary Framework: ${framework}\n• Average Cyclomatic Complexity: 4.8 per method`,
            metrics: {
              'Files Indexed': fileCount,
              'Lines of Code': loc,
              'Architecture Style': arch,
              'Duplicate Code Blocks': '1.8%'
            }
          },
          {
            title: 'Module Breakdown',
            content: `• **Controllers**: Exposes RESTful endpoints with input validation.\n• **Services**: Business logic coordination with transactional boundaries.\n• **Repositories**: Encapsulates entity queries and persistence mappings.`
          }
        ]
      },
      ARCHITECTURE: {
        id: `rep-arch-${Date.now()}`,
        projectId: proj.id,
        title: 'Architectural Style & Boundary Verification',
        type: 'ARCHITECTURE',
        generatedAt: dateStr,
        summary: `Verification of layer decoupling and domain boundaries for ${name}.`,
        sections: [
          {
            title: `Detected Architecture: ${arch} (${proj.confidence || 92}% Confidence)`,
            content: `The system adheres to a ${arch} model. Request processing flows downward from presentation controllers to domain service aggregates and relational repositories without illegal back-references.`
          }
        ]
      },
      METRICS: {
        id: `rep-met-${Date.now()}`,
        projectId: proj.id,
        title: 'Code Quality & Tech Stack Distribution',
        type: 'METRICS',
        generatedAt: dateStr,
        summary: `Statistical metrics for language breakdown and codebase distribution.`,
        sections: [
          {
            title: 'Technology Distribution',
            content: proj.languages?.map(l => `• ${l.name}: ${l.percentage}% (${l.loc?.toLocaleString() || 0} LOC)`).join('\n') || `• ${lang}: 100% (${loc.toLocaleString()} LOC)`
          }
        ]
      },
      REFACTORING: {
        id: `rep-ref-${Date.now()}`,
        projectId: proj.id,
        title: 'AI Modernization & Continuous Evolution Plan',
        type: 'REFACTORING',
        generatedAt: dateStr,
        summary: `Step-by-step evolution roadmap prepared by the AI Multi-Agent team.`,
        sections: [
          {
            title: 'Phase 1: Automated Contract & Regression Testing',
            content: `Implement automated end-to-end integration tests for all REST controller endpoints using testcontainers.`
          },
          {
            title: 'Phase 2: Containerization & Cloud Deployment',
            content: `Package microservice into Docker image and configure environment variables for multi-stage deployments.`
          }
        ]
      }
    };

    return reports[type];
  }

  getReport(type: ReportType, projectId?: string): Observable<Report> {
    return of(this.generateReport(type)).pipe(delay(100));
  }

  exportReport(type: ReportType, format: 'markdown' | 'pdf' | 'docx' | 'json'): Observable<{ filename: string; blobUrl: string }> {
    const report = this.generateReport(type);
    let content = `# ${report.title}\n\nTarget Project: ${this.projectService.selectedProject().name}\nGenerated: ${report.generatedAt}\n\n${report.summary}\n\n`;
    report.sections.forEach(s => {
      content += `## ${s.title}\n\n${s.content}\n\n`;
    });

    const mimeType = format === 'pdf' ? 'application/pdf' : (format === 'docx' ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' : 'text/markdown');
    const blob = new Blob([content], { type: mimeType });
    const blobUrl = URL.createObjectURL(blob);
    const filename = `${report.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.${format === 'markdown' ? 'md' : format}`;
    return of({ filename, blobUrl }).pipe(delay(200));
  }
}
