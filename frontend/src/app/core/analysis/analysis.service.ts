import { Injectable, signal, inject } from '@angular/core';
import { AnalysisProgress, AnalysisStage } from '@codelens/shared';
import { ProjectService } from '../projects/project.service';
import { Observable, interval } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnalysisService {
  private projectService = inject(ProjectService);

  private stageDefinitions = [
    { id: 'stage-1', name: 'Master Orchestrator Agent', description: 'Decompressing repository, indexing files, and planning agent execution graph' },
    { id: 'stage-2', name: 'Code Analysis Agent (AST)', description: 'Extracting abstract syntax trees, classes, methods, and cyclomatic complexity' },
    { id: 'stage-3', name: 'Architecture Classifier Agent', description: 'Pattern matching against Layered, Clean, Hexagonal, MVC, and Monolithic styles' },
    { id: 'stage-4', name: 'Dependency & Graph Agent', description: 'Tracing multi-tier call hierarchy (Controllers -> Services -> DB) and manifests' },
    { id: 'stage-5', name: 'Documentation & UML Agent', description: 'Generating OpenAPI specs, Database ERD schemas, and technical manuals' },
    { id: 'stage-6', name: 'Security & Testing Advisor Agent', description: 'Auditing auth anti-patterns, test coverage gaps, and indexing vector store (RAG)' }
  ];

  private analysisState = signal<AnalysisProgress>({
    projectId: 'proj-active',
    progress: 100,
    status: 'COMPLETED',
    currentStage: 'Multi-Agent Analysis Completed Successfully',
    stages: this.stageDefinitions.map(s => ({ ...s, status: 'completed' as const, progress: 100 })),
    filesProcessed: 34,
    totalFiles: 34,
    estimatedRemainingTime: '00:00',
    processingSpeed: '28 files/sec',
    logs: [
      '[00:01] [Orchestrator] Multi-agent virtual team initialized on local Qwen 2.5 Coder 7B (RTX 3050).',
      '[00:03] [Code Agent] Parsed AST syntax trees, classes, functions, and complexity metrics.',
      '[00:06] [Architecture Agent] Detected Layered Architecture with clear service boundaries.',
      '[00:09] [Dependency Agent] Traced module call hierarchy and package manifests.',
      '[00:12] [Doc & UML Agent] Generated OpenAPI 3.0 contracts, Database ERD Schema, and C4 models.',
      '[00:15] [Security Agent] Audited auth endpoints and indexed AST symbols into vector store (RAG).'
    ]
  });

  currentAnalysis = this.analysisState.asReadonly();

  getAnalysisProgress(projectId?: string): Observable<AnalysisProgress> {
    return new Observable<AnalysisProgress>(subscriber => {
      subscriber.next(this.analysisState());
      
      // Steady, realistic pacing for detailed multi-agent reasoning (~15-18 seconds total)
      const sub = interval(350).subscribe(() => {
        const curr = this.analysisState();
        if (curr.progress < 100) {
          const nextProgress = Math.min(100, curr.progress + 2);
          const nextProcessed = Math.min(curr.totalFiles, Math.ceil((nextProgress / 100) * curr.totalFiles));
          
          // Determine which of the 6 stages is active
          const stageIndex = Math.min(5, Math.floor((nextProgress / 100) * 6));
          const stages = this.stageDefinitions.map((s, idx) => {
            if (idx < stageIndex || nextProgress >= 100) {
              return { ...s, status: 'completed' as const, progress: 100 };
            } else if (idx === stageIndex) {
              const stagePct = Math.min(99, Math.round(((nextProgress % 17) / 17) * 100) || 40);
              return { ...s, status: 'in_progress' as const, progress: stagePct };
            } else {
              return { ...s, status: 'pending' as const, progress: 0 };
            }
          });

          const currentStageName = nextProgress >= 100 
            ? 'Multi-Agent Analysis Completed Successfully' 
            : `${this.stageDefinitions[stageIndex].name} en ejecución...`;

          const newLogs = [...curr.logs];
          const timeStr = new Date().toLocaleTimeString();

          if (stageIndex === 1 && newLogs.length === 1) {
            newLogs.push(`[${timeStr}] [Code Agent] Extrayendo árbol AST, clases, métodos y complejidad ciclomática.`);
          } else if (stageIndex === 1 && nextProgress >= 28 && newLogs.length === 2) {
            newLogs.push(`[${timeStr}] [Code Agent] Indexadas 14 clases del dominio y 38 funciones asíncronas.`);
          } else if (stageIndex === 2 && newLogs.length === 3) {
            newLogs.push(`[${timeStr}] [Architecture Agent] Verificando patrones Layered Architecture vs Clean/Hexagonal.`);
          } else if (stageIndex === 2 && nextProgress >= 45 && newLogs.length === 4) {
            newLogs.push(`[${timeStr}] [Architecture Agent] Verificadas fronteras de capas: Routers -> Services -> Models -> DB.`);
          } else if (stageIndex === 3 && newLogs.length === 5) {
            newLogs.push(`[${timeStr}] [Dependency Agent] Resolviendo dependencias de paquetes y grafos de llamadas internas.`);
          } else if (stageIndex === 4 && newLogs.length === 6) {
            newLogs.push(`[${timeStr}] [Doc & UML Agent] Compilando especificación OpenAPI y Esquema Relacional ERD.`);
          } else if (stageIndex === 5 && newLogs.length === 7) {
            newLogs.push(`[${timeStr}] [Security Agent] Auditando flujos de autenticación, JWT y vectorizando memoria RAG.`);
          } else if (nextProgress >= 100 && newLogs.length === 8) {
            newLogs.push(`[${timeStr}] [Orchestrator] Análisis multi-agente finalizado con 100% de confianza.`);
          }

          const isDone = nextProgress >= 100;
          const remainingSecs = Math.max(0, Math.ceil((100 - nextProgress) * 0.35));
          const mins = Math.floor(remainingSecs / 60);
          const secs = remainingSecs % 60;
          const remainingTimeStr = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

          const updated: AnalysisProgress = {
            ...curr,
            progress: nextProgress,
            filesProcessed: isDone ? curr.totalFiles : nextProcessed,
            currentStage: currentStageName,
            stages,
            logs: newLogs,
            estimatedRemainingTime: isDone ? '00:00' : remainingTimeStr,
            status: isDone ? 'COMPLETED' : 'ANALYZING'
          };
          this.analysisState.set(updated);
          subscriber.next(updated);
        } else {
          subscriber.next(curr);
        }
      });

      return () => sub.unsubscribe();
    });
  }

  restartSimulation(projectId?: string) {
    const proj = this.projectService.selectedProject();
    const totalFiles = Math.max(12, proj?.fileCount || 34);

    const freshStages = this.stageDefinitions.map((s, idx) => ({
      ...s,
      status: (idx === 0 ? 'in_progress' : 'pending') as any,
      progress: idx === 0 ? 15 : 0
    }));

    this.analysisState.set({
      projectId: projectId || proj.id,
      progress: 3,
      status: 'ANALYZING',
      currentStage: 'Master Orchestrator Agent inicializando árbol de ejecución...',
      stages: freshStages,
      filesProcessed: 1,
      totalFiles,
      estimatedRemainingTime: '00:18',
      processingSpeed: '28 files/sec',
      logs: [
        `[${new Date().toLocaleTimeString()}] [Orchestrator] Equipo virtual multi-agente asignado en GPU RTX 3050 (Qwen 2.5 Coder 7B).`
      ]
    });
  }
}
