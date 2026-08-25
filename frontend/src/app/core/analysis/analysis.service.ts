import { Injectable, signal } from '@angular/core';
import { AnalysisProgress, AnalysisStage } from '@codelens/shared';
import { Observable, interval } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnalysisService {
  private initialStages: AnalysisStage[] = [
    { id: 'stage-1', name: 'Master Orchestrator Agent', status: 'completed', description: 'Decompressing repository, indexing files, and planning agent execution graph', progress: 100 },
    { id: 'stage-2', name: 'Code Analysis Agent (AST)', status: 'completed', description: 'Extracting abstract syntax trees, classes, methods, and cyclomatic complexity', progress: 100 },
    { id: 'stage-3', name: 'Architecture Classifier Agent', status: 'in_progress', description: 'Pattern matching against Layered, Clean, Hexagonal, MVC, and Monolithic styles', progress: 85 },
    { id: 'stage-4', name: 'Dependency & Graph Agent', status: 'in_progress', description: 'Tracing multi-tier call hierarchy (Controllers -> Services -> DB) and manifests', progress: 60 },
    { id: 'stage-5', name: 'Documentation & UML Agent', status: 'pending', description: 'Generating OpenAPI specs, Database ERD schemas, and technical manuals', progress: 0 },
    { id: 'stage-6', name: 'Security & Testing Advisor Agent', status: 'pending', description: 'Auditing auth anti-patterns, test coverage gaps, and indexing vector store (RAG)', progress: 0 }
  ];

  private initialLogs: string[] = [
    '[00:01] [Orchestrator] Repository unpacking completed. 1,842 files detected.',
    '[00:03] [Code Agent] AST Parser initialized for target grammar.',
    '[00:08] [Code Agent] Symbol resolution: 420 classes, 1,280 methods, 34 interfaces indexed.',
    '[00:14] [Architecture Agent] Layer boundaries identified: Presentation, Application, Domain, Persistence.',
    '[00:19] [Dependency Agent] Traced 12 call links between Controllers and Repositories.',
    '[00:25] [Orchestrator] Multi-agent local inference running on Qwen 2.5 Coder 7B (RTX 3050)...'
  ];

  private analysisState = signal<AnalysisProgress>({
    projectId: 'proj-banking-core',
    progress: 82,
    status: 'ANALYZING',
    currentStage: 'Architecture Agent classifying patterns...',
    stages: this.initialStages,
    filesProcessed: 1842,
    totalFiles: 2240,
    estimatedRemainingTime: '01:20',
    processingSpeed: '42 files/sec',
    logs: this.initialLogs
  });

  currentAnalysis = this.analysisState.asReadonly();

  getAnalysisProgress(projectId: string): Observable<AnalysisProgress> {
    return new Observable<AnalysisProgress>(subscriber => {
      subscriber.next(this.analysisState());
      
      const sub = interval(1500).subscribe(() => {
        const curr = this.analysisState();
        if (curr.progress < 100) {
          const nextProgress = Math.min(100, curr.progress + 3);
          const nextProcessed = Math.min(curr.totalFiles, curr.filesProcessed + 42);
          
          let nextCurrentStage = curr.currentStage;
          const stages = [...curr.stages];
          
          if (nextProgress >= 88 && stages[2].status === 'in_progress') {
            stages[2].status = 'completed';
            stages[2].progress = 100;
            stages[3].status = 'completed';
            stages[3].progress = 100;
            stages[4].status = 'in_progress';
            stages[4].progress = 50;
            nextCurrentStage = 'Documentation Agent generating specifications...';
          }
          
          if (nextProgress >= 96 && stages[4].status === 'in_progress') {
            stages[4].status = 'completed';
            stages[4].progress = 100;
            stages[5].status = 'in_progress';
            stages[5].progress = 80;
            nextCurrentStage = 'Security & Testing Agent finalizing audit & vector embeddings...';
          }

          if (nextProgress >= 100) {
            stages[5].status = 'completed';
            stages[5].progress = 100;
            nextCurrentStage = 'Multi-Agent Analysis Completed Successfully';
          }

          const newLogs = [...curr.logs];
          if (Math.random() > 0.4) {
            newLogs.push(`[${new Date().toLocaleTimeString()}] [Multi-Agent Worker] Processed batch #${Math.floor(nextProcessed / 42)}: synchronized AST symbols & call graphs.`);
          }

          const updated: AnalysisProgress = {
            ...curr,
            progress: nextProgress,
            filesProcessed: nextProcessed,
            currentStage: nextCurrentStage,
            stages,
            logs: newLogs.slice(-25),
            estimatedRemainingTime: nextProgress >= 100 ? '00:00' : '00:' + String(Math.max(1, 100 - nextProgress)).padStart(2, '0'),
            status: nextProgress >= 100 ? 'COMPLETED' : 'ANALYZING'
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

  restartSimulation(projectId = 'proj-banking-core') {
    const freshStages = this.initialStages.map((s, idx) => ({
      ...s,
      status: (idx === 0 ? 'in_progress' : 'pending') as any,
      progress: idx === 0 ? 40 : 0
    }));

    this.analysisState.set({
      projectId,
      progress: 8,
      status: 'ANALYZING',
      currentStage: 'Master Orchestrator Agent initializing...',
      stages: freshStages,
      filesProcessed: 140,
      totalFiles: 1840,
      estimatedRemainingTime: '02:30',
      processingSpeed: '46 files/sec',
      logs: ['[00:00] [Orchestrator] Multi-agent virtual team assigned: Code, Architecture, Dependency, Documentation, Security & Testing agents active.']
    });
  }
}
