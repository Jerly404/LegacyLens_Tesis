import { TestBed } from '@angular/core/testing';
import { AnalysisService } from './analysis.service';
import { ProjectService } from '../projects/project.service';

describe('AnalysisService', () => {
  let service: AnalysisService;
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [AnalysisService, ProjectService]
    });
    service = TestBed.inject(AnalysisService);
  });

  it('should initialize with completed state for loaded demo project', () => {
    const analysis = service.currentAnalysis();
    expect(analysis).toBeDefined();
    expect(analysis.status).toBe('COMPLETED');
    expect(analysis.stages.length).toBe(6);
  });

  it('should restart simulation and update state to ANALYZING', () => {
    service.restartSimulation('proj-test-123');
    const analysis = service.currentAnalysis();
    expect(analysis.status).toBe('ANALYZING');
    expect(analysis.projectId).toBe('proj-test-123');
    expect(analysis.stages[0].status).toBe('in_progress');
    expect(analysis.logs.length).toBeGreaterThan(0);
  });

  it('should clear analysis and reset to idle', () => {
    service.restartSimulation('proj-test-123');
    expect(service.currentAnalysis().status).toBe('ANALYZING');

    service.clearAnalysis();
    const analysis = service.currentAnalysis();
    expect(analysis.status).toBe('IDLE');
    expect(analysis.progress).toBe(0);
    expect(analysis.projectId).toBe('');
    expect(analysis.logs.length).toBe(0);
  });
});
