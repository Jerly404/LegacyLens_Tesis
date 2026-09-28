import { TestBed } from '@angular/core/testing';
import { ProjectService } from './project.service';

describe('ProjectService', () => {
  let service: ProjectService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [ProjectService]
    });
    service = TestBed.inject(ProjectService);
  });

  it('should initialize with default demo project', () => {
    expect(service.projects().length).toBe(1);
    expect(service.selectedProject()).toBeDefined();
    expect(service.selectedProject().name).toBe('E-Commerce Order Management Microservice');
    expect(service.hasProjects()).toBe(true);
  });

  it('should create a new project and append to list', (done) => {
    service.createProject({
      name: 'New Custom Microservice',
      mainLanguage: 'Go',
      framework: 'gRPC'
    }).subscribe(newProj => {
      expect(newProj.id).toBeDefined();
      expect(service.projects().length).toBe(2);
      expect(service.selectedProject().name).toBe('New Custom Microservice');
      expect(service.hasProjects()).toBe(true);
      done();
    });
  });

  it('should retrieve project by ID after creation', (done) => {
    service.createProject({
      name: 'Order Service',
      mainLanguage: 'Java',
      framework: 'Spring Boot'
    }).subscribe(created => {
      service.getById(created.id).subscribe(proj => {
        expect(proj).toBeDefined();
        expect(proj?.id).toBe(created.id);
        expect(proj?.mainLanguage).toBe('Java');
        done();
      });
    });
  });

  it('should delete project and update state', (done) => {
    service.createProject({
      name: 'To Delete Service',
      mainLanguage: 'Python'
    }).subscribe(created => {
      expect(service.projects().length).toBe(2);
      service.deleteProject(created.id).subscribe(result => {
        expect(result).toBe(true);
        expect(service.projects().length).toBe(1);
        expect(service.selectedProject().name).toBe('E-Commerce Order Management Microservice');
        done();
      });
    });
  });

  it('should provide full file tree for active codebase', (done) => {
    service.createProject({
      name: 'MindGuard Quality Platform',
      mainLanguage: 'Python'
    }).subscribe(created => {
      const tree = service.getFileTree(created.id);
      expect(tree.length).toBeGreaterThan(0);
      expect(tree[0].name).toBe('backend');
      expect(tree[0].children?.length).toBeGreaterThan(0);
      done();
    });
  });

  it('should clear all projects and wipe storage', (done) => {
    service.createProject({ name: 'Temp Project' }).subscribe(() => {
      expect(service.projects().length).toBe(2);
      service.clearAllProjects().subscribe(cleared => {
        expect(cleared).toBe(true);
        expect(service.projects().length).toBe(0);
        expect(service.selectedProject().name).toBe('No Active Project');
        expect(localStorage.getItem('legacyai_projects')).toBeNull();
        done();
      });
    });
  });
});
