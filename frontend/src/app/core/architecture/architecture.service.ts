import { Injectable } from '@angular/core';
import { ArchitectureAnalysis, AIRecommendation } from '@codelens/shared';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ArchitectureService {
  private mockArchitecture: Record<string, ArchitectureAnalysis> = {
    'proj-banking-core': {
      id: 'arch-banking-1',
      projectId: 'proj-banking-core',
      type: 'Layered',
      confidence: 94,
      summary: 'Strict N-Tier Layered Architecture with MVC Presentation and Database DAO persistence layers.',
      explanation: 'The legacy codebase follows a classic Spring 4-layer architecture (Controllers -> Application Services -> DAO/Repositories -> Oracle DB). However, architectural erosion is evident: 32% of business logic directly executes native PL/SQL stored procedures, bypassing domain entities. Database transaction boundaries are mixed across both controller and service tiers.',
      evidence: [
        {
          title: 'Layered Separation of Concerns',
          description: 'Distinct directory structures and annotations (@RestController, @Service, @Repository) enforce request and persistence boundaries.',
          files: ['src/controllers/AuthController.java', 'src/services/AuthService.java', 'src/repositories/UserRepository.java'],
          confidence: 96
        },
        {
          title: 'Data Access Object (DAO) Pattern',
          description: 'Repository interfaces extend Spring Data JpaRepository with custom Hibernate criteria queries.',
          files: ['src/repositories/AccountRepository.java', 'src/repositories/UserRepository.java'],
          confidence: 92
        },
        {
          title: 'Architectural Erosion & Database Leakage',
          description: 'TransactionService contains direct SQL native calls and PL/SQL invocation hooks that tightly couple domain to Oracle DB dialect.',
          files: ['src/services/TransactionService.java', 'src/services/LedgerDAO.java'],
          confidence: 89
        }
      ],
      components: [
        {
          name: 'Presentation Tier (REST API)',
          type: 'API Controllers',
          role: 'HTTP Request Handling & DTO mapping',
          responsibilities: ['Validate incoming JSON payloads', 'Issue JWT auth tokens', 'Serialize response models'],
          filePatterns: ['src/controllers/*.java'],
          layer: 'Presentation'
        },
        {
          name: 'Business Core (Application Services)',
          type: 'Service Layer',
          role: 'Domain rules and transaction coordination',
          responsibilities: ['Execute double-entry ledger balance updates', 'Enforce user ACL permissions', 'Trigger audit logs'],
          filePatterns: ['src/services/*.java'],
          layer: 'Business Logic'
        },
        {
          name: 'Data Persistence Tier',
          type: 'Spring Data & JPA',
          role: 'Relational database mappings and transactions',
          responsibilities: ['Map entities to Oracle schema', 'Execute batch queries', 'Manage connection pool'],
          filePatterns: ['src/repositories/*.java', 'src/model/*.java'],
          layer: 'Persistence'
        },
        {
          name: 'External Integration Hub',
          type: 'Messaging & Legacy RPC',
          role: 'Asynchronous event bus and mainframe bridge',
          responsibilities: ['Publish transaction events to IBM MQ', 'Query external fraud engine'],
          filePatterns: ['src/integrations/*.java'],
          layer: 'Infrastructure'
        }
      ],
      layers: [
        {
          name: 'Presentation Layer',
          description: 'Contains 18 Spring RestControllers managing client HTTP sessions and serialization.',
          components: ['AuthController', 'AccountController', 'TransactionController', 'ReportController'],
          dependsOn: ['Application Service Layer']
        },
        {
          name: 'Application Service Layer',
          description: 'Contains 26 Service classes implementing transaction workflows and business validations.',
          components: ['AuthService', 'AccountService', 'TransactionService', 'ComplianceValidator'],
          dependsOn: ['Persistence Layer', 'Infrastructure Layer']
        },
        {
          name: 'Persistence Layer',
          description: 'Contains 34 JpaRepository and DAO classes communicating with Oracle DB.',
          components: ['UserRepository', 'AccountRepository', 'LedgerDAO', 'AuditLogRepository'],
          dependsOn: ['Database Storage']
        },
        {
          name: 'Infrastructure & External',
          description: 'Hardware interfaces, IBM MQ messaging drivers, and JWT crypto utilities.',
          components: ['JwtTokenUtil', 'FraudEngineClient', 'MQMessagePublisher'],
          dependsOn: []
        }
      ],
      risks: [
        'High coupling between TransactionService and proprietary Oracle PL/SQL packages',
        'Deprecated SHA-1 hashing algorithm found in legacy AuthService.java',
        'Lack of circuit breaker on synchronous external FraudEngine REST calls',
        'Overly broad @Transactional(isolation = SERIALIZABLE) causing database row lock contention under high loads'
      ]
    }
  };

  private mockRecommendations: AIRecommendation[] = [
    {
      id: 'rec-1',
      projectId: 'proj-banking-core',
      title: 'Extract Authentication Logic & Modernize Hashing',
      severity: 'CRITICAL',
      category: 'SECURITY',
      file: 'src/services/AuthService.java',
      lineRange: 'L28-L45',
      explanation: 'Legacy SHA-1 verification is vulnerable to collision attacks and lacks Argon2id or BCrypt adaptive work factors. The AuthService also mixes credential check with session generation.',
      recommendation: 'Refactor credential validation into a dedicated PasswordService with BCryptPasswordEncoder (work factor 12) and separate token generation into a SecurityTokenService.',
      suggestedCode: `@Service
public class ModernAuthService {
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(12);
    
    public boolean verifyPassword(String rawPassword, String hashedPassword) {
        return passwordEncoder.matches(rawPassword, hashedPassword);
    }
}`
    },
    {
      id: 'rec-2',
      projectId: 'proj-banking-core',
      title: 'Decouple TransactionService from Native PL/SQL Stored Procedures',
      severity: 'HIGH',
      category: 'ARCHITECTURE',
      file: 'src/services/TransactionService.java',
      lineRange: 'L112-L180',
      explanation: 'Direct calls to Oracle PL/SQL stored procedures prevent database portability and complicate automated unit testing with in-memory test doubles.',
      recommendation: 'Abstract ledger balance calculations into a Domain Entity method (Account.debit/credit) and use Spring Data Repository abstractions instead of raw JDBC callable statements.'
    },
    {
      id: 'rec-3',
      projectId: 'proj-banking-core',
      title: 'Implement Circuit Breaker for External Fraud Engine',
      severity: 'MEDIUM',
      category: 'PERFORMANCE',
      file: 'src/integrations/FraudEngineClient.java',
      lineRange: 'L54-L90',
      explanation: 'Synchronous REST call to third-party fraud gateway has a 10s default timeout without fallback or retry backoff.',
      recommendation: 'Wrap external calls with Resilience4j @CircuitBreaker with 1500ms timeout and asynchronous fallback queue.'
    },
    {
      id: 'rec-4',
      projectId: 'proj-banking-core',
      title: 'Generate OpenAPI 3.0 Documentation for Legacy Endpoints',
      severity: 'LOW',
      category: 'DOCUMENTATION',
      file: 'src/controllers/AccountController.java',
      lineRange: 'L1-L238',
      explanation: 'Endpoints lack OpenAPI/Swagger annotations, making client SDK generation and contract testing difficult.',
      recommendation: 'Add @Tag and @Operation annotations with standard HTTP response code descriptions.'
    }
  ];

  getArchitecture(projectId = 'proj-banking-core'): Observable<ArchitectureAnalysis> {
    const data = this.mockArchitecture[projectId] || this.mockArchitecture['proj-banking-core'];
    return of(data).pipe(delay(200));
  }

  getRecommendations(projectId = 'proj-banking-core'): Observable<AIRecommendation[]> {
    return of(this.mockRecommendations).pipe(delay(150));
  }
}
