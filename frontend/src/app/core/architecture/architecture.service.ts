import { Injectable, inject } from '@angular/core';
import { ArchitectureAnalysis, AIRecommendation } from '@codelens/shared';
import { ProjectService } from '../projects/project.service';
import { TranslationService } from '../i18n/translation.service';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ArchitectureService {
  private projectService = inject(ProjectService);
  private translationService = inject(TranslationService);

  private generateAnalysis(): ArchitectureAnalysis {
    const proj = this.projectService.selectedProject();
    const isEs = this.translationService.isSpanish();
    const isMindguard = (proj.name || '').toLowerCase().includes('mindguard') || (proj.slug || '').includes('mindguard') || (proj.name || '').toLowerCase().includes('quality');
    const isEHR = (proj.name || '').toLowerCase().includes('ehr') || (proj.name || '').toLowerCase().includes('clinical') || (proj.name || '').toLowerCase().includes('patient');
    const isPython = (proj.mainLanguage || '').toLowerCase() === 'python' || isMindguard || isEHR;

    const name = proj.name || (isMindguard ? 'MindGuard — Software Quality & Mental Health Platform' : (isEHR ? 'Clinical Electronic Health Record (EHR) API' : 'E-Commerce Order Management Microservice'));
    const arch = proj.architecture || 'Layered Architecture';

    if (isMindguard) {
      return {
        id: `arch-${proj.id}`,
        projectId: proj.id,
        type: 'Layered',
        confidence: 96,
        summary: `Arquitectura en Capas (${arch}) con Enrutadores FastAPI, Servicios Psicométricos de IA y Persistencia SQLAlchemy.`,
        explanation: `La plataforma ${name} implementa una arquitectura desacoplada en capas. La capa de presentación (backend/app/api/assessments.py y auth.py) recibe los cuestionarios PHQ-9 y GAD-7, los delega a los servicios de evaluación clínica e inteligencia artificial (backend/app/services/clinical_ai.py) que integran Google Gemini y Groq, y almacena las evaluaciones en la base de datos mediante modelos SQLAlchemy (backend/app/models/base.py).`,
        evidence: [
          {
            title: 'Separación Modular de Endpoints y Servicios Clínicos',
            description: 'Inyección de dependencias con Depends(get_db) y Depends(get_current_user) para aislar la autenticación y las transacciones.',
            files: ['backend/app/api/assessments.py', 'backend/app/services/clinical_ai.py', 'backend/app/api/deps.py'],
            confidence: 97
          },
          {
            title: 'Modelado Relacional de Usuarios y Evaluaciones Psicométricas',
            description: 'Esquema SQLAlchemy normalizado con relaciones 1:N entre Usuario, Evaluacion, RegistroEmocional y Cita.',
            files: ['backend/app/models/base.py'],
            confidence: 96
          },
          {
            title: 'Integración Multi-Modelo de Inteligencia Artificial',
            description: 'Servicio clínico desacoplado que soporta inferencia híbrida (Google Gemini 1.5, Groq y Qwen 2.5 local).',
            files: ['backend/app/services/clinical_ai.py', 'backend/app/services/assessment_ai.py'],
            confidence: 95
          }
        ],
        components: [
          {
            name: 'Capa de Enrutamiento API (FastAPI)',
            type: 'API Router',
            role: 'Controladores de autenticación, evaluaciones y chat',
            responsibilities: ['Validar payloads con Pydantic', 'Verificar tokens JWT con OAuth2PasswordBearer', 'Manejar excepciones HTTP'],
            filePatterns: ['backend/app/api/*.py'],
            layer: 'Presentation'
          },
          {
            name: 'Capa de Servicios de Dominio e IA',
            type: 'Domain & AI Service',
            role: 'Lógica clínica, cálculo PHQ-9/GAD-7 e inferencia LLM',
            responsibilities: ['Calcular puntajes psicométricos', 'Evaluar umbrales de riesgo clínico', 'Generar diagnósticos con LLM'],
            filePatterns: ['backend/app/services/*.py'],
            layer: 'Business Logic'
          },
          {
            name: 'Capa de Modelos y Persistencia (SQLAlchemy)',
            type: 'ORM & Database Layer',
            role: 'Mapeo de datos relacionales y gestión de sesiones',
            responsibilities: ['Persistir usuarios y evaluaciones', 'Gestionar transacciones ACID', 'Control de integridad referencial'],
            filePatterns: ['backend/app/models/*.py', 'backend/app/core/database.py'],
            layer: 'Persistence'
          }
        ],
        layers: [
          {
            name: 'Capa de Presentación Web & API',
            description: 'Frontend Angular 17 y Enrutadores REST FastAPI.',
            components: ['assessments.py', 'auth.py', 'chat.py'],
            dependsOn: ['Capa de Servicios de Dominio e IA']
          },
          {
            name: 'Capa de Servicios de Dominio e IA',
            description: 'Servicios de evaluación psicométrica y llamadas a modelos de IA.',
            components: ['clinical_ai.py', 'assessment_ai.py', 'business_services.py'],
            dependsOn: ['Capa de Persistencia']
          },
          {
            name: 'Capa de Persistencia',
            description: 'Modelos relacionales SQLAlchemy y motor SQLite / PostgreSQL.',
            components: ['Usuario', 'Evaluacion', 'RegistroEmocional', 'ResultadoIA'],
            dependsOn: []
          }
        ],
        risks: [
          'Dependencia de APIs externas (Gemini/Groq) que podrían presentar latencia o indisponibilidad sin fallback local',
          'Almacenamiento de respuestas psicométricas en texto plano sin cifrado a nivel de columna en base de datos',
          'Falta de limitación de tasa de peticiones (Rate Limiting) en el endpoint público de autenticación'
        ]
      };
    }

    if (isPython) {
      if (isEs) {
        return {
          id: `arch-${proj.id}`,
          projectId: proj.id,
          type: 'Layered',
          confidence: proj.confidence || 95,
          summary: `Arquitectura en Capas (${arch}) asíncrona con separación entre Enrutadores FastAPI, Servicios de Dominio y Repositorios SQLAlchemy 2.0.`,
          explanation: `El microservicio ${name} implementa una arquitectura modular no bloqueante. Las peticiones HTTP ingresan a través del enrutador FastAPI (src/api/patients_router.py) con validación estricta de esquemas Pydantic, se delegan a la capa de servicios (src/services/patient_service.py) para verificación biométrica y se persisten de forma asíncrona mediante repositorios SQLAlchemy (src/repositories/patient_repository.py).`,
          evidence: [
            {
              title: 'Separación por Capas con Inyección de Dependencias',
              description: 'Uso de Depends(get_service) y Depends(get_db) para desacoplar completamente las capas de transporte, negocio y datos.',
              files: ['src/api/patients_router.py', 'src/services/patient_service.py', 'src/repositories/patient_repository.py'],
              confidence: 97
            },
            {
              title: 'Patrón Repositorio y Mapeo Asíncrono (Async ORM)',
              description: 'Encapsulamiento de transacciones SQLAlchemy con selectinload para carga eficiente de registros clínicos.',
              files: ['src/repositories/patient_repository.py', 'src/models/patient.py', 'src/models/clinical_record.py'],
              confidence: 95
            },
            {
              title: 'Contratos Fuertemente Tipados (DTOs Pydantic)',
              description: 'Modelos de validación PatientCreate, PatientResponse y ClinicalRecordCreate que aíslan las entidades de la API pública.',
              files: ['src/schemas/patient_dto.py'],
              confidence: 94
            }
          ],
          components: [
            {
              name: 'Capa de Enrutamiento API (FastAPI)',
              type: 'API Router',
              role: 'Recepción de solicitudes HTTP y validación de DTOs',
              responsibilities: ['Validar esquemas Pydantic', 'Enrutar endpoints de pacientes', 'Manejo de excepciones HTTPException'],
              filePatterns: ['src/api/*.py'],
              layer: 'Presentation'
            },
            {
              name: 'Capa de Servicios Clínicos (Dominio)',
              type: 'Service Layer',
              role: 'Reglas de negocio y validación de telemetría',
              responsibilities: ['Validar unicidad de MRN', 'Verificar rangos de presión arterial y pulso', 'Coordinar transacciones'],
              filePatterns: ['src/services/*.py'],
              layer: 'Business Logic'
            },
            {
              name: 'Capa de Repositorios (SQLAlchemy Async)',
              type: 'Async ORM Layer',
              role: 'Consultas asíncronas y persistencia relacional',
              responsibilities: ['Consultas por ID y MRN', 'Carga anticipada de relaciones (Eager Loading)', 'Gestión del pool de conexiones'],
              filePatterns: ['src/repositories/*.py', 'src/models/*.py'],
              layer: 'Persistence'
            }
          ],
          layers: [
            {
              name: 'Capa de Presentación',
              description: 'Enrutador FastAPI que gestiona las peticiones REST de historiales clínicos.',
              components: ['patients_router.py'],
              dependsOn: ['Capa de Servicios Clínicos']
            },
            {
              name: 'Capa de Servicios Clínicos',
              description: 'Servicio de dominio que ejecuta validaciones de telemetría y reglas médicas.',
              components: ['patient_service.py'],
              dependsOn: ['Capa de Repositorios']
            },
            {
              name: 'Capa de Repositorios',
              description: 'Repositorio asíncrono con sesiones AsyncSession y driver asyncpg.',
              components: ['patient_repository.py'],
              dependsOn: ['Base de Datos PostgreSQL']
            },
            {
              name: 'Modelos de Dominio',
              description: 'Entidades relacionales Patient y ClinicalRecord.',
              components: ['Patient', 'ClinicalRecord'],
              dependsOn: []
            }
          ],
          risks: [
            'Falta de autenticación JWT y control de acceso basado en roles (RBAC) en los endpoints clínicos',
            'Ausencia de alertas automáticas para valores de telemetría biométrica fuera de rango crítico',
            'Falta de migraciones automáticas con Alembic configuradas en el pipeline de despliegue'
          ]
        };
      }

      return {
        id: `arch-${proj.id}`,
        projectId: proj.id,
        type: 'Layered',
        confidence: proj.confidence || 95,
        summary: `Asynchronous Layered Architecture with FastAPI routers, domain services, and SQLAlchemy 2.0 repositories.`,
        explanation: `The codebase of ${name} adheres to an async layered architecture with Pydantic DTOs and SQLAlchemy asyncpg repositories.`,
        evidence: [],
        components: [],
        layers: [],
        risks: []
      };
    }

    return {
      id: `arch-${proj.id}`,
      projectId: proj.id,
      type: 'Layered',
      confidence: 94,
      summary: `Strict N-Tier Layered Architecture with REST Controllers and JPA Repositories.`,
      explanation: `Spring Boot layered architecture for ${name}.`,
      evidence: [],
      components: [],
      layers: [],
      risks: []
    };
  }

  private generateRecommendations(): AIRecommendation[] {
    const proj = this.projectService.selectedProject();
    const isEs = this.translationService.isSpanish();
    const isMindguard = (proj.name || '').toLowerCase().includes('mindguard') || (proj.slug || '').includes('mindguard') || (proj.name || '').toLowerCase().includes('quality');
    const isEHR = (proj.name || '').toLowerCase().includes('ehr') || (proj.name || '').toLowerCase().includes('clinical') || (proj.name || '').toLowerCase().includes('patient');

    if (isMindguard) {
      return [
        {
          id: 'rec-mg-1',
          projectId: proj.id,
          title: 'Implementar Fallback Local con Ollama para Inferencia Psicométrica',
          severity: 'HIGH',
          category: 'PERFORMANCE',
          file: 'backend/app/services/clinical_ai.py',
          lineRange: 'L35-L65',
          explanation: 'La llamada a las APIs de Google Gemini y Groq puede fallar o exceder las cuotas de red. Un fallback local garantiza disponibilidad continua.',
          recommendation: 'Capturar excepciones de red y redirigir el prompt hacia el daemon local de Ollama (http://localhost:11434/api/generate) con Qwen 2.5 Coder.'
        },
        {
          id: 'rec-mg-2',
          projectId: proj.id,
          title: 'Cifrado de Datos Psicométricos Sensibles en Reposo',
          severity: 'HIGH',
          category: 'SECURITY',
          file: 'backend/app/models/base.py',
          lineRange: 'L55-L75',
          explanation: 'Los campos phq9_respuestas y notas_personales contienen información de salud altamente confidencial almacenada en texto plano.',
          recommendation: 'Integrar SQLAlchemy-Utils TypeDecorator con cifrado AES-256 (Fernet) para los campos de respuestas psicométricas.'
        },
        {
          id: 'rec-mg-3',
          projectId: proj.id,
          title: 'Añadir Limitador de Tasa (Rate Limiting) en Endpoints de Autenticación',
          severity: 'MEDIUM',
          category: 'SECURITY',
          file: 'backend/app/api/auth.py',
          lineRange: 'L15-L35',
          explanation: 'El endpoint /api/v1/auth/login no cuenta con límite de peticiones, lo que expone el sistema a ataques de fuerza bruta.',
          recommendation: 'Integrar middleware slowapi con decorador @limiter.limit("5/minute") sobre la ruta de inicio de sesión.'
        }
      ];
    }

    if (isEHR) {
      if (isEs) {
        return [
          {
            id: 'rec-1',
            projectId: proj.id,
            title: 'Implementar Autenticación OAuth2 / JWT con Roles Clínicos',
            severity: 'CRITICAL',
            category: 'SECURITY',
            file: 'src/api/patients_router.py',
            lineRange: 'L18-L45',
            explanation: 'Los endpoints de consulta y registro de historias clínicas no validan tokens de autorización.',
            recommendation: 'Añadir dependencia Security(get_current_active_doctor, scopes=["clinical:write"]).'
          },
          {
            id: 'rec-2',
            projectId: proj.id,
            title: 'Añadir Migraciones de Base de Datos con Alembic',
            severity: 'HIGH',
            category: 'MAINTAINABILITY',
            file: 'src/config/database.py',
            lineRange: 'L1-L25',
            explanation: 'El inicio de la aplicación utiliza Base.metadata.create_all.',
            recommendation: 'Configurar alembic.ini para gestionar migraciones de esquema versionadas.'
          }
        ];
      }
    }

    return [];
  }

  getAnalysis(projectId?: string): Observable<ArchitectureAnalysis> {
    return of(this.generateAnalysis()).pipe(delay(80));
  }

  getRecommendations(projectId?: string): Observable<AIRecommendation[]> {
    return of(this.generateRecommendations()).pipe(delay(80));
  }
}
