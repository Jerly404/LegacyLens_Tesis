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
          content: `# ${name} — System Overview

## 1. Executive Summary
The **${name}** platform is a high-performance clinical microservice engineered in **Python 3.11** leveraging **${framework}** and asynchronous PostgreSQL persistence via \`asyncpg\`. It adopts a **${arch}** designed for patient electronic health record ingestion, diagnostic telemetry, and AI-assisted clinical summarization.

## 2. Core Capabilities
- **Master Patient Index**: Structured patient registration, Medical Record Number (MRN) validation, and query acceleration.
- **Clinical Observation Ingestion**: Support for ICD-10 diagnostic codes, systolic/diastolic blood pressure, pulse, and timestamped biometric records.
- **Asynchronous Non-blocking ORM**: High-throughput database access via SQLAlchemy 2.0 async sessions avoiding event loop blockage.
- **Strict Pydantic Validation**: Compile-time and runtime payload schemas ensuring contract integrity.
- **AI-Powered Clinical Advisory**: Integration with local LLMs (Qwen 2.5 Coder) for automated risk scoring and summary generation.

## 3. Technology Stack
- **Runtime / Language**: Python 3.11 LTS (FastAPI ASGI)
- **Database**: PostgreSQL 16 with AsyncPG driver & Alembic migrations
- **ORM**: SQLAlchemy 2.0 (Declarative Base with async sessionmaker)
- **Local AI Engine**: Qwen 2.5 Coder 7B (Ollama on \`http://localhost:11434\`, NVIDIA RTX 3050 GPU with CUDA 13.3)
`
        },
        {
          id: 'doc-architecture',
          projectId: proj.id,
          title: 'Software Architecture & Component Boundaries',
          slug: 'architecture',
          category: 'Architecture',
          lastUpdated: dateStr,
          generatedByAI: true,
          content: `# Software Architecture & Layer Boundaries

## 1. Architectural Style: ${arch}
The microservice is structured into decoupled layers following strict Dependency Inversion principles:

- **Presentation Layer (\`src/api/patients_router.py\`)\**:
  FastAPI APIRouter declaring HTTP endpoints, dependency injection providers (\`get_db\`), and response serialization models.
- **Application Service Layer (\`src/services/patient_service.py\`)\**:
  Encapsulates core business rules, clinical validation, and coordination between repositories and AI services.
- **Persistence Layer (\`src/repositories/patient_repository.py\`)\**:
  Executes optimized asynchronous queries with explicit \`selectinload\` options to prevent N+1 relational query bottlenecks.
- **Domain Layer (\`src/models/\`)\**:
  Declarative SQLAlchemy models (\`Patient\`, \`ClinicalRecord\`) with foreign key constraints, indexes, and relationship cascades.

## 2. Request Lifecycle
1. HTTP client issues a request to \`POST /api/v1/patients/{patient_id}/records\`.
2. Router verifies authorization header and validates request payload against Pydantic schema.
3. Service processes clinical rules, checks patient existence, and invokes repository.
4. Repository persists entity within an async database transaction.
5. Serialized DTO is returned with HTTP 201 Created.
`
        },
        {
          id: 'doc-api',
          projectId: proj.id,
          title: 'REST API & Endpoints Specification',
          slug: 'api-specification',
          category: 'API',
          lastUpdated: dateStr,
          generatedByAI: true,
          content: `# REST API Specification

### Base URL: \`/api/v1\`
All endpoints consume and return \`application/json\` payloads.

---

## 1. Patient Registration
### \`POST /api/v1/patients/\`
Registers a new patient profile into the clinical master index.

**Request Body:**
\`\`\`json
{
  "first_name": "Eleanor",
  "last_name": "Vance",
  "date_of_birth": "1988-04-12",
  "mrn": "MRN-882190",
  "primary_contact": "+1-555-0192"
}
\`\`\`

**Response \`201 Created\`:**
\`\`\`json
{
  "id": 412,
  "mrn": "MRN-882190",
  "first_name": "Eleanor",
  "last_name": "Vance",
  "created_at": "2026-09-06T00:40:00Z"
}
\`\`\`

---

## 2. Patient Profile Lookup
### \`GET /api/v1/patients/{patient_id}\`
Retrieves a patient profile and associated clinical records summary.

**Path Parameters:**
- \`patient_id\` (integer, required): Unique patient primary key.

**Response \`200 OK\`:** Full patient entity with nested records summary.

---

## 3. Ingest Clinical Record
### \`POST /api/v1/patients/{patient_id}/records\`
Adds a new clinical observation, vital signs record, or lab finding.

**Request Body:**
\`\`\`json
{
  "diagnosis_code": "I10",
  "systolic_bp": 128,
  "diastolic_bp": 84,
  "heart_rate": 72,
  "clinical_notes": "Routine follow-up. Blood pressure within controlled parameters."
}
\`\`\`

**Response \`201 Created\`:** Persisted observation object with unique observation ID.
`
        },
        {
          id: 'doc-database',
          projectId: proj.id,
          title: 'Database Models & Schema Dictionary',
          slug: 'database-models',
          category: 'Database',
          lastUpdated: dateStr,
          generatedByAI: true,
          content: `# Database Models & Data Dictionary

## 1. Master Table: \`patients\`
Stores demographic and identification attributes for all registered individuals.

| Column | Data Type | Constraints | Description |
|---|---|---|---|
| \`id\` | INTEGER | PRIMARY KEY | Unique auto-incrementing patient ID |
| \`mrn\` | VARCHAR(64) | UNIQUE, NOT NULL | Medical Record Number |
| \`first_name\` | VARCHAR(100) | NOT NULL | Patient given name |
| \`last_name\` | VARCHAR(100) | NOT NULL | Patient family name |
| \`date_of_birth\` | DATE | NOT NULL | Date of birth |
| \`created_at\` | TIMESTAMP | NOT NULL, DEFAULT NOW() | System ingestion timestamp |

---

## 2. Relational Table: \`clinical_records\`
Stores clinical observations, vitals, and diagnostic findings.

| Column | Data Type | Constraints | Description |
|---|---|---|---|
| \`id\` | INTEGER | PRIMARY KEY | Observation identifier |
| \`patient_id\` | INTEGER | FOREIGN KEY (\`patients.id\`) | Linked patient ID (ON DELETE CASCADE) |
| \`diagnosis_code\` | VARCHAR(20) | NOT NULL | Standard ICD-10 diagnostic code |
| \`systolic_bp\` | INTEGER | NULLABLE | Systolic blood pressure (mmHg) |
| \`diastolic_bp\` | INTEGER | NULLABLE | Diastolic blood pressure (mmHg) |
| \`heart_rate\` | INTEGER | NULLABLE | Heart rate (bpm) |
| \`clinical_notes\` | TEXT | NULLABLE | Attending clinician notes |
| \`created_at\` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Measurement timestamp |
`
        },
        {
          id: 'doc-deployment',
          projectId: proj.id,
          title: 'Deployment & Container Infrastructure',
          slug: 'deployment',
          category: 'Deployment',
          lastUpdated: dateStr,
          generatedByAI: true,
          content: `# Deployment & Container Infrastructure

## 1. Dockerfile Containerization
Optimized multi-stage container build with Python 3.11-slim and Uvicorn:

\`\`\`dockerfile
FROM python:3.11-slim AS runtime
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]
\`\`\`

## 2. Local AI Inference Infrastructure
- **Engine**: Local Ollama Daemon (\`http://localhost:11434\`)
- **Active Model**: Qwen 2.5 Coder 7B
- **Hardware Acceleration**: NVIDIA GeForce RTX 3050 (4GB VRAM with CUDA 13.3)
`
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
          content: `# ${name} — Resumen del Sistema

## 1. Resumen Ejecutivo
El sistema **${name}** es un microservicio empresarial de alto rendimiento para la gestión del ciclo de vida de pedidos y comercio electrónico, desarrollado en **${lang} 11 LTS** utilizando el framework **${framework}** con persistencia relacional en **PostgreSQL 16**.

Implementa una **${arch}** (N-Tier Layered Architecture) rigurosamente desacoplada para gestionar carritos de compra, checkout transaccional, cálculo dinámico de importes de líneas de pedido y orquestación de inventario.

## 2. Capacidades Principales
- **Procesamiento Transaccional de Checkout**: Ejecución atómica de órdenes mediante la anotación \`@Transactional\`, garantizando consistencia ACID en la persistencia simultánea de la orden y sus ítems (\`OrderItem\`).
- **Cálculo Dinámico y Validación de Precios**: Computación de importes de línea (\`total = sum(unitPrice × quantity)\`) en la capa de servicios (\`OrderService\`) evitando discrepancias financieras.
- **Persistencia en Cascada JPA/Hibernate**: Mapeo relacional con \`@OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)\` que gestiona de manera automática el ciclo de vida de las entidades secundarias.
- **Abstracción Spring Data JPA**: Repositorio desacoplado \`OrderRepository\` que ofrece consultas derivadas de alto rendimiento (\`findByCustomerId\`, \`findByStatus\`).
- **Contratos REST OpenAPI**: Endpoints desacoplados bajo el prefijo \`/api/v1/orders\` con respuestas fuertemente tipadas (\`ResponseEntity<Order>\`).

## 3. Stack Tecnológico de Alto Nivel
- **Lenguaje / Runtime**: Java 11 LTS (OpenJDK 11 HotSpot Virtual Machine)
- **Framework Backend**: Spring Boot 2.7.5 (Spring MVC, Spring Data JPA, Hibernate ORM 5.6)
- **Base de Datos**: PostgreSQL 16 (Driver JDBC Oficial 42.5.0)
- **Gestor de Construcción**: Apache Maven 3.8+ (\`pom.xml\`)
- **Motor de Inteligencia Artificial Local**: Qwen 2.5 Coder 7B (Daemon Ollama en \`http://localhost:11434\`, aceleración GPU RTX 3050 con CUDA 13.3)
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
El microservicio implementa una **Arquitectura en Capas (N-Tier Layered Architecture)** donde cada componente posee una única responsabilidad bien delimitada:

- **Capa de Controladores REST (\`src/controllers/OrderController.java\`)\**:
  Expone la interfaz HTTP bajo el prefijo \`/api/v1/orders\`. Se encarga del enrutamiento de peticiones, deserialización JSON y control de respuestas mediante \`ResponseEntity\`. Implementa inyección de dependencias por constructor.
- **Capa de Servicios de Negocio (\`src/services/OrderService.java\`)\**:
  Contiene la lógica de dominio y los límites transaccionales declarativos (\`@Transactional\`). Valida las líneas de detalle, calcula el total acumulado (\`totalAmount\`), asigna el estado inicial \`PROCESSING\` y orquesta la persistencia.
- **Capa de Repositorios de Persistencia (\`src/repositories/OrderRepository.java\`)\**:
  Extiende la interfaz \`JpaRepository<Order, UUID>\` de Spring Data JPA. Provee operaciones CRUD out-of-the-box y métodos de consulta especializados: \`findByCustomerId(UUID customerId)\` y \`findByStatus(String status)\`.
- **Capa de Entidades de Dominio (\`src/models/Order.java\`, \`src/models/OrderItem.java\`)\**:
  Modelos anotados con \`@Entity\` y \`@Table\`. Definen la estructura relacional con soporte de identificadores universales únicos (\`UUID\`), tipos numéricos de alta precisión (\`BigDecimal\`) y relación de composición \`1:N\`.

## 2. Flujo de Ejecución del Proceso de Checkout
1. El cliente HTTP envía una petición \`POST /api/v1/orders/checkout\` con el payload JSON de la orden.
2. \`OrderController.createOrder()\` recibe el payload y delega la ejecución al método \`processOrderCheckout()\` de \`OrderService\`.
3. \`OrderService\` inicia una transacción física de base de datos (\`@Transactional\`), itera la colección de \`OrderItem\`, calcula el subtotal de cada ítem (\`unitPrice × quantity\`), asigna el \`totalAmount\` y fija el estado en \`"PROCESSING"\`.
4. Se invoca \`orderRepository.save(order)\`, que ejecuta en PostgreSQL la sentencia \`INSERT INTO orders\` y subsecuentemente las sentencias \`INSERT INTO order_items\` de forma transaccional gracias a \`CascadeType.ALL\`.
5. La entidad persistida con sus IDs generados se retorna envuelta en \`ResponseEntity.ok()\` con código \`200 OK\`.
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

### URL Base: \`/api/v1/orders\`
Todos los endpoints utilizan JSON (\`application/json\`) para el intercambio de datos y siguen los estándares HTTP REST.

---

## 1. Procesamiento de Checkout y Creación de Orden
### \`POST /api/v1/orders/checkout\`
Recibe una orden con su lista de productos, calcula el importe total y registra la transacción.

**Headers:**
\`\`\`http
Content-Type: application/json
Accept: application/json
\`\`\`

**Cuerpo de la Petición (Request Body):**
\`\`\`json
{
  "customerId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "items": [
    {
      "productId": "7b1c3e44-8821-4f76-905c-3f2d0a1b9c71",
      "quantity": 2,
      "unitPrice": 49.99
    },
    {
      "productId": "9d4e5f66-1234-4a5b-8c9d-0e1f2a3b4c5d",
      "quantity": 1,
      "unitPrice": 120.00
    }
  ]
}
\`\`\`

**Respuesta Exitosa \`200 OK\`:**
\`\`\`json
{
  "id": "e4f3a2b1-9c8d-4e5f-8a7b-6c5d4e3f2a10",
  "customerId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "totalAmount": 219.98,
  "status": "PROCESSING",
  "items": [
    {
      "id": "11223344-5566-7788-99aa-bbccddeeff00",
      "productId": "7b1c3e44-8821-4f76-905c-3f2d0a1b9c71",
      "quantity": 2,
      "unitPrice": 49.99
    },
    {
      "id": "aabbccdd-1122-3344-5566-778899aabbcc",
      "productId": "9d4e5f66-1234-4a5b-8c9d-0e1f2a3b4c5d",
      "quantity": 1,
      "unitPrice": 120.00
    }
  ],
  "createdAt": "2026-09-06T00:45:00"
}
\`\`\`

---

## 2. Consulta de Orden por Identificador
### \`GET /api/v1/orders/{orderId}\`
Retorna el estado y detalle completo de una orden existente.

**Parámetros de Ruta:**
- \`orderId\` (UUID, requerido): Identificador único de la orden.

**Respuesta Exitosa \`200 OK\`:** Retorna el objeto JSON de la orden con sus ítems.
**Respuesta \`404 Not Found\`:** Retorna estado vacío si la orden no existe en el sistema.

---

## 3. Historial de Órdenes por Cliente
### \`GET /api/v1/orders/customer/{customerId}\`
Consulta todas las compras realizadas por un cliente específico.

**Parámetros de Ruta:**
- \`customerId\` (UUID, requerido): Identificador del cliente comprador.

**Respuesta Exitosa \`200 OK\`:** Lista de órdenes en formato JSON (\`Array<Order>\`).
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

## 1. Tabla Maestra: \`orders\`
Almacena la cabecera de las órdenes de compra procesadas por el sistema.

| Columna | Tipo de Dato | Restricción | Descripción |
|---|---|---|---|
| \`id\` | UUID | PRIMARY KEY | Identificador único autogenerado de la orden |
| \`customer_id\` | UUID | NOT NULL | Identificador del cliente que realizó la compra |
| \`total_amount\` | NUMERIC(12,2) | NOT NULL | Monto total calculado del pedido |
| \`status\` | VARCHAR(50) | NOT NULL | Estado actual (\`PROCESSING\`, \`COMPLETED\`, \`CANCELLED\`) |
| \`created_at\` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Fecha y hora UTC de registro de la orden |

---

## 2. Tabla de Detalle: \`order_items\`
Contiene el desglose de productos individuales pertenecientes a cada orden.

| Columna | Tipo de Dato | Restricción | Descripción |
|---|---|---|---|
| \`id\` | UUID | PRIMARY KEY | Identificador único autogenerado de la línea de pedido |
| \`order_id\` | UUID | FOREIGN KEY (\`orders.id\`) | Clave foránea vinculada con borrado en cascada (ON DELETE CASCADE) |
| \`product_id\` | UUID | NOT NULL | Identificador del producto comprado |
| \`quantity\` | INTEGER | NOT NULL, CHECK (>0) | Cantidad de unidades solicitadas |
| \`unit_price\` | NUMERIC(10,2) | NOT NULL | Precio unitario congelado al momento del checkout |

---

## 3. Índices de Rendimiento Recomendados
Para soportar altos volúmenes de consultas concurrentes en producción:
\`\`\`sql
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);
\`\`\`
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

## 1. Contenedor Docker Multi-Etapa (Multi-Stage Build)
Empaquetado optimizado para producción que separa la compilación Maven del runtime ligero OpenJDK 11 Alpine:

\`\`\`dockerfile
# Etapa 1: Compilación del proyecto con Maven
FROM maven:3.8.6-openjdk-11-slim AS builder
WORKDIR /workspace
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn clean package -DskipTests -B

# Etapa 2: Imagen de ejecución ligera
FROM openjdk:11-jre-slim
WORKDIR /app
RUN addgroup --system spring && adduser --system spring --ingroup spring
USER spring:spring
COPY --from=builder /workspace/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-XX:+UseG1GC", "-XX:MaxRAMPercentage=75", "-jar", "app.jar"]
\`\`\`

---

## 2. Orquestación Multi-Servicio (\`docker-compose.yml\`)
Despliegue local completo integrando el microservicio Spring Boot con PostgreSQL 16 y Redis:

\`\`\`yaml
version: '3.8'

services:
  ecommerce-order-service:
    build: .
    ports:
      - "8080:8080"
    environment:
      - SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/ecommerce_db
      - SPRING_DATASOURCE_USERNAME=postgres
      - SPRING_DATASOURCE_PASSWORD=postgres
      - SPRING_JPA_HIBERNATE_DDL_AUTO=update
    depends_on:
      - postgres

  postgres:
    image: postgres:16-alpine
    restart: always
    environment:
      POSTGRES_DB: ecommerce_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
\`\`\`

---

## 3. Entorno de Inferencia de Inteligencia Artificial Local
- **Motor de Inferencia**: Daemon Ollama (\`http://localhost:11434\`)
- **Modelo Activo**: Qwen 2.5 Coder 7B (\`qwen2.5-coder:7b\`)
- **Aceleración por GPU**: NVIDIA GeForce RTX 3050 (4GB VRAM con CUDA 13.3)
- **Capacidades Asistidas por IA**: Auditoría automática de código, generación de diagramas Mermaid y análisis de vulnerabilidades AST.
`
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
        content: `# ${name} — System Overview

## 1. Executive Summary
The **${name}** service is an enterprise-grade order management and checkout microservice engineered in **${lang} 11 LTS** with **${framework}** and **PostgreSQL 16** relational persistence.

It implements a **${arch}** (N-Tier Layered Architecture) designed to isolate web presentation, transactional business calculations, and JPA data access.

## 2. Core Capabilities
- **Transactional Checkout Processing**: Atomic order persistence via \`@Transactional\`, ensuring ACID safety across order headers and line items.
- **Dynamic Calculation Engine**: Automated computation of total amounts based on line-level item subtotals (\`unitPrice × quantity\`).
- **JPA / Hibernate Cascade Persistence**: Relational mapping with \`@OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)\`.
- **Spring Data JPA Repositories**: High-performance query methods (\`findByCustomerId\`, \`findByStatus\`).
- **RESTful OpenAPI Standards**: Strongly-typed HTTP response entities with standard status codes.

## 3. Technology Stack
- **Runtime / Language**: Java 11 LTS (OpenJDK HotSpot VM)
- **Backend Framework**: Spring Boot 2.7.5 (Spring MVC, Spring Data JPA, Hibernate ORM)
- **Database**: PostgreSQL 16 (JDBC Driver 42.5.0)
- **Build System**: Apache Maven 3.8+ (\`pom.xml\`)
- **Local AI Engine**: Qwen 2.5 Coder 7B (Ollama on \`http://localhost:11434\`, NVIDIA RTX 3050 GPU with CUDA 13.3)
`
      },
      {
        id: 'doc-architecture',
        projectId: proj.id,
        title: 'Software Architecture & Component Boundaries',
        slug: 'architecture',
        category: 'Architecture',
        lastUpdated: dateStr,
        generatedByAI: true,
        content: `# Software Architecture & Layer Boundaries

## 1. Architectural Style: ${arch}
The microservice is structured into decoupled layers following strict Dependency Inversion principles:

- **REST Controller Layer (\`src/controllers/OrderController.java\`)\**:
  Exposes the REST API under \`/api/v1/orders\`. Handles JSON payload deserialization, routing, and HTTP response packaging with \`ResponseEntity\`.
- **Domain Service Layer (\`src/services/OrderService.java\`)\**:
  Contains business rules and transactional boundaries (\`@Transactional\`). Calculates item subtotals, sets \`PROCESSING\` status, and invokes repositories.
- **Persistence Layer (\`src/repositories/OrderRepository.java\`)\**:
  Extends Spring Data JPA's \`JpaRepository<Order, UUID>\` providing CRUD operations and derived queries.
- **Domain Model Layer (\`src/models/Order.java\`, \`src/models/OrderItem.java\`)\**:
  JPA entities mapped to relational tables with UUID keys and 1:N composition relationships.

## 2. Checkout Execution Sequence
1. Client POSTs order payload to \`/api/v1/orders/checkout\`.
2. \`OrderController\` receives payload and calls \`orderService.processOrderCheckout()\`.
3. \`OrderService\` opens database transaction, sums item amounts, updates order status.
4. \`OrderRepository.save()\` cascades the insert to PostgreSQL tables \`orders\` and \`order_items\`.
5. Persisted entity is returned with HTTP 200 OK.
`
      },
      {
        id: 'doc-api',
        projectId: proj.id,
        title: 'REST API & Endpoints Specification',
        slug: 'api-specification',
        category: 'API',
        lastUpdated: dateStr,
        generatedByAI: true,
        content: `# REST API Specification

### Base URL: \`/api/v1/orders\`
JSON format is used for all payloads.

---

## 1. Order Checkout
### \`POST /api/v1/orders/checkout\`
Processes and places a new customer order.

**Request Body:**
\`\`\`json
{
  "customerId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "items": [
    {
      "productId": "7b1c3e44-8821-4f76-905c-3f2d0a1b9c71",
      "quantity": 2,
      "unitPrice": 49.99
    }
  ]
}
\`\`\`

**Response \`200 OK\`:**
\`\`\`json
{
  "id": "e4f3a2b1-9c8d-4e5f-8a7b-6c5d4e3f2a10",
  "customerId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "totalAmount": 99.98,
  "status": "PROCESSING",
  "items": [
    {
      "id": "11223344-5566-7788-99aa-bbccddeeff00",
      "productId": "7b1c3e44-8821-4f76-905c-3f2d0a1b9c71",
      "quantity": 2,
      "unitPrice": 49.99
    }
  ],
  "createdAt": "2026-09-06T00:45:00"
}
\`\`\`

---

## 2. Order Lookup by ID
### \`GET /api/v1/orders/{orderId}\`
Retrieves full details of a specific order.

---

## 3. Customer Order History
### \`GET /api/v1/orders/customer/{customerId}\`
Returns all orders placed by a specific customer.
`
      },
      {
        id: 'doc-database',
        projectId: proj.id,
        title: 'Database Models & Schema Dictionary',
        slug: 'database-models',
        category: 'Database',
        lastUpdated: dateStr,
        generatedByAI: true,
        content: `# Database Models & Schema Dictionary

## 1. Master Table: \`orders\`
| Column | Data Type | Constraints | Description |
|---|---|---|---|
| \`id\` | UUID | PRIMARY KEY | Unique order ID |
| \`customer_id\` | UUID | NOT NULL | Customer identifier |
| \`total_amount\` | NUMERIC(12,2) | NOT NULL | Calculated total order amount |
| \`status\` | VARCHAR(50) | NOT NULL | Order lifecycle status |
| \`created_at\` | TIMESTAMP | DEFAULT NOW() | Ingestion timestamp |

---

## 2. Line Items Table: \`order_items\`
| Column | Data Type | Constraints | Description |
|---|---|---|---|
| \`id\` | UUID | PRIMARY KEY | Unique item ID |
| \`order_id\` | UUID | FOREIGN KEY (\`orders.id\`) | Order parent foreign key |
| \`productId\` | UUID | NOT NULL | Catalog product ID |
| \`quantity\` | INTEGER | NOT NULL | Units purchased |
| \`unit_price\` | NUMERIC(10,2) | NOT NULL | Unit price at checkout |
`
      },
      {
        id: 'doc-deployment',
        projectId: proj.id,
        title: 'Deployment & Container Infrastructure',
        slug: 'deployment',
        category: 'Deployment',
        lastUpdated: dateStr,
        generatedByAI: true,
        content: `# Deployment & Container Infrastructure

## 1. Multi-Stage Dockerfile
Container build separating Maven build and OpenJDK 11 Alpine runtime:

\`\`\`dockerfile
FROM maven:3.8.6-openjdk-11-slim AS builder
WORKDIR /workspace
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn clean package -DskipTests

FROM openjdk:11-jre-slim
WORKDIR /app
COPY --from=builder /workspace/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
\`\`\`

## 2. Local AI Infrastructure
- **Engine**: Local Ollama Daemon (\`http://localhost:11434\`)
- **Model**: Qwen 2.5 Coder 7B
- **Acceleration**: NVIDIA GeForce RTX 3050 (4GB VRAM with CUDA 13.3)
`
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
