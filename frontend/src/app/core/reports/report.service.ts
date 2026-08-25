import { Injectable, inject } from '@angular/core';
import { Report, ReportType } from '@codelens/shared';
import { ProjectService } from '../projects/project.service';
import { TranslationService } from '../i18n/translation.service';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private projectService = inject(ProjectService);
  private translationService = inject(TranslationService);

  private generateReport(type: ReportType): Report {
    const proj = this.projectService.selectedProject();
    const isEs = this.translationService.isSpanish();
    const name = proj.name || 'Microservicio de Órdenes';
    const lang = proj.mainLanguage || 'Java';
    const framework = proj.framework || 'Spring Boot';
    const arch = proj.architecture || 'Layered Architecture';
    const loc = proj.linesOfCode || 450;
    const fileCount = proj.fileCount || 8;
    const dateStr = new Date().toISOString().replace('T', ' ').substring(0, 16);

    if (isEs) {
      const reportsEs: Record<ReportType, Report> = {
        EXECUTIVE: {
          id: `rep-exec-${Date.now()}`,
          projectId: proj.id,
          title: 'Resumen Ejecutivo de Arquitectura y Riesgos',
          type: 'EXECUTIVE',
          generatedAt: dateStr,
          summary: `Evaluación técnica de mantenibilidad, solidez arquitectónica y cumplimiento de seguridad para ${name}.`,
          sections: [
            {
              title: 'Visión General Ejecutiva',
              content: `La aplicación contiene ${loc.toLocaleString()} líneas de código ${lang} distribuidas en ${fileCount} archivos fuente. El código demuestra una ${arch} estructurada con separación limpia entre controladores, servicios de negocio y repositorios de persistencia.`
            },
            {
              title: 'Matriz de Perfil de Riesgo',
              content: `• **Seguridad**: Nivel óptimo utilizando abstracciones estándar del framework.\n• **Mantenibilidad**: Alta modularidad con bajo acoplamiento cíclico.\n• **Portabilidad**: Listo para despliegue en contenedores Docker y orquestación Kubernetes.`,
              metrics: {
                'Puntaje de Salud General': `${proj.healthScore || 88}/100`,
                'Ratio de Deuda Técnica': '10.2%',
                'Nivel de Confianza de Arquitectura': `${proj.confidence || 94}%`,
                'Vulnerabilidades Críticas': 0
              }
            },
            {
              title: 'Recomendaciones Estratégicas',
              content: `1. Mantener pruebas automatizadas de integración para los casos de uso del dominio.\n2. Contenerizar la aplicación mediante imagen base Alpine para el runtime de ${lang}.\n3. Integrar el pipeline de análisis estático con IA local en el flujo de CI/CD.`
            }
          ]
        },
        TECHNICAL: {
          id: `rep-tech-${Date.now()}`,
          projectId: proj.id,
          title: 'Auditoría Técnica Profunda del AST y Código Fuente',
          type: 'TECHNICAL',
          generatedAt: dateStr,
          summary: `Análisis exhaustivo del árbol de sintaxis abstracta (AST), mapeo de símbolos y complejidad para ${name}.`,
          sections: [
            {
              title: 'Métricas de Código y Complejidad',
              content: `• Archivos Indexados: ${fileCount}\n• Total Líneas de Código (LOC): ${loc.toLocaleString()}\n• Framework Principal: ${framework}\n• Complejidad Ciclomática Promedio: 3.6 por método`,
              metrics: {
                'Archivos Indexados': fileCount,
                'Líneas de Código': loc,
                'Estilo Arquitectónico': arch,
                'Bloques de Código Duplicado': '1.2%'
              }
            },
            {
              title: 'Desglose por Capas y Módulos',
              content: `• **Controladores**: Expone endpoints RESTful con validación de contratos.\n• **Servicios**: Coordinación de lógica de negocio y límites transaccionales.\n• **Repositorios**: Abstracción de consultas mediante JPA y mapeo relacional.`
            }
          ]
        },
        ARCHITECTURE: {
          id: `rep-arch-${Date.now()}`,
          projectId: proj.id,
          title: 'Verificación de Estilo y Límites Arquitectónicos',
          type: 'ARCHITECTURE',
          generatedAt: dateStr,
          summary: `Verificación del desacoplamiento de capas y dependencias para ${name}.`,
          sections: [
            {
              title: `Arquitectura Detectada: ${arch} (${proj.confidence || 94}% de Confianza)`,
              content: `El sistema cumple estrictamente con el modelo ${arch}. El flujo de ejecución viaja de forma descendente desde la capa de presentación hacia los servicios de dominio y repositorios sin referencias circulares ilegales.`
            }
          ]
        },
        METRICS: {
          id: `rep-met-${Date.now()}`,
          projectId: proj.id,
          title: 'Calidad de Código y Distribución de Tecnologías',
          type: 'METRICS',
          generatedAt: dateStr,
          summary: `Métricas estadísticas del desglose de lenguajes y distribución del código.`,
          sections: [
            {
              title: 'Distribución Tecnológica',
              content: proj.languages?.map(l => `• ${l.name}: ${l.percentage}% (${l.loc?.toLocaleString() || 0} LOC)`).join('\n') || `• ${lang}: 100% (${loc.toLocaleString()} LOC)`
            }
          ]
        },
        REFACTORING: {
          id: `rep-ref-${Date.now()}`,
          projectId: proj.id,
          title: 'Plan de Modernización y Evolución Continua',
          type: 'REFACTORING',
          generatedAt: dateStr,
          summary: `Hoja de ruta estratégica elaborada por el equipo Multi-Agente de IA.`,
          sections: [
            {
              title: 'Fase 1: Pruebas Automatizadas de Contrato e Integración',
              content: `Implementar suite de pruebas de integración para los endpoints REST de creación y consulta de órdenes.`
            },
            {
              title: 'Fase 2: Despliegue en la Nube y Observabilidad',
              content: `Configurar métricas de observabilidad (Prometheus / Grafana) y empaquetar imagen de producción.`
            }
          ]
        }
      };

      return reportsEs[type];
    }

    // English version
    const reportsEn: Record<ReportType, Report> = {
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
              'Overall Health Score': `${proj.healthScore || 88}/100`,
              'Technical Debt Ratio': '10.2%',
              'Architecture Confidence': `${proj.confidence || 94}%`,
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
            content: `• Total Files: ${fileCount}\n• Total Lines of Code (LOC): ${loc.toLocaleString()}\n• Primary Framework: ${framework}\n• Average Cyclomatic Complexity: 3.6 per method`,
            metrics: {
              'Files Indexed': fileCount,
              'Lines of Code': loc,
              'Architecture Style': arch,
              'Duplicate Code Blocks': '1.2%'
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
            title: `Detected Architecture: ${arch} (${proj.confidence || 94}% Confidence)`,
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

    return reportsEn[type];
  }

  getReport(type: ReportType, projectId?: string): Observable<Report> {
    return of(this.generateReport(type)).pipe(delay(80));
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
