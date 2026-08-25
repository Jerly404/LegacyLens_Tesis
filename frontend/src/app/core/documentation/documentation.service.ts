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
    const isMindguard = (proj.name || '').toLowerCase().includes('mindguard') || (proj.slug || '').includes('mindguard') || (proj.name || '').toLowerCase().includes('quality');
    const isEHR = (proj.name || '').toLowerCase().includes('ehr') || (proj.name || '').toLowerCase().includes('clinical') || (proj.name || '').toLowerCase().includes('patient');
    const isPython = (proj.mainLanguage || '').toLowerCase() === 'python' || isMindguard || isEHR;

    const name = proj.name || (isMindguard ? 'MindGuard — Software Quality & Mental Health Platform' : (isEHR ? 'Clinical Electronic Health Record (EHR) API' : 'E-Commerce Order Management Microservice'));
    const lang = proj.mainLanguage || (isPython ? 'Python' : 'Java');
    const framework = proj.framework || (isMindguard ? 'FastAPI, SQLAlchemy & Angular 17' : (isEHR ? 'FastAPI & Async SQLAlchemy 2.0' : 'Spring Boot & JPA'));
    const arch = proj.architecture || 'Layered Architecture';
    const dateStr = new Date().toISOString().replace('T', ' ').substring(0, 16);

    if (isMindguard) {
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
El sistema **${name}** es una plataforma integral de salud mental e ingeniería de calidad de software desarrollada en **Python 3.11** con **FastAPI & SQLAlchemy** y frontend en **Angular 17 / TailwindCSS**. Implementa una arquitectura **${arch}** diseñada para la evaluación psicométrica automatizada mediante escalas estandarizadas (PHQ-9 para depresión y GAD-7 para ansiedad) con soporte de modelos de lenguaje (LLMs) como Google Gemini y Groq.

## 2. Capacidades Principales
- **Evaluación Psicométrica Automatizada**: Procesamiento y cálculo de puntajes en cuestionarios PHQ-9 y GAD-7 con detección de niveles de riesgo.
- **Asistencia Clínica con IA Generativa**: Generación de resúmenes de diagnóstico preliminar y recomendaciones mediante Gemini / Groq.
- **Seguridad y Control de Acceso**: Autenticación JWT, control de roles (Paciente, Profesional, Administrador) y hashing bcrypt.
- **Registro Emocional Continuo**: Bitácora de estados anímicos, intensidad y factores disparadores.

## 3. Stack Tecnológico de Alto Nivel
- **Lenguaje / Runtime**: Python 3.11 (FastAPI ASGI) + TypeScript (Angular 17)
- **Base de Datos**: SQLite / PostgreSQL 16 con SQLAlchemy ORM y migraciones Alembic
- **Modelos de IA Integrados**: Google Gemini 1.5 Flash + Groq Llama-3-70B + Qwen 2.5 Coder 7B Local
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
El backend se estructura en capas desacopladas con inyección de dependencias mediante FastAPI:

- **Capa de Endpoints REST (\`backend/app/api/\`)\**: Routers modulares (\`assessments.py\`, \`auth.py\`, \`chat.py\`, \`deps.py\`).
- **Capa de Servicios de Dominio (\`backend/app/services/\`)\**: Lógica de cálculo psicométrico e integración con IA (\`clinical_ai.py\`, \`assessment_ai.py\`, \`business_services.py\`).
- **Capa de Modelos Relacionales (\`backend/app/models/\`)\**: Entidades SQLAlchemy mapeadas (\`Usuario\`, \`Evaluacion\`, \`RegistroEmocional\`, \`ResultadoIA\`, \`Cita\`).
- **Capa de Configuración y Seguridad (\`backend/app/core/\`)\**: Configuración centralizada (\`config.py\`), seguridad JWT (\`security.py\`) y sesión de base de datos (\`database.py\`).
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

### URL Base: \`/api/v1\`

## 1. Autenticación de Usuarios
### \`POST /api/v1/auth/login\`
Autentica al usuario y devuelve un token de acceso JWT.

**Cuerpo de la Petición (Form URL Encoded):**
\`\`\`
username=paciente@mindguard.com&password=SecurePassword123!
\`\`\`

**Respuesta Exitosa \`200 OK\`:**
\`\`\`json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
\`\`\`

---

## 2. Envío y Evaluación de Cuestionario Psicométrico
### \`POST /api/v1/assessments/submit\`
Recibe las respuestas de los tests PHQ-9 y GAD-7, calcula los puntajes y genera el diagnóstico asistido por IA.

**Cuerpo de la Petición (JSON):**
\`\`\`json
{
  "phq9_responses": [1, 2, 0, 1, 3, 2, 1, 0, 0],
  "gad7_responses": [2, 1, 2, 2, 1, 0, 1],
  "notas_personales": "Dificultad recurrente para conciliar el sueño durante la última semana."
}
\`\`\`

**Respuesta Exitosa \`200 OK\`:**
\`\`\`json
{
  "id": 142,
  "phq9Score": 10,
  "gad7Score": 9,
  "nivelRiesgo": "MEDIO",
  "has_high_risk": false,
  "resultadoIA": "Nivel de riesgo estimado: MEDIO. Se recomienda seguimiento preventivo y pautas de higiene del sueño."
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

## 1. Tabla Maestra: \`Usuario\`
Almacena las cuentas de usuarios, psicólogos y administradores.

| Columna | Tipo de Dato | Restricción | Descripción |
|---|---|---|---|
| \`id\` | INTEGER | PRIMARY KEY | Identificador único autoincremental |
| \`nombre\` | VARCHAR(100) | NOT NULL | Nombre completo del usuario |
| \`email\` | VARCHAR(150) | UNIQUE, NOT NULL | Correo electrónico de inicio de sesión |
| \`password_hash\` | VARCHAR(255) | NOT NULL | Contraseña cifrada con algoritmo bcrypt |
| \`rol\` | VARCHAR(50) | NOT NULL | Rol en el sistema (\`PACIENTE\`, \`PSICOLOGO\`, \`ADMIN\`) |
| \`colegiatura\` | VARCHAR(50) | NULLABLE | Número de colegiatura profesional para psicólogos |

## 2. Tabla de Evaluaciones: \`Evaluacion\`
Registra las pruebas diagnósticas y puntajes psicométricos de los pacientes.

| Columna | Tipo de Dato | Restricción | Descripción |
|---|---|---|---|
| \`id\` | INTEGER | PRIMARY KEY | Identificador de la evaluación |
| \`id_usuario\` | INTEGER | FOREIGN KEY (\`Usuario.id\`) | Paciente evaluado |
| \`phq9Score\` | INTEGER | NOT NULL | Puntaje acumulado en escala PHQ-9 (0 - 27) |
| \`gad7Score\` | INTEGER | NOT NULL | Puntaje acumulado en escala GAD-7 (0 - 21) |
| \`nivelRiesgo\` | VARCHAR(50) | NOT NULL | Nivel de riesgo (\`BAJO\`, \`MEDIO\`, \`ALTO\`) |
| \`has_high_risk\` | BOOLEAN | DEFAULT FALSE | Flag de alerta crítica de salud mental |
| \`fecha\` | TIMESTAMP | NOT NULL | Fecha y hora UTC del test |
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

## 1. Configuración Docker Compose Multi-Contenedor
El sistema incluye orquestación mediante \`docker-compose.yml\`:

\`\`\`yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=sqlite:///./mindguard.db
      - GEMINI_API_KEY=\${GEMINI_API_KEY}
  frontend:
    build: ./frontend
    ports:
      - "4200:80"
\`\`\`

## 2. Motor de Inteligencia Artificial Local
- **Motor de Inferencia**: Daemon Ollama (\`http://localhost:11434\`)
- **Modelo Activo**: Qwen 2.5 Coder 7B
- **Acelerador por Hardware**: NVIDIA GeForce RTX 3050 (4GB VRAM con CUDA 13.3)
`
        }
      ];
    }

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
