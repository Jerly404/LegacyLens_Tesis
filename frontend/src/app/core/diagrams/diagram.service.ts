import { Injectable } from '@angular/core';
import { UMLDiagram, UMLType } from '@codelens/shared';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DiagramService {
  private diagrams: Record<UMLType, UMLDiagram> = {
    class: {
      id: 'diag-class-1',
      projectId: 'proj-banking-core',
      type: 'class',
      title: 'Domain & Service Class Diagram',
      description: 'Reverse-engineered class hierarchy showing entity relationships, controllers, and repository interfaces.',
      mermaidCode: `classDiagram
    class AuthController {
        -AuthService authService
        -JwtTokenUtil tokenUtil
        +authenticate(LoginRequest) ResponseEntity
        +refreshToken(String) ResponseEntity
    }
    class AccountController {
        -AccountService accountService
        +getAccount(String) ResponseEntity
        +getBalance(String) ResponseEntity
    }
    class TransactionController {
        -TransactionService txService
        +executeTransfer(TransferRequest) TransferResult
    }
    class AuthService {
        -UserRepository userRepository
        +validateCredentials(String, String) boolean
        -legacyPasswordVerify(String, String) boolean
    }
    class AccountService {
        -AccountRepository accountRepository
        +findAccount(String) Account
        +computeCurrentBalance(String) BigDecimal
    }
    class TransactionService {
        -AccountRepository accountRepository
        +processTransfer(TransferRequest) TransferResult
    }
    class UserRepository {
        <<interface>>
        +findByUsername(String) UserEntity
        +existsByEmail(String) boolean
    }
    class AccountRepository {
        <<interface>>
        +findByAccountNumber(String) Account
    }
    class UserEntity {
        +String userId
        +String username
        +String passwordHash
        +boolean isActive
    }
    class Account {
        +String accountNumber
        +String userId
        +BigDecimal balance
        +String currency
        +String status
    }

    AuthController --> AuthService : delegates to
    AccountController --> AccountService : delegates to
    TransactionController --> TransactionService : delegates to
    AuthService --> UserRepository : queries
    AccountService --> AccountRepository : queries
    TransactionService --> AccountRepository : updates
    UserRepository ..> UserEntity : manages
    AccountRepository ..> Account : manages`
    },
    sequence: {
      id: 'diag-seq-1',
      projectId: 'proj-banking-core',
      type: 'sequence',
      title: 'Funds Transfer Execution Flow',
      description: 'Sequence of operations across presentation, domain, database, and external fraud gateway.',
      mermaidCode: `sequenceDiagram
    autonumber
    actor Client as Web/Mobile Client
    participant Ctrl as TransactionController
    participant Srv as TransactionService
    participant Repo as AccountRepository
    participant Fraud as FraudEngineClient
    participant DB as Oracle DB (FINCORE)
    participant MQ as IBM MQ Broker

    Client->>Ctrl: POST /api/v1/transactions/transfer
    Ctrl->>Srv: processTransfer(TransferRequest)
    Note over Srv,DB: @Transactional(SERIALIZABLE)
    Srv->>Repo: findByAccountNumber(sourceAccount)
    Repo->>DB: SELECT * FROM ACCOUNTS FOR UPDATE
    DB-->>Repo: Return Account Row [Locked]
    Repo-->>Srv: Account Entity
    
    Srv->>Fraud: POST /v2/score-risk (amount, account)
    Fraud-->>Srv: Risk Score: 0.04 (APPROVED)

    Srv->>Repo: updateBalances(source, target, amount)
    Repo->>DB: UPDATE ACCOUNTS SET BALANCE = ...
    Repo->>DB: INSERT INTO LEDGER_ENTRIES (...)
    DB-->>Repo: Commit Complete
    Repo-->>Srv: OK

    Srv->>MQ: publishEvent("FINCORE.TX.PROCESSED", txId)
    MQ-->>Srv: ACK
    
    Srv-->>Ctrl: TransferResult(txId, "SUCCESS")
    Ctrl-->>Client: 200 OK (Transfer Confirmation)`
    },
    component: {
      id: 'diag-comp-1',
      projectId: 'proj-banking-core',
      type: 'component',
      title: 'System Component & Container Boundary Diagram',
      description: 'High-level component topology including API Gateways, Service Containers, and Database clusters.',
      mermaidCode: `graph TB
    subgraph Client Tier
        Web["Single Page Application (SPA)"]
        Mobile["Mobile Banking App"]
    end

    subgraph API Gateway & Security
        Nginx["Reverse Proxy / NGINX"]
        JWTFilter["Spring Security JWT Filter"]
    end

    subgraph Core Spring Boot Application
        CtrlLayer["REST Presentation Controllers"]
        SrvLayer["Transactional Business Logic"]
        DataLayer["Hibernate / JPA Repositories"]
    end

    subgraph Data & Messaging Tier
        OracleDB[("Oracle 19c Enterprise RAC")]
        RedisCache[("Redis Session Cache")]
        IBMMQ[("IBM MQ 9.2 Event Broker")]
    end

    subgraph External Systems
        FraudGateway["Fraud Scoring Microservice"]
        Mainframe["Legacy Core Mainframe (SOAP)"]
    end

    Web --> Nginx
    Mobile --> Nginx
    Nginx --> JWTFilter
    JWTFilter --> CtrlLayer
    CtrlLayer --> SrvLayer
    SrvLayer --> DataLayer
    SrvLayer --> FraudGateway
    SrvLayer --> IBMMQ
    IBMMQ --> Mainframe
    DataLayer --> OracleDB
    CtrlLayer -.-> RedisCache`
    },
    flow: {
      id: 'diag-flow-1',
      projectId: 'proj-banking-core',
      type: 'flow',
      title: 'Transaction Validation & Decision Tree Flow',
      description: 'Algorithmic flow for processing transfer validations, fraud checks, and retry mechanisms.',
      mermaidCode: `flowchart TD
    Start([Receive Transfer Request]) --> ValidateReq{Is JSON Payload Valid?}
    ValidateReq -- No --> Return400[Return 400 Bad Request]
    ValidateReq -- Yes --> CheckAuth{Is JWT Token Valid?}
    CheckAuth -- No --> Return401[Return 401 Unauthorized]
    CheckAuth -- Yes --> LockAccount[Pessimistic Lock on Source Account]
    LockAccount --> BalanceCheck{Source Balance >= Amount + Fee?}
    BalanceCheck -- No --> Return422[Return 422 Insufficient Funds]
    BalanceCheck -- Yes --> CallFraud[Call Fraud Detection Engine]
    CallFraud --> FraudCheck{Risk Score < 0.85?}
    FraudCheck -- No --> FlagReview[Flag for Manual Compliance Review]
    FraudCheck -- Yes --> PostLedger[Debit Source & Credit Target in DB]
    PostLedger --> EmitMQ[Publish Async JMS Event to IBM MQ]
    EmitMQ --> CommitTx[Commit DB Transaction]
    CommitTx --> Success([Return 200 OK Success])`
    }
  };

  getDiagram(type: UMLType, projectId = 'proj-banking-core'): Observable<UMLDiagram> {
    const diag = this.diagrams[type] || this.diagrams.class;
    return of(diag).pipe(delay(200));
  }

  getAllDiagrams(projectId = 'proj-banking-core'): Observable<UMLDiagram[]> {
    return of(Object.values(this.diagrams)).pipe(delay(250));
  }
}
