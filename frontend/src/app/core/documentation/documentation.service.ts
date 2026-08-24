import { Injectable, signal } from '@angular/core';
import { DocumentationSection } from '@codelens/shared';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DocumentationService {
  private initialDocs: DocumentationSection[] = [
    {
      id: 'doc-overview',
      projectId: 'proj-banking-core',
      title: 'System Overview & Executive Purpose',
      slug: 'overview',
      category: 'Overview',
      lastUpdated: '2026-08-24 15:30',
      generatedByAI: true,
      content: `# Legacy Banking Transaction Core — System Overview

## 1. Executive Summary
The **Legacy Banking Transaction Core** is an enterprise-grade financial ledger engine originally deployed in 2017. It manages customer account states, currency ledgers, double-entry transactional settlements, and inter-bank clearing interfaces.

## 2. Core Capabilities
- **Account Ledgering**: Multi-currency account balance reconciliation with ACID transactional consistency.
- **Transaction Settlement**: Real-time fund transfers, scheduled recurring payments, and reverse reconciliations.
- **Legacy Interoperability**: Integrates with legacy mainframe via IBM MQ message queues and legacy SOAP web services.
- **Compliance & Audit Trail**: Immutable logging of all debit/credit operations with forensic trace identifiers.

## 3. High-Level Technology Stack
- **Runtime**: Java 11 (LTS) on Spring Boot 2.1.8.RELEASE
- **Persistence**: Spring Data JPA, Hibernate 5.4, Oracle 19c Enterprise Database
- **Messaging**: IBM MQ 9.2 (JMS Client)
- **Security**: Spring Security 5.1 with customized JWT bearer filters and LDAP bridge
`
    },
    {
      id: 'doc-architecture',
      projectId: 'proj-banking-core',
      title: 'Software Architecture & Component Boundaries',
      slug: 'architecture',
      category: 'Architecture',
      lastUpdated: '2026-08-24 15:32',
      generatedByAI: true,
      content: `# System Architecture & Component Boundaries

## 1. Architectural Style: Layered (N-Tier)
The system adopts an N-Tier architecture organized into horizontal layers with strict top-to-bottom dependency flow.

\`\`\`
┌────────────────────────────────────────────────────────┐
│  Presentation Layer: Spring REST Controllers & DTOs    │
└───────────────────────────┬────────────────────────────┘
                            │ (invokes)
┌───────────────────────────▼────────────────────────────┐
│  Application Service Layer: Transaction & Auth Services │
└───────────────────────────┬────────────────────────────┘
                            │ (queries / persists)
┌───────────────────────────▼────────────────────────────┐
│  Persistence Layer: Spring Data JPA & Oracle DAOs      │
└───────────────────────────┬────────────────────────────┘
                            │ (JDBC)
┌───────────────────────────▼────────────────────────────┐
│  Database Layer: Oracle 19c (FINCORE Schema)           │
└────────────────────────────────────────────────────────┘
\`\`\`

## 2. Layer Responsibilities
- **Presentation Layer (\`src/controllers\`)\**: Handles HTTP protocol concerns, deserializes request bodies into validated DTOs, and translates domain exceptions into standard HTTP error responses.
- **Service Layer (\`src/services\`)\**: Encapsulates business logic, coordinates database transactions via \`@Transactional\`, and validates domain rules.
- **Persistence Layer (\`src/repositories\`)\**: Encapsulates database queries via JPA and custom DAO implementations.
`
    },
    {
      id: 'doc-api',
      projectId: 'proj-banking-core',
      title: 'REST API & Endpoints Specification',
      slug: 'api-specification',
      category: 'API',
      lastUpdated: '2026-08-24 15:35',
      generatedByAI: true,
      content: `# REST API & Endpoints Specification

### Base URL: \`/api/v1\`

## 1. Authentication
### \`POST /api/v1/auth/login\`
Authenticates user credentials and returns JWT bearer token.

**Request Body:**
\`\`\`json
{
  "username": "johndoe",
  "password": "secretPassword123"
}
\`\`\`

**Response \`200 OK\`:**
\`\`\`json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "johndoe",
  "status": "ACTIVE"
}
\`\`\`

---

## 2. Account Inquiries
### \`GET /api/v1/accounts/{accountNumber}\`
Retrieves account metadata, status, and associated holder ID.

**Headers:** \`Authorization: Bearer <token>\`

---

## 3. Funds Transfer
### \`POST /api/v1/transactions/transfer\`
Executes an immediate balance transfer between two accounts with ledger locking.

**Request Body:**
\`\`\`json
{
  "sourceAccount": "ACC-00192834",
  "targetAccount": "ACC-00481920",
  "amount": 1500.00,
  "currency": "USD",
  "memo": "Vendor Invoice #4812"
}
\`\`\`
`
    },
    {
      id: 'doc-database',
      projectId: 'proj-banking-core',
      title: 'Database Models & Schema Dictionary',
      slug: 'database-models',
      category: 'Database',
      lastUpdated: '2026-08-24 15:38',
      generatedByAI: true,
      content: `# Database Schema & Entity Dictionary

## 1. Core Tables
### \`USERS\`
| Column | Type | Constraints | Description |
|---|---|---|---|
| \`USER_ID\` | VARCHAR2(36) | PRIMARY KEY | UUID identifier |
| \`USERNAME\` | VARCHAR2(64) | UNIQUE, NOT NULL | Login username |
| \`PASSWORD_HASH\` | VARCHAR2(128) | NOT NULL | Legacy salted SHA-1 hash |
| \`IS_ACTIVE\` | NUMBER(1) | DEFAULT 1 | 1=Active, 0=Disabled |

### \`ACCOUNTS\`
| Column | Type | Constraints | Description |
|---|---|---|---|
| \`ACCOUNT_NUMBER\` | VARCHAR2(20) | PRIMARY KEY | Formatted account number |
| \`USER_ID\` | VARCHAR2(36) | FOREIGN KEY (\`USERS\`) | Account owner |
| \`BALANCE\` | NUMBER(18,2) | NOT NULL | Available balance in base currency |
| \`CURRENCY\` | VARCHAR2(3) | NOT NULL | ISO 4217 Currency code |
| \`STATUS\` | VARCHAR2(16) | NOT NULL | ACTIVE, FROZEN, CLOSED |
`
    },
    {
      id: 'doc-modules',
      projectId: 'proj-banking-core',
      title: 'Core Business Modules & Logic Flows',
      slug: 'core-modules',
      category: 'Modules',
      lastUpdated: '2026-08-24 15:40',
      generatedByAI: true,
      content: `# Core Business Modules & Logic Flows

## 1. Double-Entry Transfer Pipeline
The \`TransactionService.processTransfer\` method enforces financial integrity through the following sequence:

1. **Pessimistic Locking**: Queries the source account row with \`SELECT ... FOR UPDATE\` to prevent race conditions during concurrent withdrawal attempts.
2. **Balance Check**: Ensures \`sourceAccount.balance >= requestedAmount + fee\`.
3. **Fraud Engine Verification**: Calls external scoring service via HTTP REST endpoint (\`FraudEngineClient\`).
4. **Ledger Posting**: Generates two ledger entries:
   - Debit \`sourceAccount\`
   - Credit \`targetAccount\`
5. **Event Emission**: Dispatches JMS message to IBM MQ topic \`FINCORE.TX.PROCESSED\` for downstream downstream reporting.
`
    },
    {
      id: 'doc-deployment',
      projectId: 'proj-banking-core',
      title: 'Deployment & Container Infrastructure',
      slug: 'deployment-devops',
      category: 'Deployment',
      lastUpdated: '2026-08-24 15:42',
      generatedByAI: true,
      content: `# Deployment & Container Infrastructure

## 1. Container Build
The project builds as an executable Spring Boot JAR packaged inside an OpenJDK 11 Alpine container image.

\`\`\`dockerfile
FROM eclipse-temurin:11-jre-alpine
VOLUME /tmp
COPY target/banking-transaction-core-2.4.1-RELEASE.jar app.jar
ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-jar","/app.jar"]
\`\`\`

## 2. Environment Configuration
- \`SPRING_PROFILES_ACTIVE\`: \`prod\` | \`staging\` | \`dev\`
- \`ORACLE_JDBC_URL\`: Connection string to Oracle 19c RAC cluster
- \`IBM_MQ_HOST\`: Hostname for message broker
`
    }
  ];

  private docsSignal = signal<DocumentationSection[]>(this.initialDocs);
  docs = this.docsSignal.asReadonly();

  getAll(projectId = 'proj-banking-core'): Observable<DocumentationSection[]> {
    return of(this.docsSignal()).pipe(delay(150));
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
      content: found.content + `\n\n> *Note: AI DeepSeek Coder re-verified this specification against latest AST index on ${new Date().toLocaleDateString()}.*`
    };

    this.docsSignal.update(list => list.map(d => d.id === id ? updated : d));
    return of(updated).pipe(delay(500));
  }
}
