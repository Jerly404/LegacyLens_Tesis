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
    const isPython = (proj.mainLanguage || '').toLowerCase() === 'python' || 
                     (proj.name || '').toLowerCase().includes('ehr') || 
                     (proj.name || '').toLowerCase().includes('clinical') || 
                     (proj.name || '').toLowerCase().includes('patient');

    const name = proj.name || (isPython ? 'Clinical Electronic Health Record (EHR) API' : 'E-Commerce Order Management Microservice');
    const arch = proj.architecture || 'Layered Architecture';

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

      // English Python EHR
      return {
        id: `arch-${proj.id}`,
        projectId: proj.id,
        type: 'Layered',
        confidence: proj.confidence || 95,
        summary: `Asynchronous Layered Architecture with FastAPI routers, domain services, and SQLAlchemy 2.0 repositories.`,
        explanation: `The codebase of ${name} adheres to an async layered architecture with Pydantic DTOs and SQLAlchemy asyncpg repositories.`,
        evidence: [
          {
            title: 'Layered Separation via Dependency Injection',
            description: 'FastAPI Depends() injection ensures clean tier decoupling.',
            files: ['src/api/patients_router.py', 'src/services/patient_service.py', 'src/repositories/patient_repository.py'],
            confidence: 97
          }
        ],
        components: [
          {
            name: 'API Router Tier',
            type: 'FastAPI Router',
            role: 'HTTP routing',
            responsibilities: ['Validate payloads'],
            filePatterns: ['src/api/*.py'],
            layer: 'Presentation'
          }
        ],
        layers: [
          {
            name: 'Presentation Layer',
            description: 'FastAPI async routers',
            components: ['patients_router.py'],
            dependsOn: ['Domain Services']
          }
        ],
        risks: [
          'Missing JWT auth on clinical telemetry endpoints',
          'Alembic auto-migrations missing in container startup'
        ]
      };
    }

    // Java fallback
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
    const isPython = (proj.mainLanguage || '').toLowerCase() === 'python' || 
                     (proj.name || '').toLowerCase().includes('ehr') || 
                     (proj.name || '').toLowerCase().includes('clinical') || 
                     (proj.name || '').toLowerCase().includes('patient');

    if (isPython) {
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
            explanation: 'Los endpoints de consulta y registro de historias clínicas no validan tokens de autorización, lo que expone datos médicos sensibles.',
            recommendation: 'Añadir dependencia Security(get_current_active_doctor, scopes=["clinical:write"]) para proteger el acceso con JWT.',
            suggestedCode: `@router.post("/", response_model=PatientResponse)
async def register_patient(
    dto: PatientCreate, 
    current_user: Doctor = Security(get_current_user, scopes=["patients:create"]),
    service: PatientService = Depends(get_service)
):
    return await service.register_new_patient(dto)`
          },
          {
            id: 'rec-2',
            projectId: proj.id,
            title: 'Añadir Migraciones de Base de Datos con Alembic',
            severity: 'HIGH',
            category: 'MAINTAINABILITY',
            file: 'src/config/database.py',
            lineRange: 'L1-L25',
            explanation: 'El inicio de la aplicación utiliza Base.metadata.create_all, lo cual no permite cambios de esquema incrementales en entornos de producción.',
            recommendation: 'Configurar alembic.ini y env.py para gestionar migraciones de esquema versionadas de forma controlada.'
          },
          {
            id: 'rec-3',
            projectId: proj.id,
            title: 'Implementar Caché Distribuido con Redis para Consultas Frecuentes',
            severity: 'MEDIUM',
            category: 'PERFORMANCE',
            file: 'src/services/patient_service.py',
            lineRange: 'L18-L30',
            explanation: 'Las consultas repetitivas de datos de pacientes (MRN) generan lecturas directas a la base de datos relacional.',
            recommendation: 'Integrar decorador @cache(expire=300) con Redis para cachear el resumen del paciente tras su consulta inicial.'
          },
          {
            id: 'rec-4',
            projectId: proj.id,
            title: 'Añadir Alerta de Telemetría Biométrica Crítica',
            severity: 'MEDIUM',
            category: 'ARCHITECTURE',
            file: 'src/services/patient_service.py',
            lineRange: 'L25-L38',
            explanation: 'La validación de presión arterial sistólica > 220 mmHg no emite notificaciones asíncronas hacia el personal médico.',
            recommendation: 'Publicar evento BiometricAlertEvent hacia un bus de mensajería (RabbitMQ / Kafka) cuando se detecte un signo vital anómalo.'
          }
        ];
      }

      return [
        {
          id: 'rec-1',
          projectId: proj.id,
          title: 'Implement OAuth2 / JWT Authentication with Clinical Scopes',
          severity: 'CRITICAL',
          category: 'SECURITY',
          file: 'src/api/patients_router.py',
          lineRange: 'L18-L45',
          explanation: 'Clinical endpoints are currently unauthenticated.',
          recommendation: 'Add FastAPI OAuth2PasswordBearer and JWT token verification.'
        }
      ];
    }

    // Java fallback
    return [
      {
        id: 'rec-1',
        projectId: proj.id,
        title: 'Decouple JPA Entities from REST API using DTOs',
        severity: 'HIGH',
        category: 'ARCHITECTURE',
        file: 'src/controllers/OrderController.java',
        lineRange: 'L18-L35',
        explanation: 'Directly returning JPA entities in REST endpoints exposes internal database schemas.',
        recommendation: 'Create dedicated CreateOrderRequest and OrderResponse DTO records.'
      }
    ];
  }

  getAnalysis(projectId?: string): Observable<ArchitectureAnalysis> {
    return of(this.generateAnalysis()).pipe(delay(80));
  }

  getRecommendations(projectId?: string): Observable<AIRecommendation[]> {
    return of(this.generateRecommendations()).pipe(delay(80));
  }
}
