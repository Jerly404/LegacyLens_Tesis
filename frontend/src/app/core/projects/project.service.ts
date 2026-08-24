import { Injectable, signal } from '@angular/core';
import { Project, FileNode, ProjectStatus, DependencyGraphData } from '@codelens/shared';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private initialProjects: Project[] = [
    {
      id: 'proj-banking-core',
      name: 'Legacy Banking Transaction Core',
      slug: 'legacy-banking-api',
      description: 'Core transaction settlement engine and account balance ledger with legacy soap interfaces and heavy PL/SQL dependencies.',
      repositoryUrl: 'https://github.com/enterprise-fin/banking-transaction-core.git',
      mainLanguage: 'Java',
      framework: 'Spring Boot 2.1 & Hibernate 5',
      branch: 'main',
      languages: [
        { name: 'Java', percentage: 68, color: '#f89820', loc: 167144 },
        { name: 'PL/SQL', percentage: 18, color: '#e34c26', loc: 44244 },
        { name: 'XML / WSDL', percentage: 9, color: '#0060ac', loc: 22122 },
        { name: 'Shell', percentage: 5, color: '#89e051', loc: 12290 }
      ],
      fileCount: 1842,
      linesOfCode: 245800,
      architecture: 'Layered Architecture',
      confidence: 94,
      status: 'COMPLETED',
      progress: 100,
      lastAnalyzedAt: '2026-08-22T14:30:00Z',
      createdAt: '2026-08-10T10:00:00Z',
      updatedAt: '2026-08-22T14:30:00Z',
      healthScore: 68
    },
    {
      id: 'proj-ecommerce-mono',
      name: 'E-Commerce Monolith & Order Engine',
      slug: 'ecommerce-system',
      description: 'Legacy web store with tightly coupled checkout pipeline, MySQL raw queries, and outdated payment webhooks.',
      repositoryUrl: 'https://github.com/retail-corp/ecommerce-monolith.git',
      mainLanguage: 'PHP',
      framework: 'Laravel 5.8 / Blade',
      branch: 'master',
      languages: [
        { name: 'PHP', percentage: 58, color: '#4F5D95', loc: 68672 },
        { name: 'JavaScript', percentage: 22, color: '#F7DF1E', loc: 26048 },
        { name: 'Blade / HTML', percentage: 12, color: '#E34F26', loc: 14208 },
        { name: 'SQL', percentage: 8, color: '#336791', loc: 9472 }
      ],
      fileCount: 920,
      linesOfCode: 118400,
      architecture: 'Monolithic MVC',
      confidence: 89,
      status: 'COMPLETED',
      progress: 100,
      lastAnalyzedAt: '2026-08-21T09:15:00Z',
      createdAt: '2026-08-12T11:20:00Z',
      updatedAt: '2026-08-21T09:15:00Z',
      healthScore: 54
    },
    {
      id: 'proj-health-hl7',
      name: 'Healthcare Patient Records & HL7 Gateway',
      slug: 'healthcare-hl7-api',
      description: 'Electronic Health Record (EHR) sync server with custom HL7 parser, WCF services, and MS SQL Server stored procedures.',
      repositoryUrl: 'https://github.com/medtech/ehr-hl7-gateway.git',
      mainLanguage: 'C#',
      framework: '.NET Framework 4.8 / WCF',
      branch: 'release/2.4',
      languages: [
        { name: 'C#', percentage: 72, color: '#178600', loc: 136224 },
        { name: 'T-SQL', percentage: 16, color: '#e38c00', loc: 30272 },
        { name: 'XML / HL7', percentage: 12, color: '#555555', loc: 22704 }
      ],
      fileCount: 1450,
      linesOfCode: 189200,
      architecture: 'Layered Architecture',
      confidence: 91,
      status: 'COMPLETED',
      progress: 100,
      lastAnalyzedAt: '2026-08-19T18:40:00Z',
      createdAt: '2026-08-05T08:15:00Z',
      updatedAt: '2026-08-19T18:40:00Z',
      healthScore: 62
    },
    {
      id: 'proj-inventory-api',
      name: 'Cloud Inventory API & Sync Service',
      slug: 'inventory-system',
      description: 'Modernized logistics microservice with CQRS events, Redis cache layers, and OpenAPI 3.0 interfaces.',
      repositoryUrl: 'https://github.com/logistics-inc/inventory-sync-service.git',
      mainLanguage: 'TypeScript',
      framework: 'NestJS / Express / Prisma',
      branch: 'main',
      languages: [
        { name: 'TypeScript', percentage: 84, color: '#3178C6', loc: 49476 },
        { name: 'SQL', percentage: 10, color: '#336791', loc: 5890 },
        { name: 'Docker / YAML', percentage: 6, color: '#384d54', loc: 3534 }
      ],
      fileCount: 420,
      linesOfCode: 58900,
      architecture: 'Clean Architecture',
      confidence: 96,
      status: 'COMPLETED',
      progress: 100,
      lastAnalyzedAt: '2026-08-23T11:00:00Z',
      createdAt: '2026-08-18T16:00:00Z',
      updatedAt: '2026-08-23T11:00:00Z',
      healthScore: 88
    },
    {
      id: 'proj-payment-gate',
      name: 'Payment Processing Gateway & Ledger',
      slug: 'payment-gateway',
      description: 'Distributed payment router supporting multiple acquirers, fraud checks, and idempotency guarantees.',
      repositoryUrl: 'https://github.com/fintech/payment-gateway-v2.git',
      mainLanguage: 'Go',
      framework: 'gRPC / Gorilla / Kafka',
      branch: 'develop',
      languages: [
        { name: 'Go', percentage: 89, color: '#00ADD8', loc: 41118 },
        { name: 'Protobuf', percentage: 7, color: '#555555', loc: 3234 },
        { name: 'SQL', percentage: 4, color: '#336791', loc: 1848 }
      ],
      fileCount: 380,
      linesOfCode: 46200,
      architecture: 'Hexagonal Architecture',
      confidence: 92,
      status: 'ANALYZING',
      progress: 78,
      lastAnalyzedAt: '2026-08-24T18:00:00Z',
      createdAt: '2026-08-24T17:30:00Z',
      updatedAt: '2026-08-24T18:00:00Z',
      healthScore: 91
    }
  ];

  private projectsSignal = signal<Project[]>(this.initialProjects);
  private selectedProjectSignal = signal<Project>(this.initialProjects[0]);

  projects = this.projectsSignal.asReadonly();
  selectedProject = this.selectedProjectSignal.asReadonly();

  getAll(): Observable<Project[]> {
    return of(this.projectsSignal()).pipe(delay(150));
  }

  getById(id: string): Observable<Project | undefined> {
    const project = this.projectsSignal().find(p => p.id === id || p.slug === id);
    if (project) {
      this.selectedProjectSignal.set(project);
    }
    return of(project).pipe(delay(100));
  }

  setSelectedProject(project: Project) {
    this.selectedProjectSignal.set(project);
  }

  createProject(projectData: Partial<Project>): Observable<Project> {
    const newProject: Project = {
      id: 'proj-' + Date.now().toString(36),
      name: projectData.name || 'Untitled Legacy Project',
      slug: (projectData.name || 'project').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: projectData.description || 'Uploaded software repository for AI reverse engineering and documentation.',
      repositoryUrl: projectData.repositoryUrl,
      mainLanguage: projectData.mainLanguage || 'Java',
      framework: projectData.framework || 'Custom Enterprise Framework',
      branch: projectData.branch || 'main',
      languages: [
        { name: projectData.mainLanguage || 'Java', percentage: 75, color: '#3B82F6', loc: 32000 },
        { name: 'SQL', percentage: 15, color: '#10B981', loc: 6400 },
        { name: 'Config', percentage: 10, color: '#A855F7', loc: 4200 }
      ],
      fileCount: Math.floor(Math.random() * 800 + 200),
      linesOfCode: Math.floor(Math.random() * 80000 + 25000),
      architecture: 'Layered Architecture',
      confidence: 88,
      status: 'ANALYZING',
      progress: 0,
      lastAnalyzedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      healthScore: 72
    };

    this.projectsSignal.update(list => [newProject, ...list]);
    this.selectedProjectSignal.set(newProject);
    return of(newProject).pipe(delay(300));
  }

  deleteProject(id: string): Observable<boolean> {
    this.projectsSignal.update(list => list.filter(p => p.id !== id));
    if (this.selectedProjectSignal().id === id && this.projectsSignal().length > 0) {
      this.selectedProjectSignal.set(this.projectsSignal()[0]);
    }
    return of(true).pipe(delay(200));
  }

  getFileTree(projectId?: string): FileNode[] {
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
                id: 'file-auth-controller',
                name: 'AuthController.java',
                path: 'src/controllers/AuthController.java',
                type: 'file',
                language: 'java',
                lines: 142,
                size: 4820,
                complexity: 8,
                dependencies: ['AuthService', 'TokenProvider', 'UserDTO'],
                content: `package com.enterprise.banking.controllers;

import com.enterprise.banking.services.AuthService;
import com.enterprise.banking.dto.LoginRequest;
import com.enterprise.banking.dto.AuthResponse;
import com.enterprise.banking.security.JwtTokenUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Legacy Authentication Endpoint.
 * Coordinates credentials validation and generates session tokens.
 */
@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private JwtTokenUtil tokenUtil;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> authenticate(@RequestBody LoginRequest request) {
        // Legacy credential verification against core LDAP & DB
        boolean isValid = authService.validateCredentials(request.getUsername(), request.getPassword());
        if (!isValid) {
            return ResponseEntity.status(401).build();
        }
        
        String token = tokenUtil.generateToken(request.getUsername(), authService.getPermissions(request.getUsername()));
        return ResponseEntity.ok(new AuthResponse(token, request.getUsername(), "ACTIVE"));
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refreshToken(@RequestHeader("Authorization") String bearerToken) {
        String token = bearerToken.replace("Bearer ", "");
        String renewed = tokenUtil.refreshToken(token);
        return ResponseEntity.ok(new AuthResponse(renewed, tokenUtil.getUsername(renewed), "RENEWED"));
    }
}`
              },
              {
                id: 'file-account-controller',
                name: 'AccountController.java',
                path: 'src/controllers/AccountController.java',
                type: 'file',
                language: 'java',
                lines: 238,
                size: 8940,
                complexity: 14,
                dependencies: ['AccountService', 'TransactionService', 'AuditLogger'],
                content: `package com.enterprise.banking.controllers;

import com.enterprise.banking.services.AccountService;
import com.enterprise.banking.model.Account;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/accounts")
public class AccountController {

    @Autowired
    private AccountService accountService;

    @GetMapping("/{accountNumber}")
    public ResponseEntity<Account> getAccount(@PathVariable String accountNumber) {
        Account account = accountService.findAccount(accountNumber);
        if (account == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(account);
    }

    @GetMapping("/{accountNumber}/balance")
    public ResponseEntity<BigDecimal> getBalance(@PathVariable String accountNumber) {
        return ResponseEntity.ok(accountService.computeCurrentBalance(accountNumber));
    }
}`
              },
              {
                id: 'file-transaction-controller',
                name: 'TransactionController.java',
                path: 'src/controllers/TransactionController.java',
                type: 'file',
                language: 'java',
                lines: 195,
                size: 7120,
                complexity: 12,
                dependencies: ['TransactionService', 'ComplianceValidator'],
                content: `package com.enterprise.banking.controllers;

import com.enterprise.banking.services.TransactionService;
import com.enterprise.banking.dto.TransferRequest;
import com.enterprise.banking.dto.TransferResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/transactions")
public class TransactionController {

    @Autowired
    private TransactionService txService;

    @PostMapping("/transfer")
    public TransferResult executeTransfer(@RequestBody TransferRequest request) {
        return txService.processTransfer(request);
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
                id: 'file-auth-service',
                name: 'AuthService.java',
                path: 'src/services/AuthService.java',
                type: 'file',
                language: 'java',
                lines: 312,
                size: 11400,
                complexity: 19,
                dependencies: ['UserRepository', 'AuditLogRepository', 'PasswordEncoder'],
                content: `package com.enterprise.banking.services;

import com.enterprise.banking.repositories.UserRepository;
import com.enterprise.banking.model.UserEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {
    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public boolean validateCredentials(String username, String rawPassword) {
        UserEntity user = userRepository.findByUsername(username);
        if (user == null || !user.isActive()) {
            return false;
        }
        return legacyPasswordVerify(rawPassword, user.getPasswordHash());
    }

    private boolean legacyPasswordVerify(String raw, String hash) {
        // High coupling: Legacy SHA-1 + salt validation routine
        return hash != null && !hash.isEmpty();
    }
}`
              },
              {
                id: 'file-tx-service',
                name: 'TransactionService.java',
                path: 'src/services/TransactionService.java',
                type: 'file',
                language: 'java',
                lines: 480,
                size: 18200,
                complexity: 28,
                dependencies: ['AccountRepository', 'LedgerDAO', 'FraudEngineClient', 'NotificationQueue'],
                content: `package com.enterprise.banking.services;

import com.enterprise.banking.repositories.AccountRepository;
import com.enterprise.banking.dto.TransferRequest;
import com.enterprise.banking.dto.TransferResult;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TransactionService {

    private final AccountRepository accountRepository;

    public TransactionService(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    @Transactional(isolation = Isolation.SERIALIZABLE, rollbackFor = Exception.class)
    public TransferResult processTransfer(TransferRequest req) {
        // Step 1: Lock source and destination accounts
        // Step 2: Validate available balance
        // Step 3: Call external fraud scoring gateway
        // Step 4: Write to double-entry ledger database table
        return new TransferResult("TX-998231", "SUCCESS", req.getAmount());
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
                id: 'file-user-repo',
                name: 'UserRepository.java',
                path: 'src/repositories/UserRepository.java',
                type: 'file',
                language: 'java',
                lines: 88,
                size: 3200,
                complexity: 4,
                dependencies: ['UserEntity', 'JpaRepository'],
                content: `package com.enterprise.banking.repositories;

import com.enterprise.banking.model.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, String> {
    UserEntity findByUsername(String username);
    boolean existsByEmail(String email);
}`
              },
              {
                id: 'file-account-repo',
                name: 'AccountRepository.java',
                path: 'src/repositories/AccountRepository.java',
                type: 'file',
                language: 'java',
                lines: 110,
                size: 4100,
                complexity: 6,
                dependencies: ['Account', 'JpaRepository'],
                content: `package com.enterprise.banking.repositories;

import com.enterprise.banking.model.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AccountRepository extends JpaRepository<Account, String> {
    Account findByAccountNumber(String accountNumber);
}`
              }
            ]
          }
        ]
      },
      {
        id: 'dir-config',
        name: 'config',
        path: 'config',
        type: 'directory',
        children: [
          {
            id: 'file-app-properties',
            name: 'application.properties',
            path: 'config/application.properties',
            type: 'file',
            language: 'properties',
            lines: 48,
            size: 1980,
            complexity: 1,
            content: `spring.datasource.url=jdbc:oracle:thin:@//oracle-db.internal:1521/FINCORE
spring.datasource.driver-class-name=oracle.jdbc.OracleDriver
spring.jpa.hibernate.ddl-auto=none
spring.jpa.show-sql=false
server.port=8080`
          }
        ]
      },
      {
        id: 'file-pom',
        name: 'pom.xml',
        path: 'pom.xml',
        type: 'file',
        language: 'xml',
        lines: 185,
        size: 7420,
        complexity: 2,
        content: `<project xmlns="http://maven.apache.org/POM/4.0.0">
  <modelVersion>4.0.0</modelVersion>
  <groupId>com.enterprise.banking</groupId>
  <artifactId>banking-transaction-core</artifactId>
  <version>2.4.1-RELEASE</version>
</project>`
      },
      {
        id: 'file-readme',
        name: 'README.md',
        path: 'README.md',
        type: 'file',
        language: 'markdown',
        lines: 64,
        size: 2150,
        complexity: 1,
        content: `# Legacy Banking Transaction Core

Enterprise transaction and double-entry balance ledger engine.

## Architecture
- Layered MVC Architecture with Spring Boot & Oracle JDBC
- Integrated with Legacy Soap Mainframe & MessageQueues
`
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
