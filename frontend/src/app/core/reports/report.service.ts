import { Injectable } from '@angular/core';
import { Report, ReportType } from '@codelens/shared';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private mockReports: Record<ReportType, Report> = {
    EXECUTIVE: {
      id: 'rep-exec-1',
      projectId: 'proj-banking-core',
      title: 'Executive Architecture & Risk Summary',
      type: 'EXECUTIVE',
      generatedAt: '2026-08-24 16:00',
      summary: 'Executive-level assessment of code maintainability, security compliance, architectural debt, and migration effort for Legacy Banking Core.',
      sections: [
        {
          title: 'Executive Overview',
          content: 'The application contains 245,800 lines of Java and PL/SQL code. While functional and actively processing transactions, the codebase exhibits critical maintenance and security liabilities: outdated cryptographic algorithms, high coupling in core services, and lack of automated regression tests for legacy database routines.'
        },
        {
          title: 'Risk Profile Matrix',
          content: '• **Security**: High risk due to legacy password hashing routines.\n• **Maintainability**: Medium-High risk due to 28% cyclic component coupling.\n• **Portability**: Low portability caused by direct Oracle PL/SQL dependencies.',
          metrics: {
            'Overall Health Score': '68/100',
            'Technical Debt Ratio': '24.5%',
            'Estimated Modernization Effort': '4-6 Sprints',
            'Critical Vulnerabilities': 1
          }
        },
        {
          title: 'Strategic Recommendations',
          content: '1. Immediately patch password hashing in \`AuthService.java\` to BCrypt (Est. 2 days).\n2. Isolate native PL/SQL stored procedures behind repository interfaces before cloud database migration.\n3. Implement automated contract tests for the 18 REST endpoints.'
        }
      ]
    },
    TECHNICAL: {
      id: 'rep-tech-1',
      projectId: 'proj-banking-core',
      title: 'Deep Technical Codebase & AST Audit',
      type: 'TECHNICAL',
      generatedAt: '2026-08-24 16:05',
      summary: 'Comprehensive analysis of abstract syntax trees, symbol dependencies, method complexity, and dead code candidates.',
      sections: [
        {
          title: 'Codebase Metrics & Complexity',
          content: '• Total Files: 1,842\n• Total Lines of Code (LOC): 245,800\n• Average Cyclomatic Complexity: 14.2 per method\n• Highest Complexity Module: \`TransactionService.processTransfer\` (Cyclomatic complexity = 28)',
          metrics: {
            'Classes': 420,
            'Methods': 1280,
            'Unit Test Coverage': '34%',
            'Duplicate Code Blocks': '6.4%'
          }
        },
        {
          title: 'Module Breakdown',
          content: '• \`controllers\` (18 classes): High adherence to REST conventions, but lacks OpenAPI annotations.\n• \`services\` (26 classes): Heavy business logic, high coupling to persistence.\n• \`repositories\` (34 interfaces): Good JPA coverage, but mixed with raw JDBC.'
        }
      ]
    },
    ARCHITECTURE: {
      id: 'rep-arch-1',
      projectId: 'proj-banking-core',
      title: 'Architectural Style & Boundary Verification',
      type: 'ARCHITECTURE',
      generatedAt: '2026-08-24 16:10',
      summary: 'Verification of horizontal and vertical boundaries against Clean / Hexagonal / Layered reference models.',
      sections: [
        {
          title: 'Detected Architecture: Layered (94% Confidence)',
          content: 'The system strictly maintains horizontal layers (Controllers -> Services -> Repositories). However, architectural degradation was detected in 3 service classes where controllers and native DB connections bypass abstraction layers.'
        }
      ]
    },
    METRICS: {
      id: 'rep-met-1',
      projectId: 'proj-banking-core',
      title: 'Code Quality, Test Coverage & Tech Stack Breakdown',
      type: 'METRICS',
      generatedAt: '2026-08-24 16:15',
      summary: 'Statistical metrics for language distribution, comment ratios, test coverage, and cyclomatic indices.',
      sections: [
        {
          title: 'Language Breakdown',
          content: '• Java: 68% (167,144 LOC)\n• PL/SQL: 18% (44,244 LOC)\n• XML / WSDL: 9% (22,122 LOC)\n• Shell Scripts: 5% (12,290 LOC)'
        }
      ]
    },
    REFACTORING: {
      id: 'rep-ref-1',
      projectId: 'proj-banking-core',
      title: 'AI Modernization & Refactoring Action Plan',
      type: 'REFACTORING',
      generatedAt: '2026-08-24 16:20',
      summary: 'Step-by-step roadmap to eliminate architectural debt, modernize Java version, and extract microservices.',
      sections: [
        {
          title: 'Phase 1: Security & Compliance Patching',
          content: 'Upgrade password hashing in \`AuthService.java\` to BCrypt. Add rate limiting to \`AuthController.java\`.'
        },
        {
          title: 'Phase 2: Database Decoupling',
          content: 'Extract native PL/SQL stored procedures into domain service logic with Spring Data JpaRepository.'
        },
        {
          title: 'Phase 3: Service Extraction',
          content: 'Extract Transaction Engine into an autonomous microservice with gRPC and Kafka event stream.'
        }
      ]
    }
  };

  getReport(type: ReportType, projectId = 'proj-banking-core'): Observable<Report> {
    const rep = this.mockReports[type] || this.mockReports.EXECUTIVE;
    return of(rep).pipe(delay(250));
  }

  exportReport(type: ReportType, format: 'pdf' | 'markdown' | 'docx' | 'json'): Observable<{ filename: string; blobUrl: string }> {
    const report = this.mockReports[type] || this.mockReports.EXECUTIVE;
    let content = `# ${report.title}\n\nGenerated by LegacyAI on ${report.generatedAt}\n\n## Summary\n${report.summary}\n\n`;
    
    report.sections.forEach(s => {
      content += `## ${s.title}\n${s.content}\n\n`;
      if (s.metrics) {
        content += `| Metric | Value |\n|---|---|\n`;
        Object.entries(s.metrics).forEach(([k, v]) => {
          content += `| ${k} | ${v} |\n`;
        });
        content += `\n`;
      }
    });

    const blob = new Blob([content], { type: format === 'json' ? 'application/json' : 'text/markdown' });
    const blobUrl = URL.createObjectURL(blob);
    const filename = `${report.projectId}-${report.type.toLowerCase()}-report.${format === 'markdown' ? 'md' : format}`;

    return of({ filename, blobUrl }).pipe(delay(300));
  }
}
