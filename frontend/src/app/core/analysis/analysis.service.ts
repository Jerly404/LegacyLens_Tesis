import { Injectable, signal } from '@angular/core';
import { AnalysisProgress, AnalysisStage } from '@codelens/shared';
import { Observable, interval, Subject } from 'rxjs';
import { takeWhile, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AnalysisService {
  private initialStages: AnalysisStage[] = [
    { id: 'stage-1', name: 'Uploading & Extracting Codebase', status: 'completed', description: 'Decompressing archive and creating file index tree', progress: 100 },
    { id: 'stage-2', name: 'Parsing AST & Symbol Resolution', status: 'completed', description: 'Extracting abstract syntax trees across 1,842 files', progress: 100 },
    { id: 'stage-3', name: 'Detecting Architecture & Boundaries', status: 'in_progress', description: 'AI pattern matching against 7 enterprise architectural styles', progress: 74 },
    { id: 'stage-4', name: 'Extracting Dependency Graph', status: 'pending', description: 'Tracing call graphs, circular references and database queries', progress: 0 },
    { id: 'stage-5', name: 'Generating Technical Documentation', status: 'pending', description: 'Generating OpenAPI specs, module docs, and system manuals', progress: 0 },
    { id: 'stage-6', name: 'Building Vector Knowledge Base', status: 'pending', description: 'Embedding AST nodes into local vector store for RAG chat', progress: 0 }
  ];

  private initialLogs: string[] = [
    '[00:01] Archive unpacking completed. 1,842 files detected.',
    '[00:03] AST Parser initialized for Java 11 / Spring Boot grammar.',
    '[00:08] Symbol resolution: 420 classes, 1,280 methods, 34 interfaces indexed.',
    '[00:14] Detecting architectural layers: Presentation (Controllers) identified.',
    '[00:19] Detecting Service Layer: High coupling found in TransactionService.java',
    '[00:25] AI Model (DeepSeek Coder 33B) running architectural clustering inference...'
  ];

  private analysisState = signal<AnalysisProgress>({
    projectId: 'proj-banking-core',
    progress: 78,
    status: 'ANALYZING',
    currentStage: 'Detecting architecture...',
    stages: this.initialStages,
    filesProcessed: 1842,
    totalFiles: 2340,
    estimatedRemainingTime: '02:14',
    processingSpeed: '42 files/sec',
    logs: this.initialLogs
  });

  currentAnalysis = this.analysisState.asReadonly();

  getAnalysisProgress(projectId: string): Observable<AnalysisProgress> {
    return new Observable<AnalysisProgress>(subscriber => {
      subscriber.next(this.analysisState());
      
      // Emit continuous updates simulating active AI reverse-engineering
      const sub = interval(1500).subscribe(() => {
        const curr = this.analysisState();
        if (curr.progress < 100) {
          const nextProgress = Math.min(100, curr.progress + 2);
          const nextProcessed = Math.min(curr.totalFiles, curr.filesProcessed + 38);
          
          let nextCurrentStage = curr.currentStage;
          const stages = [...curr.stages];
          
          if (nextProgress >= 85 && stages[2].status === 'in_progress') {
            stages[2].status = 'completed';
            stages[2].progress = 100;
            stages[3].status = 'in_progress';
            stages[3].progress = 40;
            nextCurrentStage = 'Extracting dependencies...';
          }
          
          if (nextProgress >= 95 && stages[3].status === 'in_progress') {
            stages[3].status = 'completed';
            stages[3].progress = 100;
            stages[4].status = 'in_progress';
            stages[4].progress = 60;
            nextCurrentStage = 'Generating documentation...';
          }

          const newLogs = [...curr.logs];
          if (Math.random() > 0.4) {
            newLogs.push(`[${new Date().toLocaleTimeString()}] Processed file batch #${Math.floor(nextProcessed / 38)}: analyzed symbols & dependencies.`);
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
      progress: idx === 0 ? 30 : 0
    }));

    this.analysisState.set({
      projectId,
      progress: 5,
      status: 'ANALYZING',
      currentStage: 'Uploading project...',
      stages: freshStages,
      filesProcessed: 120,
      totalFiles: 2340,
      estimatedRemainingTime: '03:45',
      processingSpeed: '46 files/sec',
      logs: ['[00:00] Starting new analysis pipeline with DeepSeek Coder 33B...']
    });
  }
}
