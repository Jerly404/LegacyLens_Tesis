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
      description: 'Core transaction settlement engine and account balance ledger with legacy SOAP interfaces and heavy Oracle PL/SQL dependencies.',
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
      lastAnalyzedAt: '2026-08-25T08:30:00Z',
      createdAt: '2026-08-10T10:00:00Z',
      updatedAt: '2026-08-25T08:30:00Z',
      healthScore: 68
    },
    {
      id: 'proj-health-hl7',
      name: 'Healthcare Patient Records & HL7 Gateway',
      slug: 'healthcare-hl7-api',
      description: 'Electronic Health Record (EHR) sync server with custom HL7 parser, WCF SOAP services, and MS SQL Server stored procedures.',
      repositoryUrl: 'https://github.com/medtech/ehr-hl7-gateway.git',
      mainLanguage: 'C#',
      framework: '.NET Framework 4.8 / WCF / Entity Framework 6',
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
      lastAnalyzedAt: '2026-08-24T18:40:00Z',
      createdAt: '2026-08-05T08:15:00Z',
      updatedAt: '2026-08-24T18:40:00Z',
      healthScore: 62
    },
    {
      id: 'proj-ecommerce-mono',
      name: 'E-Commerce Monolith & Order Engine',
      slug: 'ecommerce-system',
      description: 'Legacy PHP web store with tightly coupled checkout pipeline, MySQL raw queries, and outdated payment webhooks.',
      repositoryUrl: 'https://github.com/retail-corp/ecommerce-monolith.git',
      mainLanguage: 'PHP',
      framework: 'Laravel 5.8 / Blade / Raw MySQL',
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
      lastAnalyzedAt: '2026-08-23T09:15:00Z',
      createdAt: '2026-08-12T11:20:00Z',
      updatedAt: '2026-08-23T09:15:00Z',
      healthScore: 54
    },
    {
      id: 'proj-scada-cpp',
      name: 'Industrial SCADA & Telemetry Engine',
      slug: 'scada-telemetry-engine',
      description: 'Legacy C++ telemetry aggregator communicating over Modbus TCP, raw sockets, and POSIX multithreading queues.',
      repositoryUrl: 'https://github.com/industrial/scada-telemetry.git',
      mainLanguage: 'C++',
      framework: 'C++14 / Boost / CMake / Qt 5',
      branch: 'main',
      languages: [
        { name: 'C++', percentage: 76, color: '#f34b7d', loc: 92400 },
        { name: 'C', percentage: 16, color: '#555555', loc: 19440 },
        { name: 'CMake / Shell', percentage: 8, color: '#DA3434', loc: 9720 }
      ],
      fileCount: 680,
      linesOfCode: 121560,
      architecture: 'Event-Driven Pipeline',
      confidence: 87,
      status: 'COMPLETED',
      progress: 100,
      lastAnalyzedAt: '2026-08-24T14:00:00Z',
      createdAt: '2026-08-14T09:00:00Z',
      updatedAt: '2026-08-24T14:00:00Z',
      healthScore: 71
    },
    {
      id: 'proj-python-etl',
      name: 'Financial Ledger ETL & Reconciliation',
      slug: 'python-ledger-etl',
      description: 'Distributed batch processor written in Python/Django with Celery workers, Pandas data frames, and PostgreSQL bulk copy.',
      repositoryUrl: 'https://github.com/fintech/ledger-etl-pipeline.git',
      mainLanguage: 'Python',
      framework: 'Django 3.2 / Celery 5 / Pandas',
      branch: 'develop',
      languages: [
        { name: 'Python', percentage: 82, color: '#3572A5', loc: 64780 },
        { name: 'SQL', percentage: 12, color: '#336791', loc: 9480 },
        { name: 'Docker / YAML', percentage: 6, color: '#384d54', loc: 4740 }
      ],
      fileCount: 510,
      linesOfCode: 79000,
      architecture: 'Pipes & Filters Architecture',
      confidence: 93,
      status: 'COMPLETED',
      progress: 100,
      lastAnalyzedAt: '2026-08-25T07:15:00Z',
      createdAt: '2026-08-16T12:00:00Z',
      updatedAt: '2026-08-25T07:15:00Z',
      healthScore: 84
    },
    {
      id: 'proj-cobol-core',
      name: 'Mainframe Core Account Ledger',
      slug: 'mainframe-cobol-ledger',
      description: 'Mission-critical mainframe batch suite processing overnight general ledger postings and CICS transaction copybooks.',
      repositoryUrl: 'https://github.com/enterprise-bank/mainframe-cobol-core.git',
      mainLanguage: 'COBOL',
      framework: 'COBOL-85 / CICS / DB2 SQL',
      branch: 'prod/v8',
      languages: [
        { name: 'COBOL', percentage: 78, color: '#005CA5', loc: 312000 },
        { name: 'JCL', percentage: 14, color: '#4d5b6a', loc: 56000 },
        { name: 'DB2 SQL', percentage: 8, color: '#e34c26', loc: 32000 }
      ],
      fileCount: 2240,
      linesOfCode: 400000,
      architecture: 'Monolithic Mainframe Batch',
      confidence: 96,
      status: 'COMPLETED',
      progress: 100,
      lastAnalyzedAt: '2026-08-24T19:00:00Z',
      createdAt: '2026-08-01T08:00:00Z',
      updatedAt: '2026-08-24T19:00:00Z',
      healthScore: 48
    },
    {
      id: 'proj-inventory-api',
      name: 'Cloud Inventory API & Sync Service',
      slug: 'inventory-system',
      description: 'Modernized logistics microservice with CQRS events, Redis cache layers, and OpenAPI 3.0 interfaces.',
      repositoryUrl: 'https://github.com/logistics-inc/inventory-sync-service.git',
      mainLanguage: 'TypeScript',
      framework: 'NestJS / Express / Prisma / PostgreSQL',
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
      lastAnalyzedAt: '2026-08-25T06:00:00Z',
      createdAt: '2026-08-18T16:00:00Z',
      updatedAt: '2026-08-25T06:00:00Z',
      healthScore: 88
    },
    {
      id: 'proj-payment-gate',
      name: 'Payment Processing Gateway & Ledger',
      slug: 'payment-gateway',
      description: 'Distributed payment router supporting multiple acquirers, fraud checks, and idempotency guarantees.',
      repositoryUrl: 'https://github.com/fintech/payment-gateway-v2.git',
      mainLanguage: 'Go',
      framework: 'Go 1.22 / gRPC / Gorilla / Kafka',
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
      lastAnalyzedAt: '2026-08-25T09:30:00Z',
      createdAt: '2026-08-25T09:00:00Z',
      updatedAt: '2026-08-25T09:30:00Z',
      healthScore: 91
    }
  ];

  private projectsSignal = signal<Project[]>(this.initialProjects);
  private selectedProjectSignal = signal<Project>(this.initialProjects[0]);

  projects = this.projectsSignal.asReadonly();
  selectedProject = this.selectedProjectSignal.asReadonly();

  getAll(): Observable<Project[]> {
    return of(this.projectsSignal()).pipe(delay(100));
  }

  getById(id: string): Observable<Project | undefined> {
    const project = this.projectsSignal().find(p => p.id === id || p.slug === id);
    if (project) {
      this.selectedProjectSignal.set(project);
    }
    return of(project).pipe(delay(80));
  }

  setSelectedProject(project: Project) {
    this.selectedProjectSignal.set(project);
  }

  createProject(projectData: Partial<Project>): Observable<Project> {
    const lang = projectData.mainLanguage || 'Java';
    const newProject: Project = {
      id: 'proj-' + Date.now().toString(36),
      name: projectData.name || 'Untitled Legacy Project',
      slug: (projectData.name || 'project').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: projectData.description || `Uploaded ${lang} repository for AI reverse engineering and documentation.`,
      repositoryUrl: projectData.repositoryUrl,
      mainLanguage: lang,
      framework: projectData.framework || `${lang} Custom Enterprise Architecture`,
      branch: projectData.branch || 'main',
      languages: [
        { name: lang, percentage: 75, color: this.getLanguageColor(lang), loc: 38000 },
        { name: 'SQL / DB', percentage: 15, color: '#10B981', loc: 7600 },
        { name: 'Config', percentage: 10, color: '#A855F7', loc: 5000 }
      ],
      fileCount: Math.floor(Math.random() * 800 + 250),
      linesOfCode: Math.floor(Math.random() * 80000 + 35000),
      architecture: 'Layered Architecture',
      confidence: 89,
      status: 'ANALYZING',
      progress: 0,
      lastAnalyzedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      healthScore: 74
    };

    this.projectsSignal.update(list => [newProject, ...list]);
    this.selectedProjectSignal.set(newProject);
    return of(newProject).pipe(delay(200));
  }

  private getLanguageColor(lang: string): string {
    const map: Record<string, string> = {
      Java: '#f89820',
      'C#': '#178600',
      PHP: '#4F5D95',
      Python: '#3572A5',
      'C++': '#f34b7d',
      COBOL: '#005CA5',
      TypeScript: '#3178C6',
      Go: '#00ADD8',
      Ruby: '#701516',
      Rust: '#dea584'
    };
    return map[lang] || '#3B82F6';
  }

  deleteProject(id: string): Observable<boolean> {
    this.projectsSignal.update(list => list.filter(p => p.id !== id));
    if (this.selectedProjectSignal().id === id && this.projectsSignal().length > 0) {
      this.selectedProjectSignal.set(this.projectsSignal()[0]);
    }
    return of(true).pipe(delay(100));
  }

  getFileTree(projectId?: string): FileNode[] {
    const targetId = projectId || this.selectedProject().id;

    if (targetId === 'proj-health-hl7') {
      return [
        {
          id: 'dir-csharp-src',
          name: 'src',
          path: 'src',
          type: 'directory',
          children: [
            {
              id: 'dir-csharp-controllers',
              name: 'Controllers',
              path: 'src/Controllers',
              type: 'directory',
              children: [
                {
                  id: 'file-patient-ctrl',
                  name: 'PatientRecordController.cs',
                  path: 'src/Controllers/PatientRecordController.cs',
                  type: 'file',
                  language: 'csharp',
                  lines: 188,
                  complexity: 11,
                  dependencies: ['IPatientService', 'HL7MessageFormatter', 'AuditLogger'],
                  content: `using System;
using System.Threading.Tasks;
using System.Web.Http;
using MedTech.EHR.Services;
using MedTech.EHR.Models;

namespace MedTech.EHR.Controllers
{
    [Authorize(Roles = "ClinicalPractitioner,SystemAdmin")]
    [RoutePrefix("api/v1/patients")]
    public class PatientRecordController : ApiController
    {
        private readonly IPatientService _patientService;
        private readonly IHL7Service _hl7Service;

        public PatientRecordController(IPatientService patientService, IHL7Service hl7Service)
        {
            _patientService = patientService;
            _hl7Service = hl7Service;
        }

        [HttpGet]
        [Route("{patientId:guid}/clinical-summary")]
        public async Task<IHttpActionResult> GetClinicalSummary(Guid patientId)
        {
            var record = await _patientService.GetPatientWithHistoryAsync(patientId);
            if (record == null) return NotFound();
            return Ok(record);
        }

        [HttpPost]
        [Route("ingest-hl7")]
        public async Task<IHttpActionResult> IngestHL7Feed([FromBody] string rawHL7Message)
        {
            var parsed = _hl7Service.ParseADT_A01(rawHL7Message);
            var result = await _patientService.ProcessAdmissionAsync(parsed);
            return Ok(new { status = "PROCESSED", mrn = result.MedicalRecordNumber });
        }
    }
}`
                }
              ]
            },
            {
              id: 'dir-csharp-services',
              name: 'Services',
              path: 'src/Services',
              type: 'directory',
              children: [
                {
                  id: 'file-hl7-parser',
                  name: 'HL7MessageService.cs',
                  path: 'src/Services/HL7MessageService.cs',
                  type: 'file',
                  language: 'csharp',
                  lines: 340,
                  complexity: 24,
                  dependencies: ['HL7SegmentParser', 'PatientRepository'],
                  content: `using System;
using System.Text.RegularExpressions;
using MedTech.EHR.Models;

namespace MedTech.EHR.Services
{
    public class HL7MessageService : IHL7Service
    {
        // Legacy HL7 v2.3 / v2.5 Pipe-and-Hat delimiter parser
        public PatientAdmission ParseADT_A01(string rawMessage)
        {
            var segments = rawMessage.Split(new[] { "\\r\\n", "\\r", "\\n" }, StringSplitOptions.RemoveEmptyEntries);
            var admission = new PatientAdmission();

            foreach (var seg in segments)
            {
                var fields = seg.Split('|');
                if (fields[0] == "PID")
                {
                    admission.MedicalRecordNumber = fields[3];
                    var nameParts = fields[5].Split('^');
                    admission.LastName = nameParts[0];
                    admission.FirstName = nameParts.Length > 1 ? nameParts[1] : "";
                }
                else if (fields[0] == "PV1")
                {
                    admission.AssignedPatientLocation = fields[3];
                    admission.AttendingDoctor = fields[7];
                }
            }
            return admission;
        }
    }
}`
                }
              ]
            }
          ]
        }
      ];
    }

    if (targetId === 'proj-python-etl') {
      return [
        {
          id: 'dir-py-src',
          name: 'pipeline',
          path: 'pipeline',
          type: 'directory',
          children: [
            {
              id: 'file-py-tasks',
              name: 'reconciliation_tasks.py',
              path: 'pipeline/reconciliation_tasks.py',
              type: 'file',
              language: 'python',
              lines: 165,
              complexity: 14,
              dependencies: ['celery', 'pandas', 'sqlalchemy', 'django.db'],
              content: `import pandas as pd
from celery import shared_task
from django.db import transaction
from .models import LedgerEntry, ReconciliationBatch
import logging

logger = logging.getLogger(__name__)

@shared_task(bind=True, max_retries=3)
def reconcile_overnight_ledger(self, batch_id: str):
    """
    Asynchronous ETL pipeline worker:
    1. Loads raw clearing batches from S3 / PostgreSQL
    2. Computes net debit/credit balance differences
    3. Detects discrepancies > $0.01 tolerance
    """
    try:
        batch = ReconciliationBatch.objects.get(batch_id=batch_id)
        df = pd.read_sql("SELECT * FROM ledger_entries WHERE batch_id = %(b)s", 
                         params={'b': batch_id}, con=transaction.get_connection())

        grouped = df.groupby('account_number').agg({
            'debit_amount': 'sum',
            'credit_amount': 'sum'
        })
        grouped['net_delta'] = grouped['credit_amount'] - grouped['debit_amount']
        
        discrepancies = grouped[grouped['net_delta'].abs() > 0.01]
        if not discrepancies.empty:
            logger.warning(f"Found {len(discrepancies)} mismatched accounts in batch {batch_id}")
            batch.status = "FLAGGED_FOR_REVIEW"
        else:
            batch.status = "BALANCED"
        batch.save()
        return {"status": batch.status, "total_records": len(df)}
    except Exception as exc:
        logger.error(f"ETL error in batch {batch_id}: {exc}")
        raise self.retry(exc=exc, countdown=60)`
            }
          ]
        }
      ];
    }

    if (targetId === 'proj-scada-cpp') {
      return [
        {
          id: 'dir-cpp-src',
          name: 'src',
          path: 'src',
          type: 'directory',
          children: [
            {
              id: 'file-cpp-modbus',
              name: 'ModbusTelemetryWorker.cpp',
              path: 'src/ModbusTelemetryWorker.cpp',
              type: 'file',
              language: 'cpp',
              lines: 240,
              complexity: 18,
              dependencies: ['pthread', 'sys/socket.h', 'netinet/in.h', 'boost/circular_buffer.hpp'],
              content: `#include "ModbusTelemetryWorker.h"
#include <iostream>
#include <sys/socket.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <chrono>

namespace SCADA {

ModbusTelemetryWorker::ModbusTelemetryWorker(const std::string& host, int port)
    : m_host(host), m_port(port), m_running(false), m_sockfd(-1) {}

ModbusTelemetryWorker::~ModbusTelemetryWorker() {
    stop();
}

bool ModbusTelemetryWorker::connectToPLC() {
    m_sockfd = socket(AF_INET, SOCK_STREAM, 0);
    if (m_sockfd < 0) return false;

    struct sockaddr_in serv_addr{};
    serv_addr.sin_family = AF_INET;
    serv_addr.sin_port = htons(m_port);
    inet_pton(AF_INET, m_host.c_str(), &serv_addr.sin_addr);

    return connect(m_sockfd, (struct sockaddr*)&serv_addr, sizeof(serv_addr)) >= 0;
}

void ModbusTelemetryWorker::runLoop() {
    m_running = true;
    uint8_t buffer[256];
    while (m_running) {
        // Poll holding registers (Function code 0x03)
        ssize_t bytes = recv(m_sockfd, buffer, sizeof(buffer), 0);
        if (bytes > 0) {
            parseSensorFrame(buffer, bytes);
        }
        std::this_thread::sleep_for(std::chrono::milliseconds(100));
    }
}

}`
            }
          ]
        }
      ];
    }

    if (targetId === 'proj-cobol-core') {
      return [
        {
          id: 'dir-cobol-src',
          name: 'COBSRC',
          path: 'COBSRC',
          type: 'directory',
          children: [
            {
              id: 'file-cobol-post',
              name: 'BATPOST.cbl',
              path: 'COBSRC/BATPOST.cbl',
              type: 'file',
              language: 'cobol',
              lines: 480,
              complexity: 32,
              dependencies: ['ACCTREC', 'TRANREC', 'EXEC SQL'],
              content: `       IDENTIFICATION DIVISION.
       PROGRAM-ID.    BATPOST.
       AUTHOR.        ENTERPRISE BANKING CORE.
       DATE-WRITTEN.  1998-04-12.
      *---------------------------------------------------------------*
      * OVERNIGHT GENERAL LEDGER POSTING & BALANCE CALCULATOR         *
      *---------------------------------------------------------------*
       ENVIRONMENT DIVISION.
       INPUT-OUTPUT SECTION.
       FILE-CONTROL.
           SELECT TX-IN-FILE ASSIGN TO 'TXIN.DAT'
           ORGANIZATION IS SEQUENTIAL.

       DATA DIVISION.
       FILE SECTION.
       FD  TX-IN-FILE.
       01  TX-RECORD.
           05  TX-ACCOUNT-NUM      PIC X(16).
           05  TX-TYPE             PIC X(2).
           05  TX-AMOUNT           PIC 9(10)V99.
           05  TX-DATE             PIC X(8).

       WORKING-STORAGE SECTION.
       EXEC SQL INCLUDE SQLCA END-EXEC.
       EXEC SQL INCLUDE ACCTREC END-EXEC.

       01  WS-TOTAL-POSTED         PIC 9(12)V99 VALUE ZERO.
       01  WS-EOF-FLAG             PIC X VALUE 'N'.

       PROCEDURE DIVISION.
       0000-MAIN-LOGIC.
           OPEN INPUT TX-IN-FILE.
           PERFORM 1000-PROCESS-RECORD UNTIL WS-EOF-FLAG = 'Y'.
           CLOSE TX-IN-FILE.
           GOBACK.

       1000-PROCESS-RECORD.
           READ TX-IN-FILE
               AT END MOVE 'Y' TO WS-EOF-FLAG
               NOT AT END
                   EXEC SQL
                       UPDATE ACCOUNTS
                       SET BALANCE = BALANCE + :TX-AMOUNT
                       WHERE ACCOUNT_ID = :TX-ACCOUNT-NUM
                   END-EXEC
                   ADD TX-AMOUNT TO WS-TOTAL-POSTED
           END-READ.`
            }
          ]
        }
      ];
    }

    // Default Java Spring Boot File Tree
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
