import { TestBed } from '@angular/core/testing';
import { UploadComponent } from './upload.component';
import { ProjectService } from '../../core/projects/project.service';
import { SettingsService } from '../../core/settings/settings.service';
import { NotificationService } from '../../core/notifications/notification.service';
import { AnalysisService } from '../../core/analysis/analysis.service';
import { Router, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('UploadComponent (Zip Ingestion & Quality Analysis)', () => {
  let component: UploadComponent;
  let projectService: ProjectService;
  let analysisService: AnalysisService;
  let routerSpy: { navigate: jest.Mock };

  beforeEach(() => {
    localStorage.clear();
    routerSpy = { navigate: jest.fn() };

    TestBed.configureTestingModule({
      providers: [
        UploadComponent,
        ProjectService,
        SettingsService,
        NotificationService,
        AnalysisService,
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParams: {},
              queryParamMap: { get: () => null }
            },
            queryParams: of({})
          }
        }
      ]
    });

    component = TestBed.inject(UploadComponent);
    projectService = TestBed.inject(ProjectService);
    analysisService = TestBed.inject(AnalysisService);
  });

  it('should initialize with multi-agent architecture team enabled', () => {
    expect(component.agentTeam().length).toBe(7);
    const enabledAgents = component.agentTeam().filter(a => a.enabled);
    expect(enabledAgents.length).toBe(7);
    expect(component.currentStep()).toBe(1);
  });

  it('should auto-detect Python & FastAPI stack when clinical-ehr-api.zip is uploaded', (done) => {
    component.uploadedFile.set(new File(['mock-zip-content'], 'clinical-ehr-api.zip', { type: 'application/zip' }));
    component.gitRepoUrl.set('clinical-ehr-api.zip');

    component.autoDetectStack();

    setTimeout(() => {
      expect(component.detectedLanguage()).toBe('Python');
      expect(component.detectedFramework()).toContain('FastAPI');
      expect(component.detectedArchitecture()).toBe('Layered Architecture');
      expect(component.projectName()).toContain('Clinical Electronic Health Record');
      done();
    }, 450);
  });

  it('should auto-detect Java & Spring Boot stack when sample-ecommerce-api.zip is uploaded', (done) => {
    component.uploadedFile.set(new File(['mock-zip-content'], 'sample-ecommerce-api.zip', { type: 'application/zip' }));
    component.gitRepoUrl.set('sample-ecommerce-api.zip');

    component.autoDetectStack();

    setTimeout(() => {
      expect(component.detectedLanguage()).toBe('Java');
      expect(component.detectedFramework()).toContain('Spring Boot');
      expect(component.detectedArchitecture()).toBe('Layered Architecture');
      done();
    }, 450);
  });

  it('should start multi-agent analysis and navigate to /analysis-progress', (done) => {
    component.projectName.set('clinical-ehr-api');
    component.detectedLanguage.set('Python');
    component.detectedFramework.set('FastAPI');
    component.detectedArchitecture.set('Layered Architecture');

    component.startAnalysis();

    setTimeout(() => {
      expect(projectService.projects().length).toBe(2);
      expect(projectService.selectedProject().name).toBe('clinical-ehr-api');
      expect(analysisService.currentAnalysis().status).toBe('ANALYZING');
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/analysis-progress']);
      done();
    }, 300);
  });
});
