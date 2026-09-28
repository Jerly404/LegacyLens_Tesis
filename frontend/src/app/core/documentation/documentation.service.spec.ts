import { TestBed } from '@angular/core/testing';
import { DocumentationService } from './documentation.service';
import { ProjectService } from '../projects/project.service';
import { TranslationService } from '../i18n/translation.service';
import { DocumentationSection } from '@codelens/shared';

describe('DocumentationService (Quality & Zip Verification)', () => {
  let service: DocumentationService;
  let projectService: ProjectService;
  let translationService: TranslationService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [DocumentationService, ProjectService, TranslationService]
    });
    service = TestBed.inject(DocumentationService);
    projectService = TestBed.inject(ProjectService);
    translationService = TestBed.inject(TranslationService);
  });

  it('should generate high-quality documentation for clinical-ehr-api.zip', (done) => {
    projectService.createProject({
      name: 'clinical-ehr-api',
      mainLanguage: 'Python',
      framework: 'FastAPI & Async SQLAlchemy 2.0 / PostgreSQL'
    }).subscribe(project => {
      service.getAll(project.id).subscribe((sections: DocumentationSection[]) => {
        expect(sections.length).toBe(5);

        // 1. Overview Section
        const overview = sections.find(s => s.category === 'Overview');
        expect(overview).toBeDefined();
        expect(overview?.content).toContain('Python 3.11');
        expect(overview?.content).toContain('FastAPI');
        expect(overview?.content).toContain('PostgreSQL');

        // 2. Architecture Section
        const arch = sections.find(s => s.category === 'Architecture');
        expect(arch).toBeDefined();
        expect(arch?.content).toContain('Layered Architecture');
        expect(arch?.content).toContain('patients_router.py');
        expect(arch?.content).toContain('patient_service.py');
        expect(arch?.content).toContain('patient_repository.py');

        // 3. API Contract Section
        const api = sections.find(s => s.category === 'API');
        expect(api).toBeDefined();
        expect(api?.content).toContain('/api/v1/patients');
        expect(api?.content).toContain('medical_record_number');
        expect(api?.content).toContain('201 Created');

        // 4. Database Dictionary Section
        const db = sections.find(s => s.category === 'Database');
        expect(db).toBeDefined();
        expect(db?.content).toContain('patients');
        expect(db?.content).toContain('clinical_records');
        expect(db?.content).toContain('UUID');

        // 5. Deployment Section
        const deploy = sections.find(s => s.category === 'Deployment');
        expect(deploy).toBeDefined();
        expect(deploy?.content).toContain('dockerfile');
        expect(deploy?.content).toContain('uvicorn');
        expect(deploy?.content).toContain('Qwen 2.5 Coder');

        done();
      });
    });
  });

  it('should generate high-quality documentation for sample-ecommerce-api.zip', (done) => {
    projectService.createProject({
      name: 'sample-ecommerce-api',
      mainLanguage: 'Java',
      framework: 'Spring Boot 2.7 / JPA & Hibernate'
    }).subscribe(project => {
      service.getAll(project.id).subscribe((sections: DocumentationSection[]) => {
        expect(sections.length).toBeGreaterThanOrEqual(4);

        const overview = sections.find(s => s.category === 'Overview');
        expect(overview).toBeDefined();
        expect(overview?.content).toContain('Java');

        const arch = sections.find(s => s.category === 'Architecture');
        expect(arch).toBeDefined();

        const api = sections.find(s => s.category === 'API');
        expect(api).toBeDefined();

        done();
      });
    });
  });

  it('should allow editing and saving documentation section content', (done) => {
    projectService.createProject({
      name: 'clinical-ehr-api',
      mainLanguage: 'Python'
    }).subscribe(project => {
      service.getAll(project.id).subscribe((sections: DocumentationSection[]) => {
        const firstDoc = sections[0];
        expect(firstDoc).toBeDefined();

        const updatedText = '# Custom User Updated Documentation\nValidated by engineering architect.';
        service.updateDoc(firstDoc.id, updatedText);

        const refreshed = service.docs().find(d => d.id === firstDoc.id);
        expect(refreshed?.content).toBe(updatedText);
        done();
      });
    });
  });

  it('should regenerate doc with AI verification signature', (done) => {
    projectService.createProject({
      name: 'clinical-ehr-api',
      mainLanguage: 'Python'
    }).subscribe(project => {
      service.getAll(project.id).subscribe((sections: DocumentationSection[]) => {
        const docId = sections[0].id;
        service.regenerateDoc(docId).subscribe(regenerated => {
          expect(regenerated.content).toContain('Qwen 2.5 Coder');
          done();
        });
      });
    });
  });
});
