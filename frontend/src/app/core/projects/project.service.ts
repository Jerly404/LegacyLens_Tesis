import { Injectable, signal } from '@angular/core';
import { Project, FileNode, ProjectStatus, DependencyGraphData } from '@codelens/shared';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private initialProjects: Project[] = [];

  private getSavedProjects(): Project[] {
    const saved = localStorage.getItem('legacyai_projects');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch (e) {
        console.error('Error parsing stored projects:', e);
      }
    }
    return [];
  }

  private persistProjects(list: Project[]) {
    localStorage.setItem('legacyai_projects', JSON.stringify(list));
  }

  private projectsSignal = signal<Project[]>(this.getSavedProjects());
  private selectedProjectSignal = signal<Project>(this.getSavedProjects()[0] || {
    id: 'proj-clean',
    name: 'My Ingested Project',
    slug: 'my-project',
    description: 'Uploaded repository ready for AI reverse-engineering.',
    mainLanguage: 'Auto-Detect',
    framework: 'Multi-Tier',
    languages: [{ name: 'Source', percentage: 100, color: '#3B82F6', loc: 1000 }],
    fileCount: 0,
    linesOfCode: 0,
    architecture: 'Detecting...',
    confidence: 100,
    status: 'COMPLETED',
    progress: 100,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    healthScore: 85
  });

  projects = this.projectsSignal.asReadonly();
  selectedProject = this.selectedProjectSignal.asReadonly();

  getAll(): Observable<Project[]> {
    return of(this.projectsSignal()).pipe(delay(100));
  }

  getById(id: string): Observable<Project | undefined> {
    const project = this.projectsSignal().find(p => p.id === id || p.slug === id);
    if (project) {
      this.selectedProjectSignal.set(project);
    }
    return of(project).pipe(delay(80));
  }

  setSelectedProject(project: Project) {
    this.selectedProjectSignal.set(project);
  }

  createProject(projectData: Partial<Project>): Observable<Project> {
    const lang = projectData.mainLanguage || 'Python';
    const isMindguard = (projectData.name || '').toLowerCase().includes('mindguard') || 
                        (projectData.repositoryUrl || '').toLowerCase().includes('mindguard') ||
                        (projectData.name || '').toLowerCase().includes('quality');
    const isEHR = (projectData.name || '').toLowerCase().includes('ehr') || (projectData.name || '').toLowerCase().includes('clinical') || (projectData.name || '').toLowerCase().includes('patient');
    const isPython = lang.toLowerCase() === 'python' || isMindguard || isEHR;
    const isJava = lang.toLowerCase() === 'java' || (projectData.name || '').toLowerCase().includes('ecommerce') || (projectData.name || '').toLowerCase().includes('order');

    const fileCount = isMindguard ? 34 : (isEHR ? 11 : (isJava ? 8 : (projectData.fileCount || 10)));
    const loc = isMindguard ? 1850 : (isEHR ? 380 : (isJava ? 450 : (projectData.linesOfCode || 400)));
    const name = projectData.name || (isMindguard ? 'MindGuard — Software Quality & Mental Health Platform' : (isEHR ? 'Clinical Electronic Health Record (EHR) API' : (isJava ? 'E-Commerce Order Management Microservice' : `${lang} Enterprise Service`)));

    const languages = isMindguard 
      ? [
          { name: 'Python', percentage: 65, color: '#3572A5', loc: 1202 },
          { name: 'TypeScript / Angular', percentage: 25, color: '#3178C6', loc: 463 },
          { name: 'SQL / DB', percentage: 10, color: '#336791', loc: 185 }
        ]
      : isEHR 
      ? [
          { name: 'Python', percentage: 80, color: '#3572A5', loc: 304 },
          { name: 'SQL / ORM', percentage: 15, color: '#336791', loc: 57 },
          { name: 'Docker / YAML', percentage: 5, color: '#384d54', loc: 19 }
        ]
      : [
          { name: lang, percentage: 75, color: this.getLanguageColor(lang), loc: Math.round(loc * 0.75) },
          { name: 'SQL / DB', percentage: 15, color: '#10B981', loc: Math.round(loc * 0.15) },
          { name: 'XML / Config', percentage: 10, color: '#A855F7', loc: Math.round(loc * 0.10) }
        ];

    const newProject: Project = {
      id: 'proj-' + Date.now().toString(36),
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: projectData.description || (isMindguard 
        ? 'AI-powered psychological assessment & clinical decision support platform with FastAPI, Gemini/Groq LLMs, and Angular.'
        : `Uploaded ${lang} microservice repository for AI reverse engineering and documentation.`),
      repositoryUrl: projectData.repositoryUrl,
      mainLanguage: lang,
      framework: projectData.framework || (isMindguard ? 'Python 3.11 / FastAPI, SQLAlchemy & Angular 17' : (isEHR ? 'Python 3.11 / FastAPI & Async SQLAlchemy 2.0' : `${lang} 11 / Spring Boot 2.7`)),
      branch: projectData.branch || 'main',
      languages,
      fileCount,
      linesOfCode: loc,
      architecture: projectData.architecture || 'Layered Architecture',
      confidence: 96,
      status: 'COMPLETED',
      progress: 100,
      lastAnalyzedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      healthScore: 94
    };

    this.projectsSignal.update(list => {
      const updated = [newProject, ...list];
      this.persistProjects(updated);
      return updated;
    });
    this.selectedProjectSignal.set(newProject);
    return of(newProject).pipe(delay(200));
  }

  private getLanguageColor(lang: string): string {
    const map: Record<string, string> = {
      Java: '#f89820',
      'C#': '#178600',
      PHP: '#4F5D95',
      Python: '#3572A5',
      'C++': '#f34b7d',
      COBOL: '#005CA5',
      TypeScript: '#3178C6',
      Go: '#00ADD8',
      Ruby: '#701516',
      Rust: '#dea584'
    };
    return map[lang] || '#3B82F6';
  }

  deleteProject(id: string): Observable<boolean> {
    this.projectsSignal.update(list => {
      const updated = list.filter(p => p.id !== id);
      this.persistProjects(updated);
      return updated;
    });
    if (this.selectedProjectSignal().id === id && this.projectsSignal().length > 0) {
      this.selectedProjectSignal.set(this.projectsSignal()[0]);
    }
    return of(true).pipe(delay(100));
  }

  clearAllProjects(): Observable<boolean> {
    this.projectsSignal.set([]);
    this.persistProjects([]);
    return of(true).pipe(delay(50));
  }

  clearDemoProjects(): Observable<boolean> {
    this.projectsSignal.set([]);
    this.persistProjects([]);
    return of(true).pipe(delay(50));
  }

  resetDemoProjects(): Observable<boolean> {
    this.projectsSignal.set(this.initialProjects);
    this.persistProjects(this.initialProjects);
    if (this.initialProjects.length > 0) {
      this.selectedProjectSignal.set(this.initialProjects[0]);
    }
    return of(true).pipe(delay(50));
  }

  getFileTree(projectId?: string): FileNode[] {
    const targetId = projectId || this.selectedProject().id;
    const currentProj = this.projectsSignal().find(p => p.id === targetId) || this.selectedProject();
    const isMindguard = currentProj.name.toLowerCase().includes('mindguard') || currentProj.slug.includes('mindguard') || currentProj.name.toLowerCase().includes('quality');

    if (isMindguard) {
      return [
        {
          id: 'dir-mg-backend',
          name: 'backend',
          path: 'backend',
          type: 'directory',
          children: [
            {
              id: 'dir-mg-app',
              name: 'app',
              path: 'backend/app',
              type: 'directory',
              children: [
                {
                  id: 'dir-mg-api',
                  name: 'api',
                  path: 'backend/app/api',
                  type: 'directory',
                  children: [
                    {
                      id: 'file-mg-assessments-api',
                      name: 'assessments.py',
                      path: 'backend/app/api/assessments.py',
                      type: 'file',
                      language: 'python',
                      lines: 110,
                      complexity: 6,
                      dependencies: ['clinical_ai', 'assessment_ai', 'Usuario', 'Evaluacion'],
                      content: `from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.base import Usuario, Evaluacion
from app.services.clinical_ai import ClinicalAIService
from app.schemas.assessment import AssessmentCreate, AssessmentResponse

router = APIRouter(prefix="/assessments", tags=["Assessments"])

@router.post("/submit", response_model=AssessmentResponse)
async def submit_psychological_assessment(
    data: AssessmentCreate,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    service = ClinicalAIService(db)
    evaluation = await service.process_and_evaluate(current_user.id, data)
    return evaluation`
                    },
                    {
                      id: 'file-mg-auth-api',
                      name: 'auth.py',
                      path: 'backend/app/api/auth.py',
                      type: 'file',
                      language: 'python',
                      lines: 95,
                      complexity: 5,
                      dependencies: ['security', 'Usuario', 'OAuth2'],
                      content: `from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import verify_password, create_access_token
from app.models.base import Usuario

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(Usuario).filter(Usuario.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    token = create_access_token(data={"sub": user.email, "role": user.rol})
    return {"access_token": token, "token_type": "bearer"}`
                    },
                    {
                      id: 'file-mg-deps',
                      name: 'deps.py',
                      path: 'backend/app/api/deps.py',
                      type: 'file',
                      language: 'python',
                      lines: 45,
                      complexity: 3,
                      content: `from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.config import settings
from app.models.base import Usuario

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> Usuario:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Could not validate credentials")
    except JWTError:
        raise HTTPException(status_code=401, detail="Could not validate credentials")
    user = db.query(Usuario).filter(Usuario.email == email).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user`
                    }
                  ]
                },
                {
                  id: 'dir-mg-services',
                  name: 'services',
                  path: 'backend/app/services',
                  type: 'directory',
                  children: [
                    {
                      id: 'file-mg-clinical-ai',
                      name: 'clinical_ai.py',
                      path: 'backend/app/services/clinical_ai.py',
                      type: 'file',
                      language: 'python',
                      lines: 135,
                      complexity: 8,
                      dependencies: ['Google Gemini 1.5', 'Groq Llama 3', 'Evaluacion', 'ResultadoIA'],
                      content: `import json
import os
from sqlalchemy.orm import Session
from app.models.base import Evaluacion, ResultadoIA

class ClinicalAIService:
    def __init__(self, db: Session):
        self.db = db

    async def process_and_evaluate(self, user_id: int, data) -> Evaluacion:
        # Calculate PHQ-9 and GAD-7 standard psychometric scores
        phq9_score = sum(data.phq9_responses)
        gad7_score = sum(data.gad7_responses)

        risk_level = "BAJO"
        if phq9_score >= 15 or gad7_score >= 15:
            risk_level = "ALTO"
        elif phq9_score >= 10 or gad7_score >= 10:
            risk_level = "MEDIO"

        evaluation = Evaluacion(
            id_usuario=user_id,
            phq9Score=phq9_score,
            gad7Score=gad7_score,
            nivelRiesgo=risk_level,
            resultadoIA=f"Nivel de riesgo estimado: {risk_level}. Se recomienda seguimiento psicológico.",
            has_high_risk=(risk_level == "ALTO")
        )
        self.db.add(evaluation)
        self.db.commit()
        self.db.refresh(evaluation)
        return evaluation`
                    }
                  ]
                },
                {
                  id: 'dir-mg-models',
                  name: 'models',
                  path: 'backend/app/models',
                  type: 'directory',
                  children: [
                    {
                      id: 'file-mg-models-base',
                      name: 'base.py',
                      path: 'backend/app/models/base.py',
                      type: 'file',
                      language: 'python',
                      lines: 180,
                      complexity: 2,
                      content: `from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float, ForeignKey, Text
from sqlalchemy.orm import DeclarativeBase, relationship
from datetime import datetime, UTC

class Base(DeclarativeBase):
    pass

class Usuario(Base):
    __tablename__ = "Usuario"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    rol = Column(String(50))
    twoFactorEnabled = Column(Boolean, default=False)
    colegiatura = Column(String(50), nullable=True)
    especialidad = Column(String(100), nullable=True)

    evaluaciones = relationship("Evaluacion", back_populates="usuario", cascade="all, delete-orphan")

class Evaluacion(Base):
    __tablename__ = "Evaluacion"
    id = Column(Integer, primary_key=True, index=True)
    fecha = Column(DateTime, default=lambda: datetime.now(UTC))
    phq9Score = Column(Integer)
    gad7Score = Column(Integer)
    nivelRiesgo = Column(String(50))
    resultadoIA = Column(Text)
    has_high_risk = Column(Boolean, default=False)
    id_usuario = Column(Integer, ForeignKey("Usuario.id", ondelete="CASCADE"), nullable=False)

    usuario = relationship("Usuario", back_populates="evaluaciones")`
                    }
                  ]
                },
                {
                  id: 'file-mg-main',
                  name: 'main.py',
                  path: 'backend/app/main.py',
                  type: 'file',
                  language: 'python',
                  lines: 48,
                  complexity: 3,
                  content: `from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.auth import router as auth_router
from app.api.assessments import router as assessments_router

app = FastAPI(title="MindGuard Clinical API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api/v1")
app.include_router(assessments_router, prefix="/api/v1")

@app.get("/health")
def health():
    return {"status": "HEALTHY", "service": "MindGuard-API"}`
                }
              ]
            }
          ]
        },
        {
          id: 'file-mg-docker-compose',
          name: 'docker-compose.yml',
          path: 'docker-compose.yml',
          type: 'file',
          language: 'yaml',
          lines: 28,
          complexity: 1,
          content: `version: '3.8'\nservices:\n  backend:\n    build: ./backend\n    ports:\n      - "8000:8000"\n    environment:\n      - DATABASE_URL=sqlite:///./mindguard.db\n  frontend:\n    build: ./frontend\n    ports:\n      - "4200:80"`
        },
        {
          id: 'file-mg-readme',
          name: 'README.md',
          path: 'README.md',
          type: 'file',
          language: 'markdown',
          lines: 60,
          complexity: 1,
          content: `# MindGuard — Software Quality & Mental Health Platform\n\nSistema integral para la evaluación psicométrica automatizada (PHQ-9 / GAD-7) con soporte de IA generativa.`
        }
      ];
    }

    const isPython = currentProj.mainLanguage === 'Python' || currentProj.name.toLowerCase().includes('ehr') || currentProj.name.toLowerCase().includes('clinical') || currentProj.name.toLowerCase().includes('patient') || currentProj.slug.includes('python');

    if (isPython) {
      return [
        {
          id: 'dir-py-src',
          name: 'src',
          path: 'src',
          type: 'directory',
          children: [
            {
              id: 'dir-py-api',
              name: 'api',
              path: 'src/api',
              type: 'directory',
              children: [
                {
                  id: 'file-py-router',
                  name: 'patients_router.py',
                  path: 'src/api/patients_router.py',
                  type: 'file',
                  language: 'python',
                  lines: 42,
                  size: 1450,
                  complexity: 4,
                  dependencies: ['PatientService', 'PatientRepository', 'FastAPI'],
                  content: `from uuid import UUID
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from src.config.database import get_db
from src.repositories.patient_repository import PatientRepository
from src.services.patient_service import PatientService
from src.schemas.patient_dto import PatientCreate, PatientResponse, ClinicalRecordCreate, ClinicalRecordResponse

router = APIRouter()

def get_service(session: AsyncSession = Depends(get_db)) -> PatientService:
    repo = PatientRepository(session)
    return PatientService(repo)

@router.post("/", response_model=PatientResponse, status_code=status.HTTP_201_CREATED)
async def register_patient(dto: PatientCreate, service: PatientService = Depends(get_service)):
    try:
        return await service.register_new_patient(dto)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.get("/{patient_id}", response_model=PatientResponse)
async def get_patient(patient_id: UUID, service: PatientService = Depends(get_service)):
    patient = await service.fetch_patient_summary(patient_id)
    if not patient:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Patient record not found")
    return patient

@router.get("/", response_model=List[PatientResponse])
async def list_patients(limit: int = 50, service: PatientService = Depends(get_service)):
    return await service.retrieve_all_patients(limit=limit)

@router.post("/{patient_id}/records", response_model=ClinicalRecordResponse, status_code=status.HTTP_201_CREATED)
async def add_clinical_observation(
    patient_id: UUID, 
    dto: ClinicalRecordCreate, 
    service: PatientService = Depends(get_service)
):
    try:
        return await service.append_clinical_observation(patient_id, dto)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))`
                }
              ]
            },
            {
              id: 'dir-py-services',
              name: 'services',
              path: 'src/services',
              type: 'directory',
              children: [
                {
                  id: 'file-py-service',
                  name: 'patient_service.py',
                  path: 'src/services/patient_service.py',
                  type: 'file',
                  language: 'python',
                  lines: 38,
                  size: 1380,
                  complexity: 5,
                  dependencies: ['PatientRepository', 'PatientResponse'],
                  content: `from uuid import UUID
from typing import List, Optional
from src.repositories.patient_repository import PatientRepository
from src.schemas.patient_dto import PatientCreate, PatientResponse, ClinicalRecordCreate, ClinicalRecordResponse

class PatientService:
    def __init__(self, repository: PatientRepository):
        self.repository = repository

    async def register_new_patient(self, dto: PatientCreate) -> PatientResponse:
        existing = await self.repository.get_patient_by_mrn(dto.medical_record_number)
        if existing:
            raise ValueError(f"Patient with MRN {dto.medical_record_number} already exists")
        patient = await self.repository.create_patient(dto)
        return PatientResponse.model_validate(patient)

    async def fetch_patient_summary(self, patient_id: UUID) -> Optional[PatientResponse]:
        patient = await self.repository.get_patient_by_id(patient_id)
        if not patient:
            return None
        return PatientResponse.model_validate(patient)

    async def append_clinical_observation(self, patient_id: UUID, dto: ClinicalRecordCreate) -> ClinicalRecordResponse:
        patient = await self.repository.get_patient_by_id(patient_id)
        if not patient:
            raise ValueError(f"Patient with ID {patient_id} not found")
        record = await self.repository.add_clinical_record(patient_id, dto)
        return ClinicalRecordResponse.model_validate(record)

    async def retrieve_all_patients(self, limit: int = 50) -> List[PatientResponse]:
        patients = await self.repository.list_patients(limit=limit)
        return [PatientResponse.model_validate(p) for p in patients]`
                }
              ]
            },
            {
              id: 'dir-py-repositories',
              name: 'repositories',
              path: 'src/repositories',
              type: 'directory',
              children: [
                {
                  id: 'file-py-repo',
                  name: 'patient_repository.py',
                  path: 'src/repositories/patient_repository.py',
                  type: 'file',
                  language: 'python',
                  lines: 36,
                  size: 1200,
                  complexity: 3,
                  dependencies: ['Patient', 'ClinicalRecord', 'AsyncSession'],
                  content: `from uuid import UUID
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from src.models.patient import Patient
from src.models.clinical_record import ClinicalRecord
from src.schemas.patient_dto import PatientCreate, ClinicalRecordCreate

class PatientRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create_patient(self, dto: PatientCreate) -> Patient:
        patient = Patient(**dto.model_dump())
        self.session.add(patient)
        await self.session.commit()
        await self.session.refresh(patient)
        return patient

    async def get_patient_by_id(self, patient_id: UUID) -> Optional[Patient]:
        stmt = select(Patient).options(selectinload(Patient.records)).where(Patient.id == patient_id)
        result = await self.session.execute(stmt)
        return result.scalars().first()

    async def list_patients(self, limit: int = 50, offset: int = 0) -> List[Patient]:
        stmt = select(Patient).options(selectinload(Patient.records)).limit(limit).offset(offset)
        result = await self.session.execute(stmt)
        return list(result.scalars().all())`
                }
              ]
            },
            {
              id: 'dir-py-models',
              name: 'models',
              path: 'src/models',
              type: 'directory',
              children: [
                {
                  id: 'file-py-model-pat',
                  name: 'patient.py',
                  path: 'src/models/patient.py',
                  type: 'file',
                  language: 'python',
                  lines: 24,
                  size: 890,
                  complexity: 1,
                  content: `import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Date
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from src.config.database import Base

class Patient(Base):
    __tablename__ = "patients"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    medical_record_number = Column(String(32), unique=True, nullable=False, index=True)
    first_name = Column(String(64), nullable=False)
    last_name = Column(String(64), nullable=False)
    date_of_birth = Column(Date, nullable=False)
    blood_group = Column(String(8), nullable=True)
    contact_phone = Column(String(20), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    records = relationship("ClinicalRecord", back_populates="patient", cascade="all, delete-orphan")`
                }
              ]
            }
          ]
        },
        {
          id: 'file-py-main',
          name: 'main.py',
          path: 'main.py',
          type: 'file',
          language: 'python',
          lines: 28,
          size: 920,
          complexity: 2,
          content: `from fastapi import FastAPI
from src.api.patients_router import router as patients_router

app = FastAPI(title="Clinical Electronic Health Record API", version="2.1.0")
app.include_router(patients_router, prefix="/api/v1/patients", tags=["Patients"])

@app.get("/health")
async def health_check():
    return {"status": "HEALTHY", "service": "clinical-ehr-api"}`
        },
        {
          id: 'file-py-req',
          name: 'requirements.txt',
          path: 'requirements.txt',
          type: 'file',
          language: 'text',
          lines: 9,
          size: 210,
          complexity: 1,
          content: `fastapi==0.104.1\nuvicorn==0.24.0\nsqlalchemy==2.0.23\nasyncpg==0.29.0\npydantic==2.5.2\nalembic==1.12.1`
        },
        {
          id: 'file-py-docker',
          name: 'Dockerfile',
          path: 'Dockerfile',
          type: 'file',
          language: 'dockerfile',
          lines: 8,
          size: 220,
          complexity: 1,
          content: `FROM python:3.11-slim\nWORKDIR /app\nCOPY requirements.txt .\nRUN pip install -r requirements.txt\nCOPY . .\nCMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]`
        },
        {
          id: 'file-py-readme',
          name: 'README.md',
          path: 'README.md',
          type: 'file',
          language: 'markdown',
          lines: 15,
          size: 450,
          complexity: 1,
          content: `# Clinical Electronic Health Record (EHR) Microservice\n\nAsync Python 3.11 / FastAPI microservice for patient health records and biometric telemetry.`
        }
      ];
    }

    if (targetId === 'proj-health-hl7') {
      return [
        {
          id: 'dir-csharp-src',
          name: 'src',
          path: 'src',
          type: 'directory',
          children: [
            {
              id: 'dir-csharp-controllers',
              name: 'Controllers',
              path: 'src/Controllers',
              type: 'directory',
              children: [
                {
                  id: 'file-patient-ctrl',
                  name: 'PatientRecordController.cs',
                  path: 'src/Controllers/PatientRecordController.cs',
                  type: 'file',
                  language: 'csharp',
                  lines: 188,
                  complexity: 11,
                  dependencies: ['IPatientService', 'HL7MessageFormatter', 'AuditLogger'],
                  content: `using System;
using System.Threading.Tasks;
using System.Web.Http;
using MedTech.EHR.Services;
using MedTech.EHR.Models;

namespace MedTech.EHR.Controllers
{
    [Authorize(Roles = "ClinicalPractitioner,SystemAdmin")]
    [RoutePrefix("api/v1/patients")]
    public class PatientRecordController : ApiController
    {
        private readonly IPatientService _patientService;
        private readonly IHL7Service _hl7Service;

        public PatientRecordController(IPatientService patientService, IHL7Service hl7Service)
        {
            _patientService = patientService;
            _hl7Service = hl7Service;
        }

        [HttpGet]
        [Route("{patientId:guid}/clinical-summary")]
        public async Task<IHttpActionResult> GetClinicalSummary(Guid patientId)
        {
            var record = await _patientService.GetPatientWithHistoryAsync(patientId);
            if (record == null) return NotFound();
            return Ok(record);
        }

        [HttpPost]
        [Route("ingest-hl7")]
        public async Task<IHttpActionResult> IngestHL7Feed([FromBody] string rawHL7Message)
        {
            var parsed = _hl7Service.ParseADT_A01(rawHL7Message);
            var result = await _patientService.ProcessAdmissionAsync(parsed);
            return Ok(new { status = "PROCESSED", mrn = result.MedicalRecordNumber });
        }
    }
}`
                }
              ]
            },
            {
              id: 'dir-csharp-services',
              name: 'Services',
              path: 'src/Services',
              type: 'directory',
              children: [
                {
                  id: 'file-hl7-parser',
                  name: 'HL7MessageService.cs',
                  path: 'src/Services/HL7MessageService.cs',
                  type: 'file',
                  language: 'csharp',
                  lines: 340,
                  complexity: 24,
                  dependencies: ['HL7SegmentParser', 'PatientRepository'],
                  content: `using System;
using System.Text.RegularExpressions;
using MedTech.EHR.Models;

namespace MedTech.EHR.Services
{
    public class HL7MessageService : IHL7Service
    {
        // Legacy HL7 v2.3 / v2.5 Pipe-and-Hat delimiter parser
        public PatientAdmission ParseADT_A01(string rawMessage)
        {
            var segments = rawMessage.Split(new[] { "\\r\\n", "\\r", "\\n" }, StringSplitOptions.RemoveEmptyEntries);
            var admission = new PatientAdmission();

            foreach (var seg in segments)
            {
                var fields = seg.Split('|');
                if (fields[0] == "PID")
                {
                    admission.MedicalRecordNumber = fields[3];
                    var nameParts = fields[5].Split('^');
                    admission.LastName = nameParts[0];
                    admission.FirstName = nameParts.Length > 1 ? nameParts[1] : "";
                }
                else if (fields[0] == "PV1")
                {
                    admission.AssignedPatientLocation = fields[3];
                    admission.AttendingDoctor = fields[7];
                }
            }
            return admission;
        }
    }
}`
                }
              ]
            }
          ]
        }
      ];
    }

    if (targetId === 'proj-python-etl') {
      return [
        {
          id: 'dir-py-src',
          name: 'pipeline',
          path: 'pipeline',
          type: 'directory',
          children: [
            {
              id: 'file-py-tasks',
              name: 'reconciliation_tasks.py',
              path: 'pipeline/reconciliation_tasks.py',
              type: 'file',
              language: 'python',
              lines: 165,
              complexity: 14,
              dependencies: ['celery', 'pandas', 'sqlalchemy', 'django.db'],
              content: `import pandas as pd
from celery import shared_task
from django.db import transaction
from .models import LedgerEntry, ReconciliationBatch
import logging

logger = logging.getLogger(__name__)

@shared_task(bind=True, max_retries=3)
def reconcile_overnight_ledger(self, batch_id: str):
    """
    Asynchronous ETL pipeline worker:
    1. Loads raw clearing batches from S3 / PostgreSQL
    2. Computes net debit/credit balance differences
    3. Detects discrepancies > $0.01 tolerance
    """
    try:
        batch = ReconciliationBatch.objects.get(batch_id=batch_id)
        df = pd.read_sql("SELECT * FROM ledger_entries WHERE batch_id = %(b)s", 
                         params={'b': batch_id}, con=transaction.get_connection())

        grouped = df.groupby('account_number').agg({
            'debit_amount': 'sum',
            'credit_amount': 'sum'
        })
        grouped['net_delta'] = grouped['credit_amount'] - grouped['debit_amount']
        
        discrepancies = grouped[grouped['net_delta'].abs() > 0.01]
        if not discrepancies.empty:
            logger.warning(f"Found {len(discrepancies)} mismatched accounts in batch {batch_id}")
            batch.status = "FLAGGED_FOR_REVIEW"
        else:
            batch.status = "BALANCED"
        batch.save()
        return {"status": batch.status, "total_records": len(df)}
    except Exception as exc:
        logger.error(f"ETL error in batch {batch_id}: {exc}")
        raise self.retry(exc=exc, countdown=60)`
            }
          ]
        }
      ];
    }

    if (targetId === 'proj-scada-cpp') {
      return [
        {
          id: 'dir-cpp-src',
          name: 'src',
          path: 'src',
          type: 'directory',
          children: [
            {
              id: 'file-cpp-modbus',
              name: 'ModbusTelemetryWorker.cpp',
              path: 'src/ModbusTelemetryWorker.cpp',
              type: 'file',
              language: 'cpp',
              lines: 240,
              complexity: 18,
              dependencies: ['pthread', 'sys/socket.h', 'netinet/in.h', 'boost/circular_buffer.hpp'],
              content: `#include "ModbusTelemetryWorker.h"
#include <iostream>
#include <sys/socket.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <chrono>

namespace SCADA {

ModbusTelemetryWorker::ModbusTelemetryWorker(const std::string& host, int port)
    : m_host(host), m_port(port), m_running(false), m_sockfd(-1) {}

ModbusTelemetryWorker::~ModbusTelemetryWorker() {
    stop();
}

bool ModbusTelemetryWorker::connectToPLC() {
    m_sockfd = socket(AF_INET, SOCK_STREAM, 0);
    if (m_sockfd < 0) return false;

    struct sockaddr_in serv_addr{};
    serv_addr.sin_family = AF_INET;
    serv_addr.sin_port = htons(m_port);
    inet_pton(AF_INET, m_host.c_str(), &serv_addr.sin_addr);

    return connect(m_sockfd, (struct sockaddr*)&serv_addr, sizeof(serv_addr)) >= 0;
}

void ModbusTelemetryWorker::runLoop() {
    m_running = true;
    uint8_t buffer[256];
    while (m_running) {
        // Poll holding registers (Function code 0x03)
        ssize_t bytes = recv(m_sockfd, buffer, sizeof(buffer), 0);
        if (bytes > 0) {
            parseSensorFrame(buffer, bytes);
        }
        std::this_thread::sleep_for(std::chrono::milliseconds(100));
    }
}

}`
            }
          ]
        }
      ];
    }

    if (targetId === 'proj-cobol-core') {
      return [
        {
          id: 'dir-cobol-src',
          name: 'COBSRC',
          path: 'COBSRC',
          type: 'directory',
          children: [
            {
              id: 'file-cobol-post',
              name: 'BATPOST.cbl',
              path: 'COBSRC/BATPOST.cbl',
              type: 'file',
              language: 'cobol',
              lines: 480,
              complexity: 32,
              dependencies: ['ACCTREC', 'TRANREC', 'EXEC SQL'],
              content: `       IDENTIFICATION DIVISION.
       PROGRAM-ID.    BATPOST.
       AUTHOR.        ENTERPRISE BANKING CORE.
       DATE-WRITTEN.  1998-04-12.
      *---------------------------------------------------------------*
      * OVERNIGHT GENERAL LEDGER POSTING & BALANCE CALCULATOR         *
      *---------------------------------------------------------------*
       ENVIRONMENT DIVISION.
       INPUT-OUTPUT SECTION.
       FILE-CONTROL.
           SELECT TX-IN-FILE ASSIGN TO 'TXIN.DAT'
           ORGANIZATION IS SEQUENTIAL.

       DATA DIVISION.
       FILE SECTION.
       FD  TX-IN-FILE.
       01  TX-RECORD.
           05  TX-ACCOUNT-NUM      PIC X(16).
           05  TX-TYPE             PIC X(2).
           05  TX-AMOUNT           PIC 9(10)V99.
           05  TX-DATE             PIC X(8).

       WORKING-STORAGE SECTION.
       EXEC SQL INCLUDE SQLCA END-EXEC.
       EXEC SQL INCLUDE ACCTREC END-EXEC.

       01  WS-TOTAL-POSTED         PIC 9(12)V99 VALUE ZERO.
       01  WS-EOF-FLAG             PIC X VALUE 'N'.

       PROCEDURE DIVISION.
       0000-MAIN-LOGIC.
           OPEN INPUT TX-IN-FILE.
           PERFORM 1000-PROCESS-RECORD UNTIL WS-EOF-FLAG = 'Y'.
           CLOSE TX-IN-FILE.
           GOBACK.

       1000-PROCESS-RECORD.
           READ TX-IN-FILE
               AT END MOVE 'Y' TO WS-EOF-FLAG
               NOT AT END
                   EXEC SQL
                       UPDATE ACCOUNTS
                       SET BALANCE = BALANCE + :TX-AMOUNT
                       WHERE ACCOUNT_ID = :TX-ACCOUNT-NUM
                   END-EXEC
                   ADD TX-AMOUNT TO WS-TOTAL-POSTED
           END-READ.`
            }
          ]
        }
      ];
    }

    // Default File Tree (E-Commerce Order Management Microservice)
    return [
      {
        id: 'dir-src',
        name: 'src',
        path: 'src',
        type: 'directory',
        children: [
          {
            id: 'dir-controllers',
            name: 'controllers',
            path: 'src/controllers',
            type: 'directory',
            children: [
              {
                id: 'file-order-ctrl',
                name: 'OrderController.java',
                path: 'src/controllers/OrderController.java',
                type: 'file',
                language: 'java',
                lines: 36,
                size: 1240,
                complexity: 4,
                dependencies: ['OrderService', 'Order', 'ResponseEntity'],
                content: `package com.enterprise.ecommerce.controllers;

import com.enterprise.ecommerce.services.OrderService;
import com.enterprise.ecommerce.models.Order;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping("/checkout")
    public ResponseEntity<Order> createOrder(@RequestBody Order request) {
        Order created = orderService.processOrderCheckout(request);
        return ResponseEntity.ok(created);
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<Order> getOrder(@PathVariable UUID orderId) {
        return orderService.findOrderById(orderId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<Order>> getCustomerOrders(@PathVariable UUID customerId) {
        return ResponseEntity.ok(orderService.getOrdersByCustomer(customerId));
    }
}`
              }
            ]
          },
          {
            id: 'dir-services',
            name: 'services',
            path: 'src/services',
            type: 'directory',
            children: [
              {
                id: 'file-order-srv',
                name: 'OrderService.java',
                path: 'src/services/OrderService.java',
                type: 'file',
                language: 'java',
                lines: 42,
                size: 1540,
                complexity: 6,
                dependencies: ['OrderRepository', 'Order', 'OrderItem', 'Transactional'],
                content: `package com.enterprise.ecommerce.services;

import com.enterprise.ecommerce.repositories.OrderRepository;
import com.enterprise.ecommerce.models.Order;
import com.enterprise.ecommerce.models.OrderItem;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class OrderService {

    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @Transactional
    public Order processOrderCheckout(Order order) {
        BigDecimal total = BigDecimal.ZERO;
        for (OrderItem item : order.getItems()) {
            BigDecimal lineTotal = item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
            total = total.add(lineTotal);
        }
        order.setTotalAmount(total);
        order.setStatus("PROCESSING");
        
        return orderRepository.save(order);
    }

    public Optional<Order> findOrderById(UUID orderId) {
        return orderRepository.findById(orderId);
    }

    public List<Order> getOrdersByCustomer(UUID customerId) {
        return orderRepository.findByCustomerId(customerId);
    }
}`
              }
            ]
          },
          {
            id: 'dir-repositories',
            name: 'repositories',
            path: 'src/repositories',
            type: 'directory',
            children: [
              {
                id: 'file-order-repo',
                name: 'OrderRepository.java',
                path: 'src/repositories/OrderRepository.java',
                type: 'file',
                language: 'java',
                lines: 14,
                size: 520,
                complexity: 1,
                dependencies: ['Order', 'JpaRepository'],
                content: `package com.enterprise.ecommerce.repositories;

import com.enterprise.ecommerce.models.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface OrderRepository extends JpaRepository<Order, UUID> {
    List<Order> findByCustomerId(UUID customerId);
    List<Order> findByStatus(String status);
}`
              }
            ]
          },
          {
            id: 'dir-models',
            name: 'models',
            path: 'src/models',
            type: 'directory',
            children: [
              {
                id: 'file-order-model',
                name: 'Order.java',
                path: 'src/models/Order.java',
                type: 'file',
                language: 'java',
                lines: 48,
                size: 1680,
                complexity: 2,
                content: `package com.enterprise.ecommerce.models;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false)
    private UUID customerId;

    @Column(nullable = false)
    private BigDecimal totalAmount;

    @Column(nullable = false)
    private String status;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "order_id")
    private List<OrderItem> items = new ArrayList<>();

    private LocalDateTime createdAt = LocalDateTime.now();
}`
              }
            ]
          }
        ]
      },
      {
        id: 'file-pom',
        name: 'pom.xml',
        path: 'pom.xml',
        type: 'file',
        language: 'xml',
        lines: 32,
        size: 1100,
        complexity: 1,
        content: `<project xmlns="http://maven.apache.org/POM/4.0.0">
  <modelVersion>4.0.0</modelVersion>
  <groupId>com.enterprise.ecommerce</groupId>
  <artifactId>ecommerce-order-service</artifactId>
  <version>1.4.0-SNAPSHOT</version>
</project>`
      },
      {
        id: 'file-readme',
        name: 'README.md',
        path: 'README.md',
        type: 'file',
        language: 'markdown',
        lines: 18,
        size: 650,
        complexity: 1,
        content: `# E-Commerce Order Management Microservice

Enterprise order fulfillment service connecting REST clients, PostgreSQL data storage, and legacy inventory ledgers.`
      }
    ];
  }

  getDependencyGraph(projectId?: string): DependencyGraphData {
    return {
      nodes: [
        { id: 'auth-ctrl', name: 'AuthController', type: 'controller', layer: 'Presentation Layer', filesCount: 1, color: '#3B82F6' },
        { id: 'acct-ctrl', name: 'AccountController', type: 'controller', layer: 'Presentation Layer', filesCount: 1, color: '#3B82F6' },
        { id: 'tx-ctrl', name: 'TransactionController', type: 'controller', layer: 'Presentation Layer', filesCount: 1, color: '#3B82F6' },
        
        { id: 'auth-srv', name: 'AuthService', type: 'service', layer: 'Application Service Layer', filesCount: 1, color: '#8B5CF6' },
        { id: 'acct-srv', name: 'AccountService', type: 'service', layer: 'Application Service Layer', filesCount: 1, color: '#8B5CF6' },
        { id: 'tx-srv', name: 'TransactionService', type: 'service', layer: 'Application Service Layer', filesCount: 1, color: '#8B5CF6' },
        { id: 'fraud-srv', name: 'FraudScoringEngine', type: 'external', layer: 'External Integrations', filesCount: 1, color: '#EC4899' },
        
        { id: 'user-repo', name: 'UserRepository', type: 'repository', layer: 'Persistence Layer', filesCount: 1, color: '#10B981' },
        { id: 'acct-repo', name: 'AccountRepository', type: 'repository', layer: 'Persistence Layer', filesCount: 1, color: '#10B981' },
        { id: 'ledger-dao', name: 'LedgerDAO (PL/SQL)', type: 'repository', layer: 'Persistence Layer', filesCount: 1, color: '#10B981' },
        
        { id: 'oracle-db', name: 'Oracle Database (FINCORE)', type: 'database', layer: 'Database Layer', filesCount: 1, color: '#F59E0B' },
        { id: 'mq-queue', name: 'IBM MQ Event Broker', type: 'external', layer: 'Message Infrastructure', filesCount: 1, color: '#06B6D4' }
      ],
      links: [
        { source: 'auth-ctrl', target: 'auth-srv', label: 'invokes', callCount: 420 },
        { source: 'acct-ctrl', target: 'acct-srv', label: 'invokes', callCount: 890 },
        { source: 'tx-ctrl', target: 'tx-srv', label: 'invokes', callCount: 1250 },
        
        { source: 'auth-srv', target: 'user-repo', label: 'queries', callCount: 420 },
        { source: 'acct-srv', target: 'acct-repo', label: 'queries', callCount: 890 },
        { source: 'tx-srv', target: 'acct-repo', label: 'locks & updates', callCount: 1250 },
        { source: 'tx-srv', target: 'ledger-dao', label: 'executes stored proc', callCount: 1250 },
        { source: 'tx-srv', target: 'fraud-srv', label: 'scores risk', callCount: 1250 },
        { source: 'tx-srv', target: 'mq-queue', label: 'publishes event', callCount: 1250 },
        
        { source: 'user-repo', target: 'oracle-db', label: 'SQL SELECT', callCount: 420 },
        { source: 'acct-repo', target: 'oracle-db', label: 'SQL SELECT/UPDATE', callCount: 890 },
        { source: 'ledger-dao', target: 'oracle-db', label: 'PL/SQL EXECUTE', callCount: 1250 }
      ]
    };
  }
}
