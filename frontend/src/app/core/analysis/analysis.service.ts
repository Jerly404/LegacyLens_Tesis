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
    projectId: 'proj-clean',
    progress: 100,
    status: 'COMPLETED',
    currentStage: 'Multi-Agent Analysis Completed Successfully',
    stages: this.stageDefinitions.map(s => ({ ...s, status: 'completed' as const, progress: 100 })),
    filesProcessed: 8,
    totalFiles: 8,
    estimatedRemainingTime: '00:00',
    processingSpeed: '32 files/sec',
    logs: [
      '[00:01] [Orchestrator] Multi-agent virtual team initialized on local Qwen 2.5 Coder 7B (RTX 3050).',
      '[00:01] [Code Agent] Parsed AST: OrderController, OrderService, OrderRepository, Order, OrderItem.',
      '[00:02] [Architecture Agent] Detected Layered Architecture (Controllers -> Services -> Repositories -> JPA Entities).',
      '[00:02] [Dependency Agent] Traced Maven dependencies: Spring Boot Web, Spring Data JPA, PostgreSQL Driver.',
      '[00:03] [Doc & UML Agent] Generated Fullstack Topology, Database ERD Schema, and C4 Container Model.',
      '[00:04] [Security & Test Agent] Indexed AST embeddings into local vector store. 0 vulnerabilities found.',
      '[00:04] [Orchestrator] Multi-Agent Analysis Completed Successfully.'
    ]
  });

  currentAnalysis = this.analysisState.asReadonly();

  getAnalysisProgress(projectId?: string): Observable<AnalysisProgress> {
    return new Observable<AnalysisProgress>(subscriber => {
      subscriber.next(this.analysisState());
      
      const sub = interval(400).subscribe(() => {
        const curr = this.analysisState();
        if (curr.progress < 100) {
          const nextProgress = Math.min(100, curr.progress + 12);
          const nextProcessed = Math.min(curr.totalFiles, Math.ceil((nextProgress / 100) * curr.totalFiles));
          
          // Determine which of the 6 stages is active
          const stageIndex = Math.min(5, Math.floor((nextProgress / 100) * 6));
          const stages = this.stageDefinitions.map((s, idx) => {
            if (idx < stageIndex || nextProgress >= 100) {
              return { ...s, status: 'completed' as const, progress: 100 };
            } else if (idx === stageIndex) {
              const stagePct = Math.min(99, Math.round(((nextProgress % 17) / 17) * 100) || 50);
              return { ...s, status: 'in_progress' as const, progress: stagePct };
            } else {
              return { ...s, status: 'pending' as const, progress: 0 };
            }
          });

          const currentStageName = nextProgress >= 100 
            ? 'Multi-Agent Analysis Completed Successfully' 
            : `${this.stageDefinitions[stageIndex].name} in progress...`;

          const newLogs = [...curr.logs];
          const timeStr = new Date().toLocaleTimeString();
          if (stageIndex === 1 && newLogs.length === 1) {
            newLogs.push(`[${timeStr}] [Code Agent] Extracted AST syntax tree and mapped symbols.`);
          } else if (stageIndex === 2 && newLogs.length === 2) {
            newLogs.push(`[${timeStr}] [Architecture Agent] Identified Layered Architecture patterns.`);
          } else if (stageIndex === 3 && newLogs.length === 3) {
            newLogs.push(`[${timeStr}] [Dependency Agent] Resolved package manifests and internal imports.`);
          } else if (stageIndex === 4 && newLogs.length === 4) {
            newLogs.push(`[${timeStr}] [Doc & UML Agent] Compiled Database Schema (ERD) & Fullstack Topology.`);
          } else if (stageIndex === 5 && newLogs.length === 5) {
            newLogs.push(`[${timeStr}] [Security Agent] Audited auth flows and indexed local vector RAG store.`);
          } else if (nextProgress >= 100 && newLogs.length === 6) {
            newLogs.push(`[${timeStr}] [Orchestrator] Pipeline finished. Project ready for exploration.`);
          }

          const isDone = nextProgress >= 100;
          const updated: AnalysisProgress = {
            ...curr,
            progress: nextProgress,
            filesProcessed: isDone ? curr.totalFiles : nextProcessed,
            currentStage: currentStageName,
            stages,
            logs: newLogs,
            estimatedRemainingTime: isDone ? '00:00' : `00:0${Math.max(1, Math.ceil((100 - nextProgress) / 25))}`,
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
    const totalFiles = Math.max(8, proj?.fileCount || 8);

    const freshStages = this.stageDefinitions.map((s, idx) => ({
      ...s,
      status: (idx === 0 ? 'in_progress' : 'pending') as any,
      progress: idx === 0 ? 30 : 0
    }));

    this.analysisState.set({
      projectId: projectId || proj.id,
      progress: 5,
      status: 'ANALYZING',
      currentStage: 'Master Orchestrator Agent initializing execution tree...',
      stages: freshStages,
      filesProcessed: 1,
      totalFiles,
      estimatedRemainingTime: '00:03',
      processingSpeed: '32 files/sec',
      logs: [
        `[${new Date().toLocaleTimeString()}] [Orchestrator] Multi-agent virtual team assigned: Code, Architecture, Dependency, Documentation, Security & Testing agents active.`
      ]
    });
  }
}
