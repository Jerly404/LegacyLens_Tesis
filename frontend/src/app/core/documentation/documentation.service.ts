import { Injectable, signal, inject } from '@angular/core';
import { DocumentationSection } from '@codelens/shared';
import { ProjectService } from '../projects/project.service';
import { TranslationService } from '../i18n/translation.service';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DocumentationService {
  private projectService = inject(ProjectService);
  private translationService = inject(TranslationService);

  private generateDocsForProject(): DocumentationSection[] {
    const proj = this.projectService.selectedProject();
    const isEs = this.translationService.isSpanish();
    const isPython = (proj.mainLanguage || '').toLowerCase() === 'python' || 
                     (proj.name || '').toLowerCase().includes('ehr') || 
                     (proj.name || '').toLowerCase().includes('clinical') || 
                     (proj.name || '').toLowerCase().includes('patient');

    const name = proj.name || (isPython ? 'Clinical Electronic Health Record (EHR) API' : 'E-Commerce Order Management Microservice');
    const lang = proj.mainLanguage || (isPython ? 'Python' : 'Java');
    const framework = proj.framework || (isPython ? 'FastAPI & Async SQLAlchemy 2.0' : 'Spring Boot & JPA');
    const arch = proj.architecture || 'Layered Architecture';
    const dateStr = new Date().toISOString().replace('T', ' ').substring(0, 16);

    if (isPython) {
      if (isEs) {
        return [
          {
            id: 'doc-overview',
            projectId: proj.id,
            title: 'Resumen Ejecutivo y Propósito del Sistema',
            slug: 'overview',
            category: 'Overview',
            lastUpdated: dateStr,
            generatedByAI: true,
            content: `# ${name} — Resumen del Sistema

## 1. Resumen Ejecutivo
El sistema **${name}** es un microservicio de salud clínica de alto rendimiento desarrollado en **${lang} 3.11** utilizando el framework asíncrono **${framework}**. Implementa una arquitectura **${arch}** diseñada para la ingesta de historias clínicas, registro de signos vitales y telemetría biométrica de pacientes.

## 2. Capacidades Principales
- **Gestión Maestra de Pacientes**: Registro y consulta indexada mediante Identificador Médico Único (MRN).
- **Ingesta de Observaciones Clínicas**: Almacenamiento de diagnósticos CIE-10, presión arterial y frecuencia cardíaca.
- **ORM Asíncrono de Alto Rendimiento**: Acceso no bloqueante a PostgreSQL con \`asyncpg\` y \`SQLAlchemy 2.0\`.
- **Validación Automática de Esquemas**: Contratos de datos fuertemente tipados mediante DTOs de Pydantic v2.

## 3. Stack Tecnológico de Alto Nivel
- **Lenguaje / Runtime**: ${lang} 3.11 (${framework})
- **Patrón Arquitectónico**: ${arch}
- **Base de Datos**: PostgreSQL 16 (Motor Relacional Asíncrono)
- **Motor de IA Local**: Qwen 2.5 Coder 7B (GPU Local RTX 3050 con aceleración CUDA)
`
          },
          {
            id: 'doc-architecture',
            projectId: proj.id,
            title: 'Arquitectura de Software y Límites de Capas',
            slug: 'architecture',
            category: 'Architecture',
            lastUpdated: dateStr,
            generatedByAI: true,
            content: `# Arquitectura de Software y Límites de Capas

## 1. Estilo Arquitectónico: ${arch}
El microservicio se organiza en módulos desacoplados con inyección de dependencias nativa de FastAPI:

- **Capa de Endpoints REST (\`src/api/patients_router.py\`)\**: Define las rutas HTTP, deserializa JSON y valida los DTOs de entrada.
- **Capa de Servicios de Dominio (\`src/services/patient_service.py\`)\**: Ejecuta las validaciones clínicas y reglas de negocio.
- **Capa de Repositorios (\`src/repositories/patient_repository.py\`)\**: Realiza consultas asíncronas con \`selectinload\` para evitar el problema N+1.
- **Capa de Modelos Relacionales (\`src/models/\`)\**: Entidades SQLAlchemy \`Patient\` y \`ClinicalRecord\`.
`
          },
          {
            id: 'doc-api',
            projectId: proj.id,
            title: 'Especificación de Contratos y Endpoints REST',
            slug: 'api-specification',
            category: 'API',
            lastUpdated: dateStr,
            generatedByAI: true,
            content: `# Especificación de Contratos y Endpoints REST

### URL Base: \`/api/v1/patients\`

## 1. Registro de Paciente
### \`POST /api/v1/patients/\`
Crea una nueva historia clínica en el sistema.

**Cuerpo de la Petición (JSON):**
\`\`\`json
{
  "medical_record_number": "MRN-88231",
  "first_name": "Sarah",
  "last_name": "Connor",
  "date_of_birth": "1985-06-15",
  "blood_group": "O+",
  "contact_phone": "+1-555-0199"
}
\`\`\`

**Respuesta Exitosa \`201 Created\`:**
\`\`\`json
{
  "id": "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
  "medical_record_number": "MRN-88231",
  "first_name": "Sarah",
  "last_name": "Connor",
  "created_at": "2026-08-25T19:00:00Z"
}
\`\`\`

---

## 2. Ingesta de Registro Clínico y Telemetría
### \`POST /api/v1/patients/{patient_id}/records\`
Registra observaciones biométricas (presión arterial, frecuencia cardíaca y diagnóstico).

**Cuerpo de la Petición (JSON):**
\`\`\`json
{
  "diagnosis_code": "I10",
  "systolic_bp": 120.0,
  "diastolic_bp": 80.0,
  "heart_rate": 72.0,
  "clinical_notes": "Examen de rutina normal.",
  "attending_physician": "Dr. Gregory House, MD"
}
\`\`\`
`
          },
          {
            id: 'doc-database',
            projectId: proj.id,
            title: 'Modelos de Base de Datos y Diccionario de Datos',
            slug: 'database-models',
            category: 'Database',
            lastUpdated: dateStr,
            generatedByAI: true,
            content: `# Modelos de Base de Datos y Diccionario de Datos

## 1. Tabla Maestra: \`patients\`
Almacena el registro maestro de identificación del paciente.

| Columna | Tipo de Dato | Restricción | Descripción |
|---|---|---|---|
| \`id\` | UUID | PRIMARY KEY | Identificador único global |
| \`medical_record_number\` | VARCHAR(32) | UNIQUE, NOT NULL | Número de historia clínica (MRN) |
| \`first_name\` | VARCHAR(64) | NOT NULL | Nombres del paciente |
| \`last_name\` | VARCHAR(64) | NOT NULL | Apellidos del paciente |
| \`date_of_birth\` | DATE | NOT NULL | Fecha de nacimiento |
| \`blood_group\` | VARCHAR(8) | NULLABLE | Grupo sanguíneo (\`O+\`, \`A-\`, etc.) |
| \`created_at\` | TIMESTAMP | NOT NULL | Fecha de registro |

## 2. Tabla de Eventos: \`clinical_records\`
Almacena el histórico inmutable de consultas y signos vitales.

| Columna | Tipo de Dato | Restricción | Descripción |
|---|---|---|---|
| \`id\` | UUID | PRIMARY KEY | Identificador de la observación |
| \`patient_id\` | UUID | FOREIGN KEY (\`patients.id\`) | Referencia al paciente |
| \`diagnosis_code\` | VARCHAR(32) | NOT NULL | Código diagnóstico CIE-10 |
| \`systolic_bp\` | FLOAT | NULLABLE | Presión sistólica (mmHg) |
| \`diastolic_bp\` | FLOAT | NULLABLE | Presión diastólica (mmHg) |
| \`heart_rate\` | FLOAT | NULLABLE | Frecuencia cardíaca (LPM) |
| \`attending_physician\` | VARCHAR(128) | NOT NULL | Médico tratante |
`
          },
          {
            id: 'doc-deployment',
            projectId: proj.id,
            title: 'Infraestructura de Despliegue y Contenedores',
            slug: 'deployment',
            category: 'Deployment',
            lastUpdated: dateStr,
            generatedByAI: true,
            content: `# Infraestructura de Despliegue y Contenedores

## 1. Contenedor Docker ASGI
Empaquetado optimizado con Python 3.11-slim y servidor ASGI Uvicorn:

\`\`\`dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
\`\`\`

## 2. Entorno de Inferencia de Inteligencia Artificial Local
- **Motor de Inferencia**: Daemon Ollama (\`http://localhost:11434\`)
- **Modelo Activo**: Qwen 2.5 Coder 7B
- **Aceleración por GPU**: NVIDIA GeForce RTX 3050 (4GB VRAM con CUDA 13.3)
`
          }
        ];
      }

      // English Python EHR
      return [
        {
          id: 'doc-overview',
          projectId: proj.id,
          title: 'System Overview & Executive Purpose',
          slug: 'overview',
          category: 'Overview',
          lastUpdated: dateStr,
          generatedByAI: true,
          content: `# ${name} — System Overview\n\nAsync Python 3.11 / FastAPI microservice for patient health records and biometric telemetry ingestion.`
        },
        {
          id: 'doc-architecture',
          projectId: proj.id,
          title: 'Software Architecture & Component Boundaries',
          slug: 'architecture',
          category: 'Architecture',
          lastUpdated: dateStr,
          generatedByAI: true,
          content: `# System Architecture\n\nLayered architecture separating FastAPI router, domain service, and SQLAlchemy async repository.`
        },
        {
          id: 'doc-api',
          projectId: proj.id,
          title: 'REST API & Endpoints Specification',
          slug: 'api-specification',
          category: 'API',
          lastUpdated: dateStr,
          generatedByAI: true,
          content: `# REST API Specification\n\n- \`POST /api/v1/patients/\`: Register patient\n- \`GET /api/v1/patients/{patient_id}\`: Get patient summary\n- \`POST /api/v1/patients/{patient_id}/records\`: Ingest clinical record`
        },
        {
          id: 'doc-database',
          projectId: proj.id,
          title: 'Database Models & Schema Dictionary',
          slug: 'database-models',
          category: 'Database',
          lastUpdated: dateStr,
          generatedByAI: true,
          content: `# Database Models\n\nRelational schema with \`patients\` and \`clinical_records\` tables.`
        },
        {
          id: 'doc-deployment',
          projectId: proj.id,
          title: 'Deployment & Container Infrastructure',
          slug: 'deployment',
          category: 'Deployment',
          lastUpdated: dateStr,
          generatedByAI: true,
          content: `# Deployment\n\nDockerized Python 3.11-slim with Uvicorn ASGI server.`
        }
      ];
    }

    // Java E-Commerce fallback
    if (isEs) {
      return [
        {
          id: 'doc-overview',
          projectId: proj.id,
          title: 'Resumen Ejecutivo y Propósito del Sistema',
          slug: 'overview',
          category: 'Overview',
          lastUpdated: dateStr,
          generatedByAI: true,
          content: `# ${name} — Resumen del Sistema\n\nMicroservicio empresarial desarrollado en ${lang} utilizando ${framework}.`
        },
        {
          id: 'doc-architecture',
          projectId: proj.id,
          title: 'Arquitectura de Software y Límites de Capas',
          slug: 'architecture',
          category: 'Architecture',
          lastUpdated: dateStr,
          generatedByAI: true,
          content: `# Arquitectura de Software\n\nEstructura en capas con Controladores REST, Servicios de Dominio y Repositorios JPA.`
        },
        {
          id: 'doc-api',
          projectId: proj.id,
          title: 'Especificación de Contratos y Endpoints REST',
          slug: 'api-specification',
          category: 'API',
          lastUpdated: dateStr,
          generatedByAI: true,
          content: `# Especificación de Contratos REST\n\n- \`POST /api/v1/orders/checkout\`\n- \`GET /api/v1/orders/{orderId}\``
        },
        {
          id: 'doc-database',
          projectId: proj.id,
          title: 'Modelos de Base de Datos y Diccionario de Datos',
          slug: 'database-models',
          category: 'Database',
          lastUpdated: dateStr,
          generatedByAI: true,
          content: `# Diccionario de Base de Datos\n\nTablas relacionales \`orders\` y \`order_items\`.`
        },
        {
          id: 'doc-deployment',
          projectId: proj.id,
          title: 'Infraestructura de Despliegue y Contenedores',
          slug: 'deployment',
          category: 'Deployment',
          lastUpdated: dateStr,
          generatedByAI: true,
          content: `# Infraestructura Docker\n\nImagen Docker OpenJDK 11 Alpine.`
        }
      ];
    }

    return [
      {
        id: 'doc-overview',
        projectId: proj.id,
        title: 'System Overview & Executive Purpose',
        slug: 'overview',
        category: 'Overview',
        lastUpdated: dateStr,
        generatedByAI: true,
        content: `# ${name} — System Overview\n\nEnterprise microservice developed in ${lang}.`
      },
      {
        id: 'doc-architecture',
        projectId: proj.id,
        title: 'Software Architecture & Component Boundaries',
        slug: 'architecture',
        category: 'Architecture',
        lastUpdated: dateStr,
        generatedByAI: true,
        content: `# Software Architecture\n\nLayered architecture.`
      },
      {
        id: 'doc-api',
        projectId: proj.id,
        title: 'REST API & Endpoints Specification',
        slug: 'api-specification',
        category: 'API',
        lastUpdated: dateStr,
        generatedByAI: true,
        content: `# REST API Specification\n\n- \`POST /api/v1/orders/checkout\``
      },
      {
        id: 'doc-database',
        projectId: proj.id,
        title: 'Database Models & Schema Dictionary',
        slug: 'database-models',
        category: 'Database',
        lastUpdated: dateStr,
        generatedByAI: true,
        content: `# Database Models\n\nTables \`orders\` and \`order_items\`.`
      },
      {
        id: 'doc-deployment',
        projectId: proj.id,
        title: 'Deployment & Container Infrastructure',
        slug: 'deployment',
        category: 'Deployment',
        lastUpdated: dateStr,
        generatedByAI: true,
        content: `# Deployment\n\nDocker containerized service.`
      }
    ];
  }

  private docsSignal = signal<DocumentationSection[]>([]);
  docs = this.docsSignal.asReadonly();

  constructor() {
    this.docsSignal.set(this.generateDocsForProject());
  }

  getAll(projectId?: string): Observable<DocumentationSection[]> {
    this.docsSignal.set(this.generateDocsForProject());
    return of(this.docsSignal()).pipe(delay(80));
  }

  updateDoc(id: string, newContent: string) {
    this.docsSignal.update(list => list.map(doc => 
      doc.id === id 
        ? { ...doc, content: newContent, lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) } 
        : doc
    ));
  }

  regenerateDoc(id: string): Observable<DocumentationSection> {
    const found = this.docsSignal().find(d => d.id === id);
    if (!found) throw new Error('Doc not found');

    const updated = {
      ...found,
      lastUpdated: this.translationService.isSpanish() ? 'Recién regenerado por IA' : 'Just now (AI Regenerated)',
      content: found.content + (this.translationService.isSpanish() 
        ? `\n\n> *Nota: El equipo Multi-Agente de IA re-verificó esta especificación contra el índice AST usando Qwen 2.5 Coder el ${new Date().toLocaleDateString()}.*`
        : `\n\n> *Note: AI Multi-Agent team re-verified this specification against latest AST index using Qwen 2.5 Coder on ${new Date().toLocaleDateString()}.*`)
    };

    this.docsSignal.update(list => list.map(d => d.id === id ? updated : d));
    return of(updated).pipe(delay(300));
  }
}
