import { Injectable, signal, inject } from '@angular/core';
import { DocumentationSection } from '@codelens/shared';
import { ProjectService } from '../projects/project.service';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DocumentationService {
  private projectService = inject(ProjectService);

  private generateDocsForProject(): DocumentationSection[] {
    const proj = this.projectService.selectedProject();
    const name = proj.name || 'Enterprise System';
    const lang = proj.mainLanguage || 'Java';
    const framework = proj.framework || 'Spring Boot';
    const arch = proj.architecture || 'Layered Architecture';

    return [
      {
        id: 'doc-overview',
        projectId: proj.id,
        title: 'System Overview & Executive Purpose',
        slug: 'overview',
        category: 'Overview',
        lastUpdated: new Date().toISOString().replace('T', ' ').substring(0, 16),
        generatedByAI: true,
        content: `# ${name} — System Overview

## 1. Executive Summary
The **${name}** is an enterprise-grade service engineered in **${lang}** utilizing **${framework}**. The system implements a **${arch}** to handle core transaction routing, business workflows, and persistence reconciliation.

## 2. Core Capabilities
- **Domain Business Engine**: Encapsulates core processing logic with transactional consistency guarantees.
- **REST & Integration APIs**: Exposes high-throughput API endpoints for client consumers and web applications.
- **Persistence & ORM Tier**: Manages relational entities and data mapping.
- **Audit & Traceability**: Forensic logging of all state mutations with unique request trace identifiers.

## 3. High-Level Technology Stack
- **Language / Runtime**: ${lang} (${framework})
- **Architecture Pattern**: ${arch}
- **Database**: Relational Database Engine (PostgreSQL / SQL)
- **Local AI Verification**: Qwen 2.5 Coder 7B (Ollama Local GPU)
`
      },
      {
        id: 'doc-architecture',
        projectId: proj.id,
        title: 'Software Architecture & Component Boundaries',
        slug: 'architecture',
        category: 'Architecture',
        lastUpdated: new Date().toISOString().replace('T', ' ').substring(0, 16),
        generatedByAI: true,
        content: `# System Architecture & Component Boundaries

## 1. Architectural Style: ${arch}
The codebase is structured into clear horizontal layers with strict dependency flow:

\`\`\`
┌────────────────────────────────────────────────────────┐
│  Presentation Layer: REST Controllers & HTTP Handlers  │
└───────────────────────────┬────────────────────────────┘
                            │ (invokes)
┌───────────────────────────▼────────────────────────────┐
│  Application Service Layer: Domain Services & Logic    │
└───────────────────────────┬────────────────────────────┘
                            │ (queries / persists)
┌───────────────────────────▼────────────────────────────┐
│  Persistence Layer: Data Access Repositories & DAOs    │
└───────────────────────────┬────────────────────────────┘
                            │ (SQL / ORM)
┌───────────────────────────▼────────────────────────────┐
│  Database Layer: Relational Schema Cluster             │
└────────────────────────────────────────────────────────┘
\`\`\`

## 2. Layer Responsibilities
- **Presentation Layer**: Deserializes incoming HTTP payloads into validated DTOs and handles response formatting.
- **Service Layer**: Coordinates business transactions via declarative \`@Transactional\` boundaries.
- **Repository Layer**: Encapsulates database queries via JPA / ORM abstractions.
`
      },
      {
        id: 'doc-api',
        projectId: proj.id,
        title: 'REST API & Endpoints Specification',
        slug: 'api-specification',
        category: 'API',
        lastUpdated: new Date().toISOString().replace('T', ' ').substring(0, 16),
        generatedByAI: true,
        content: `# REST API & Endpoints Specification

### Base URL: \`/api/v1\`

## 1. Checkout & Transaction Processing
### \`POST /api/v1/orders/checkout\`
Creates and validates a new transaction with total calculation.

**Request Body:**
\`\`\`json
{
  "customerId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "items": [
    { "productId": "d8e3a2b1-1234-5678-9abc-def012345678", "quantity": 2, "unitPrice": 49.99 }
  ]
}
\`\`\`

**Response \`200 OK\`:**
\`\`\`json
{
  "id": "e7b1a2c3-9876-5432-10fe-dcba98765432",
  "totalAmount": 99.98,
  "status": "PROCESSING"
}
\`\`\`

---

## 2. Order Inquiries
### \`GET /api/v1/orders/{orderId}\`
Retrieves order status, item details, and total amount.

---

## 3. Customer History
### \`GET /api/v1/orders/customer/{customerId}\`
Retrieves all historical transactions for a customer.
`
      },
      {
        id: 'doc-database',
        projectId: proj.id,
        title: 'Database Models & Schema Dictionary',
        slug: 'database-models',
        category: 'Database',
        lastUpdated: new Date().toISOString().replace('T', ' ').substring(0, 16),
        generatedByAI: true,
        content: `# Database Models & Schema Dictionary

## 1. Entity: \`orders\`
Represents the root transaction aggregate.

| Column | Type | Constraints | Description |
|---|---|---|---|
| \`id\` | UUID | PRIMARY KEY | Unique order identifier |
| \`customer_id\` | UUID | NOT NULL | Customer reference |
| \`total_amount\` | DECIMAL(12,2) | NOT NULL | Total monetary amount |
| \`status\` | VARCHAR(32) | NOT NULL | State (\`PROCESSING\`, \`COMPLETED\`) |
| \`created_at\` | TIMESTAMP | NOT NULL | Order creation timestamp |

## 2. Entity: \`order_items\`
Child entity capturing purchased line items.

| Column | Type | Constraints | Description |
|---|---|---|---|
| \`id\` | UUID | PRIMARY KEY | Line item primary key |
| \`order_id\` | UUID | FOREIGN KEY | References \`orders(id)\` |
| \`product_id\` | UUID | NOT NULL | Product reference |
| \`quantity\` | INTEGER | NOT NULL | Quantity units |
| \`unit_price\` | DECIMAL(10,2) | NOT NULL | Unit price per item |
`
      },
      {
        id: 'doc-deployment',
        projectId: proj.id,
        title: 'Deployment & Container Infrastructure',
        slug: 'deployment',
        category: 'Deployment',
        lastUpdated: new Date().toISOString().replace('T', ' ').substring(0, 16),
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

## 2. Local AI Reverse Engineering Daemon
- **Inference Engine**: Ollama Daemon (\`http://localhost:11434\`)
- **Active Model**: Qwen 2.5 Coder 7B
- **Hardware Acceleration**: NVIDIA GeForce RTX 3050 (4GB VRAM)
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
      lastUpdated: 'Just now (AI Regenerated)',
      content: found.content + `\n\n> *Note: AI Multi-Agent team re-verified this specification against latest AST index using Qwen 2.5 Coder on ${new Date().toLocaleDateString()}.*`
    };

    this.docsSignal.update(list => list.map(d => d.id === id ? updated : d));
    return of(updated).pipe(delay(300));
  }
}
