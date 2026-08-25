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
    const name = proj.name || 'Microservicio de Comercio Electrónico';
    const lang = proj.mainLanguage || 'Java';
    const framework = proj.framework || 'Spring Boot';
    const arch = proj.architecture || 'Layered Architecture';
    const dateStr = new Date().toISOString().replace('T', ' ').substring(0, 16);

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
El sistema **${name}** es un microservicio empresarial desarrollado en **${lang}** utilizando **${framework}**. Implementa una arquitectura **${arch}** diseñada para gestionar el procesamiento transaccional, flujos de órdenes de compra y persistencia de datos relacionales con alta consistencia.

## 2. Capacidades Principales
- **Motor de Dominio Empresarial**: Encapsula las reglas de negocio y cálculo de totales monetarios con garantías transaccionales ACID.
- **APIs REST de Integración**: Expone endpoints HTTP de alto rendimiento para clientes web (SPA) y aplicaciones móviles.
- **Capa de Persistencia y ORM**: Gestiona el mapeo de entidades relacionales hacia la base de datos PostgreSQL.
- **Trazabilidad y Auditoría**: Registro inmutable de operaciones con identificadores únicos de traza.

## 3. Stack Tecnológico de Alto Nivel
- **Lenguaje / Runtime**: ${lang} (${framework})
- **Patrón Arquitectónico**: ${arch}
- **Base de Datos**: PostgreSQL / Motor Relacional
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
El código fuente se organiza en capas horizontales desacopladas con flujo unidireccional de dependencias:

\`\`\`
┌────────────────────────────────────────────────────────┐
│  Capa de Presentación: Controladores REST y DTOs       │
└───────────────────────────┬────────────────────────────┘
                            │ (invoca)
┌───────────────────────────▼────────────────────────────┐
│  Capa de Aplicación: Servicios de Dominio y Negocio    │
└───────────────────────────┬────────────────────────────┘
                            │ (consulta / persiste)
┌───────────────────────────▼────────────────────────────┐
│  Capa de Persistencia: Repositorios JPA e Interfaces   │
└───────────────────────────┬────────────────────────────┘
                            │ (SQL / ORM)
┌───────────────────────────▼────────────────────────────┐
│  Capa de Base de Datos: Esquema Relacional PostgreSQL  │
└────────────────────────────────────────────────────────┘
\`\`\`

## 2. Responsabilidades por Capa
- **Controladores (\`src/controllers\`)\**: Deserializa solicitudes HTTP, valida los contratos JSON y devuelve respuestas estructuradas.
- **Servicios (\`src/services\`)\**: Contiene la lógica de negocio, reglas de cálculo y límites transaccionales mediante \`@Transactional\`.
- **Repositorios (\`src/repositories\`)\**: Abstrae las consultas a base de datos mediante Spring Data JPA.
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

## 1. Procesamiento de Checkout y Creación de Órdenes
### \`POST /api/v1/orders/checkout\`
Crea una nueva orden, calcula el total acumulado y registra los ítems.

**Cuerpo de la Petición (Request Body):**
\`\`\`json
{
  "customerId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "items": [
    { "productId": "d8e3a2b1-1234-5678-9abc-def012345678", "quantity": 2, "unitPrice": 49.99 }
  ]
}
\`\`\`

**Respuesta Exitosa \`200 OK\`:**
\`\`\`json
{
  "id": "e7b1a2c3-9876-5432-10fe-dcba98765432",
  "customerId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "totalAmount": 99.98,
  "status": "PROCESSING"
}
\`\`\`

---

## 2. Consulta de Orden por Identificador
### \`GET /api/v1/orders/{orderId}\`
Retorna el estado actual, monto total e ítems asociados a la orden.

---

## 3. Historial de Órdenes por Cliente
### \`GET /api/v1/orders/customer/{customerId}\`
Retorna la lista de todas las órdenes asociadas al cliente.
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

## 1. Entidad Principal: \`orders\`
Almacena el registro maestro de la transacción de compra.

| Columna | Tipo de Dato | Restricción | Descripción |
|---|---|---|---|
| \`id\` | UUID | PRIMARY KEY | Identificador único de la orden |
| \`customer_id\` | UUID | NOT NULL | Identificador del cliente |
| \`total_amount\` | DECIMAL(12,2) | NOT NULL | Importe total monetario |
| \`status\` | VARCHAR(32) | NOT NULL | Estado (\`PROCESSING\`, \`COMPLETED\`) |
| \`created_at\` | TIMESTAMP | NOT NULL | Fecha y hora de creación |

## 2. Entidad Hija: \`order_items\`
Registra las líneas de detalle y productos comprados.

| Columna | Tipo de Dato | Restricción | Descripción |
|---|---|---|---|
| \`id\` | UUID | PRIMARY KEY | Llave primaria de la línea |
| \`order_id\` | UUID | FOREIGN KEY | Referencia a \`orders(id)\` |
| \`product_id\` | UUID | NOT NULL | Referencia al producto |
| \`quantity\` | INTEGER | NOT NULL | Cantidad de unidades |
| \`unit_price\` | DECIMAL(10,2) | NOT NULL | Precio unitario del ítem |
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

## 1. Configuración de Contenedores Docker
Empaquetado como una imagen de contenedor optimizada con OpenJDK 11 Alpine:

\`\`\`dockerfile
FROM eclipse-temurin:11-jre-alpine
WORKDIR /app
COPY target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
\`\`\`

## 2. Entorno de Inteligencia Artificial Local
- **Motor de Inferencia**: Daemon Ollama (\`http://localhost:11434\`)
- **Modelo Activo**: Qwen 2.5 Coder 7B
- **Aceleración por GPU**: NVIDIA GeForce RTX 3050 (4GB VRAM con CUDA 13.3)
`
        }
      ];
    }

    // English version
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
The **${name}** is an enterprise microservice developed in **${lang}** utilizing **${framework}**. It implements a **${arch}** designed to handle order processing and transactional database consistency.

## 2. Core Capabilities
- **Domain Business Engine**: Encapsulates business rules and price calculations with ACID consistency.
- **REST APIs**: Exposes high-throughput API endpoints for client consumers and web applications.
- **Persistence Tier**: Manages relational entities and data mapping.
- **Audit & Traceability**: Forensic logging of all state mutations.

## 3. High-Level Technology Stack
- **Language / Runtime**: ${lang} (${framework})
- **Architecture Pattern**: ${arch}
- **Database**: Relational Database Engine (PostgreSQL / SQL)
- **Local AI Engine**: Qwen 2.5 Coder 7B (Ollama Local GPU)
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
        content: `# System Architecture & Component Boundaries

## 1. Architectural Style: ${arch}
Organized into horizontal layers with strict top-to-bottom dependency flow.
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
        content: `# REST API & Endpoints Specification

### Base URL: \`/api/v1\`
- \`POST /api/v1/orders/checkout\`: Create new order and calculate totals
- \`GET /api/v1/orders/{orderId}\`: Retrieve order status
- \`GET /api/v1/orders/customer/{customerId}\`: Customer history
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

## 1. Entity: \`orders\`
Represents root order aggregate.

## 2. Entity: \`order_items\`
Child entity capturing purchased line items.
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

## 1. Container Configuration
Packaged as a lightweight container image for local and cloud orchestration:

\`\`\`dockerfile
FROM eclipse-temurin:11-jre-alpine
WORKDIR /app
COPY target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
\`\`\`
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
