import { TestBed } from '@angular/core/testing';
import { ProjectService } from './project.service';

describe('ProjectService', () => {
  let service: ProjectService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProjectService]
    });
    service = TestBed.inject(ProjectService);
  });

  it('should initialize with legacy projects', () => {
    expect(service.projects().length).toBeGreaterThan(0);
    expect(service.selectedProject()).toBeDefined();
    expect(service.selectedProject().name).toBe('Legacy Banking Transaction Core');
  });

  it('should retrieve project by ID', (done) => {
    service.getById('proj-banking-core').subscribe(proj => {
      expect(proj).toBeDefined();
      expect(proj?.mainLanguage).toBe('Java');
      done();
    });
  });

  it('should create a new project and append to list', (done) => {
    const initialCount = service.projects().length;
    service.createProject({
      name: 'New Custom Microservice',
      mainLanguage: 'Go',
      framework: 'gRPC'
    }).subscribe(newProj => {
      expect(newProj.id).toBeDefined();
      expect(service.projects().length).toBe(initialCount + 1);
      expect(service.selectedProject().name).toBe('New Custom Microservice');
      done();
    });
  });

  it('should provide full file tree for active codebase', () => {
    const tree = service.getFileTree();
    expect(tree.length).toBeGreaterThan(0);
    expect(tree[0].name).toBe('src');
    expect(tree[0].children?.length).toBeGreaterThan(0);
  });
});
