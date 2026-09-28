import { Injectable, inject } from '@angular/core';
import { UMLDiagram, UMLType, Project } from '@codelens/shared';
import { ProjectService } from '../projects/project.service';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DiagramService {
  private projectService = inject(ProjectService);

  getDiagram(type: UMLType, projectId?: string): Observable<UMLDiagram> {
    const targetProject = projectId ? this.projectService.projects().find(p => p.id === projectId || p.slug === projectId) : this.projectService.selectedProject();
    const projectName = targetProject?.name || 'Enterprise System';
    const isEcommerce = (projectName || '').toLowerCase().includes('ecommerce') || 
                        (projectName || '').toLowerCase().includes('order') || 
                        (targetProject?.mainLanguage || '').toLowerCase() === 'java';

    const diagramsMap: Record<UMLType, UMLDiagram> = {
      architecture: {
        id: `diag-arch-${Date.now()}`,
        projectId: targetProject?.id || 'proj-core',
        type: 'architecture',
        title: `Fullstack System Architecture — ${projectName}`,
        description: 'End-to-end multi-tier topology showing Client Apps, Ingress Gateway, Backend Domain Services, Database Clusters, and Message Brokers.',
        mermaidCode: isEcommerce ? `graph TB
    subgraph ClientLayer ["Client & Presentation Tier"]
        StoreWeb["Storefront Web Client (Angular SPA)"]
        MobileApp["Mobile Apps (iOS / Android)"]
        PartnerAPI["Marketplace Integrations & Webhooks"]
    end

    subgraph IngressGateway ["Security & Ingress Layer"]
        LoadBalancer["NGINX Ingress / Load Balancer (SSL Termination)"]
        AuthFilter["JWT / OAuth2 Security Gateway & Rate Limiter"]
    end

    subgraph BackendCore ["Backend Application Tier (Spring Boot 2.7)"]
        OrderController["REST API: OrderController.java"]
        OrderService["Domain Service: OrderService.java (@Transactional)"]
        OrderRepository["Data Access: OrderRepository.java (Spring Data JPA)"]
    end

    subgraph PersistenceTier ["Data & Caching Tier"]
        PostgreSQLDB[("PostgreSQL 16: orders & order_items")]
        RedisCache[("Redis 7: Catalog & Session Cache")]
    end

    subgraph MessagingTier ["Async Event & Queue Infrastructure"]
        KafkaBroker[("Kafka Event Broker: OrderPlacedEvent")]
    end

    subgraph ExternalIntegrations ["External Cloud Services"]
        PaymentGateway["Stripe / Payment Gateway"]
        LogisticsAPI["Shipping & Fulfillment Provider"]
        OllamaLocal["Ollama Local AI Daemon (11434)"]
    end

    StoreWeb --> LoadBalancer
    MobileApp --> LoadBalancer
    PartnerAPI --> LoadBalancer

    LoadBalancer --> AuthFilter
    AuthFilter --> OrderController

    OrderController --> OrderService
    OrderService --> OrderRepository
    OrderRepository --> PostgreSQLDB
    OrderService --> RedisCache
    OrderService --> KafkaBroker
    OrderService --> PaymentGateway
    OrderService --> LogisticsAPI
    OrderService --> OllamaLocal` : `graph TB
    subgraph ClientLayer ["Client & Presentation Tier"]
        WebApp["Web Client (Angular 20 SPA)"]
        MobileApp["Mobile Apps (iOS / Android)"]
        ThirdParty["Third-Party Partner API Consumers"]
    end

    subgraph IngressGateway ["Security & Ingress Layer"]
        LoadBalancer["NGINX Ingress / Load Balancer (SSL Termination)"]
        AuthFilter["JWT / OAuth2 Security Gateway & Rate Limiter"]
    end

    subgraph BackendCore ["Backend Application Tier"]
        APIControllers["REST API / WebSocket Controllers"]
        DomainServices["Domain Business Logic & Use Cases"]
        AuthModule["Identity & Access Management (IAM)"]
        ETLWorker["Async Background Task Workers"]
    end

    subgraph PersistenceTier ["Data & Caching Tier"]
        PrimaryDB[("Primary Relational Database (PostgreSQL / Oracle)")]
        ReplicaDB[("Read-Replica Database")]
        RedisCache[("Redis Distributed Cache & Session Store")]
    end

    subgraph MessagingTier ["Async Event & Queue Infrastructure"]
        MessageQueue[("Kafka / RabbitMQ Event Broker")]
    end

    subgraph ExternalIntegrations ["External Cloud Services"]
        PaymentGateway["Payment Processor / Bank Core"]
        CloudStorage["S3 / Blob Storage CDN"]
        NotificationGateway["Push / SMTP Mail Provider"]
    end

    WebApp --> LoadBalancer
    MobileApp --> LoadBalancer
    ThirdParty --> LoadBalancer

    LoadBalancer --> AuthFilter
    AuthFilter --> APIControllers

    APIControllers --> DomainServices
    APIControllers --> AuthModule
    DomainServices --> RedisCache
    DomainServices --> PrimaryDB
    PrimaryDB -.-> ReplicaDB
    DomainServices --> MessageQueue
    MessageQueue --> ETLWorker
    ETLWorker --> PrimaryDB

    DomainServices --> PaymentGateway
    DomainServices --> CloudStorage
    DomainServices --> NotificationGateway`
      },

      database: {
        id: `diag-db-${Date.now()}`,
        projectId: targetProject?.id || 'proj-core',
        type: 'database',
        title: `Entity-Relationship Database Schema (ERD) — ${projectName}`,
        description: 'Relational database schema with primary keys, foreign keys, cardinality relationships, and data types.',
        mermaidCode: isEcommerce ? `erDiagram
    CUSTOMERS ||--o{ ORDERS : "places"
    ORDERS ||--|{ ORDER_ITEMS : "contains"
    PRODUCTS ||--o{ ORDER_ITEMS : "referenced_by"

    CUSTOMERS {
        uuid id PK "Primary Key"
        varchar email "Unique Customer Email"
        varchar full_name "Customer Full Name"
        varchar shipping_address "Shipping Address"
        timestamp created_at "Registration Timestamp"
    }

    ORDERS {
        uuid id PK "Primary Key"
        uuid customer_id FK "References CUSTOMERS(id)"
        decimal total_amount "Order Total Amount"
        varchar status "PENDING | PROCESSING | CONFIRMED | CANCELLED"
        timestamp created_at "Order Date"
    }

    ORDER_ITEMS {
        uuid id PK "Primary Key"
        uuid order_id FK "References ORDERS(id)"
        uuid product_id FK "References PRODUCTS(id)"
        varchar product_sku "SKU Code"
        integer quantity "Purchased Units"
        decimal unit_price "Unit Sale Price"
    }

    PRODUCTS {
        uuid id PK "Primary Key"
        varchar sku "Unique Product SKU"
        varchar name "Catalog Product Name"
        decimal price "Current Price"
        integer stock_quantity "Available Stock Units"
    }` : `erDiagram
    USERS ||--o{ ACCOUNTS : "owns"
    USERS ||--o{ AUDIT_LOGS : "triggers"
    USERS ||--o{ USER_ROLES : "assigned"
    ROLES ||--o{ USER_ROLES : "grants"
    ACCOUNTS ||--o{ TRANSACTIONS : "source of"
    ACCOUNTS ||--o{ TRANSACTIONS : "destination of"
    TRANSACTIONS ||--|{ LEDGER_ENTRIES : "records"
    ACCOUNTS ||--o{ API_KEYS : "has"

    USERS {
        uuid id PK "Primary Key"
        varchar email "Unique Email"
        varchar username "Unique Username"
        varchar password_hash "Encrypted Password"
        varchar status "ACTIVE | SUSPENDED"
        timestamp created_at "Creation timestamp"
        timestamp updated_at "Update timestamp"
    }

    ROLES {
        int id PK "Primary Key"
        varchar name "ADMIN | DEVELOPER | VIEWER"
        varchar description "Permissions Scope"
    }

    USER_ROLES {
        uuid user_id FK "References USERS(id)"
        int role_id FK "References ROLES(id)"
    }

    ACCOUNTS {
        uuid id PK "Primary Key"
        uuid user_id FK "References USERS(id)"
        varchar account_number "Unique Account Number"
        decimal balance "Current Available Balance"
        varchar currency "USD | EUR | PEN"
        varchar status "OPEN | FROZEN | CLOSED"
        int version "Optimistic Lock Version"
        timestamp created_at "Created Date"
    }

    TRANSACTIONS {
        uuid id PK "Primary Key"
        varchar transaction_code "Unique Reference (TX-XXXX)"
        uuid source_account_id FK "References ACCOUNTS(id)"
        uuid destination_account_id FK "References ACCOUNTS(id)"
        decimal amount "Transfer Amount"
        varchar status "PENDING | COMPLETED | REJECTED"
        varchar idempotency_key "Unique Request Token"
        timestamp executed_at "Execution Time"
    }

    LEDGER_ENTRIES {
        uuid id PK "Primary Key"
        uuid transaction_id FK "References TRANSACTIONS(id)"
        uuid account_id FK "References ACCOUNTS(id)"
        varchar entry_type "DEBIT | CREDIT"
        decimal amount "Entry Value"
        decimal balance_after "Calculated Balance"
        timestamp posted_at "Ledger Post Time"
    }

    AUDIT_LOGS {
        uuid id PK "Primary Key"
        uuid user_id FK "Actor User ID"
        varchar action "CREATE | UPDATE | DELETE | AUTH"
        varchar resource "Resource Entity Name"
        varchar ip_address "Client IP Address"
        text details "Change Payload Details"
        timestamp timestamp "Event Timestamp"
    }`
      },

      c4: {
        id: `diag-c4-${Date.now()}`,
        projectId: targetProject?.id || 'proj-core',
        type: 'c4',
        title: `C4 Container & Architecture Model — ${projectName}`,
        description: 'Industry-standard C4 Container model illustrating software boundaries, runtime containers, and communication protocols.',
        mermaidCode: `graph TB
    subgraph EnterpriseBoundary ["Enterprise Infrastructure Boundary"]
        subgraph FrontendContainer ["Frontend Container [Angular 20 / TypeScript]"]
            UIComponents["UI Components & Pages (Tailwind CSS)"]
            StateServices["Signal-based State Services & RxJS"]
            ApiClient["HTTP API Client & WebSocket Gateway"]
        end

        subgraph BackendContainer ["Backend Container [NestJS / Node.js]"]
            RESTControllers["REST Controllers & Swagger Docs"]
            AuthGuard["JWT / RBAC Security Guards"]
            DomainService["Application & Domain Services Layer"]
            PrismaORM["Prisma ORM / Data Access Layer"]
        end

        subgraph StorageContainers ["Data & Persistence Containers"]
            PostgreSQLDB[("Database Container [PostgreSQL 16]")]
            RedisContainer[("Cache Container [Redis 7 Alpine]")]
        end

        subgraph LocalAIContainer ["Local AI Runtime Container"]
            OllamaEngine["Ollama Ingestion & Inference Daemon [GPU RTX 3050]"]
            QwenModel["Qwen 2.5 Coder 7B [32k Context GGUF]"]
        end
    end

    User(["Software Architect / Engineer"]) -->|HTTPS 443| UIComponents
    UIComponents --> StateServices
    StateServices --> ApiClient
    ApiClient -->|JSON / REST HTTP| RESTControllers

    RESTControllers --> AuthGuard
    AuthGuard --> DomainService
    DomainService --> PrismaORM
    DomainService -->|Read/Write Cache| RedisContainer
    PrismaORM -->|SQL Queries / TCP 5432| PostgreSQLDB

    DomainService -->|Inference Query / HTTP 11434| OllamaEngine
    OllamaEngine --> QwenModel`
      },

      class: {
        id: `diag-class-${Date.now()}`,
        projectId: targetProject?.id || 'proj-core',
        type: 'class',
        title: `Domain & Service Class Diagram — ${projectName}`,
        description: 'Reverse-engineered OOP class hierarchy with attributes, methods, visibility modifiers, and interface implementations.',
        mermaidCode: isEcommerce ? `classDiagram
    class OrderController {
        -OrderService orderService
        +createOrder(Order request) ResponseEntity
        +getOrder(UUID orderId) ResponseEntity
        +getCustomerOrders(UUID customerId) ResponseEntity
    }
    class OrderService {
        -OrderRepository orderRepository
        +processOrderCheckout(Order order) Order
        +findOrderById(UUID orderId) Optional
        +getOrdersByCustomer(UUID customerId) List
    }
    class OrderRepository {
        <<interface>>
        +findByCustomerId(UUID customerId) List
        +findByStatus(String status) List
        +save(Order order) Order
        +findById(UUID orderId) Optional
    }
    class Order {
        +UUID id
        +UUID customerId
        +BigDecimal totalAmount
        +String status
        +List~OrderItem~ items
        +LocalDateTime createdAt
    }
    class OrderItem {
        +UUID id
        +Order order
        +UUID productId
        +String productSku
        +Integer quantity
        +BigDecimal unitPrice
    }

    OrderController --> OrderService : delegates to
    OrderService --> OrderRepository : persists via
    Order "1" *-- "many" OrderItem : contains (cascade = ALL)` : `classDiagram
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
        id: `diag-seq-${Date.now()}`,
        projectId: targetProject?.id || 'proj-core',
        type: 'sequence',
        title: `End-to-End Transaction Sequence Flow — ${projectName}`,
        description: 'Chronological execution flow showing interactions between Client, Controller, Service, Database, and Broker.',
        mermaidCode: isEcommerce ? `sequenceDiagram
    autonumber
    actor Customer as Storefront Client
    participant Gateway as API Gateway & Auth Guard
    participant Ctrl as OrderController
    participant Srv as OrderService
    participant Repo as OrderRepository
    participant DB as PostgreSQL Database
    participant Cache as Redis Cache
    participant Broker as Kafka Broker

    Customer->>Gateway: POST /api/v1/orders/checkout
    Gateway->>Gateway: Validate Bearer JWT & Rate Limit
    Gateway->>Ctrl: Forward Order Payload
    Ctrl->>Srv: processOrderCheckout(order)
    
    Note over Srv,DB: Transaction BEGIN [@Transactional]
    Srv->>Cache: Check Inventory & SKU Price
    Cache-->>Srv: Valid Stock Available
    Srv->>Srv: Loop items & sum totalAmount with BigDecimal
    
    Srv->>Repo: save(order)
    Repo->>DB: INSERT INTO orders (id, customer_id, total_amount, status)
    Repo->>DB: INSERT INTO order_items (id, order_id, product_sku, qty, price)
    DB-->>Repo: Saved Entities (status = PROCESSING)
    Repo-->>Srv: Persisted Order Entity
    
    Srv->>Broker: publishEvent("OrderPlacedEvent", orderPayload)
    Broker-->>Srv: ACK
    
    Srv->>DB: COMMIT Transaction
    DB-->>Srv: Transaction Committed
    
    Srv-->>Ctrl: Return Created Order Entity
    Ctrl-->>Customer: 200 OK (Order JSON with UUID)` : `sequenceDiagram
    autonumber
    actor Client as Web / Mobile Client
    participant Gateway as API Gateway & Auth Guard
    participant Ctrl as TransactionController
    participant Srv as TransactionService
    participant Repo as AccountRepository
    participant DB as Relational Database
    participant Cache as Redis Cache
    participant Broker as Message Broker

    Client->>Gateway: POST /api/v1/transactions/transfer
    Gateway->>Gateway: Validate Bearer JWT & Rate Limit
    Gateway->>Ctrl: Forward Authorized Request
    Ctrl->>Srv: processTransfer(TransferRequest)
    
    Srv->>Cache: Check Idempotency Key (Cache GET)
    Cache-->>Srv: Key Not Found (Proceed)
    
    Note over Srv,DB: Transaction BEGIN [Isolation = Serializable]
    Srv->>Repo: lockAndFetchAccounts(source, target)
    Repo->>DB: SELECT * FROM ACCOUNTS WHERE ID IN (...) FOR UPDATE
    DB-->>Repo: Return Locked Account Rows
    Repo-->>Srv: Validated Account Entities
    
    Srv->>Repo: executeDebitAndCredit(source, target, amount)
    Repo->>DB: UPDATE ACCOUNTS SET BALANCE = ...
    Repo->>DB: INSERT INTO LEDGER_ENTRIES (...)
    DB-->>Repo: Rows Affected (2 updated, 1 inserted)
    
    Srv->>Broker: publishEvent("TRANSACTION_COMPLETED", payload)
    Broker-->>Srv: ACK Received
    
    Srv->>DB: COMMIT Transaction
    DB-->>Srv: Transaction Committed
    
    Srv->>Cache: Set Idempotency Key (TTL = 24h)
    Srv-->>Ctrl: TransferResult("SUCCESS", txId)
    Ctrl-->>Client: 200 OK (Transaction Confirmed)`
      },

      component: {
        id: `diag-comp-${Date.now()}`,
        projectId: targetProject?.id || 'proj-core',
        type: 'component',
        title: `Component & Module Boundary Diagram — ${projectName}`,
        description: 'Internal modular architecture showing boundaries, coupling, and subsystem contracts.',
        mermaidCode: `graph TB
    subgraph PresentationModule ["Presentation & API Module"]
        AuthController["Auth Controller"]
        ProjectController["Project Controller"]
        AnalysisController["Analysis Controller"]
        ReportController["Report Controller"]
    end

    subgraph ApplicationModule ["Application & Use Case Layer"]
        AuthService["Auth Application Service"]
        AnalysisPipeline["AST Analysis & Reverse Engineering Pipeline"]
        DocGenerator["Technical Documentation Generator"]
        UMLGenerator["UML & ERD Diagram Generator"]
        RAGService["Codebase RAG Query Engine"]
    end

    subgraph DomainCoreModule ["Domain Core Subsystem"]
        ProjectAggregate["Project Aggregate Root"]
        CodeFileEntity["Code File & AST Symbol Entity"]
        ArchitectureModel["Architecture Rules & Classifiers"]
    end

    subgraph InfrastructureModule ["Infrastructure & Adapters"]
        PrismaAdapter["Database Persistence Adapter"]
        OllamaAdapter["Local LLM AI Adapter (Ollama)"]
        StorageAdapter["File System & Archive Extractor"]
    end

    PresentationModule --> ApplicationModule
    ApplicationModule --> DomainCoreModule
    ApplicationModule --> InfrastructureModule`
      },

      deployment: {
        id: `diag-deploy-${Date.now()}`,
        projectId: targetProject?.id || 'proj-core',
        type: 'deployment',
        title: `Deployment & Infrastructure Topology — ${projectName}`,
        description: 'Containerized deployment infrastructure with Docker containers, networks, volumes, and hardware accelerators.',
        mermaidCode: `graph TB
    subgraph HostSystem ["Host Machine (Arch Linux / Docker Host)"]
        subgraph WebTier ["Docker Network: frontend-net"]
            FrontendContainer["Container: legacyai-frontend (Angular 20 / Nginx) :4200"]
        end

        subgraph BackendTier ["Docker Network: backend-net"]
            BackendContainer["Container: legacyai-backend (NestJS 10 API) :3000"]
            WorkerContainer["Container: legacyai-worker (Analysis Engine)"]
        end

        subgraph DataTier ["Docker Network: data-net"]
            PostgresContainer["Container: postgres:16-alpine :5432"]
            RedisContainer["Container: redis:7-alpine :6379"]
            DBVolume[("Persistent Docker Volume: pgdata")]
        end

        subgraph LocalHardware ["Hardware Acceleration Tier"]
            GPUDevice["NVIDIA GeForce RTX 3050 (4GB VRAM / CUDA 13.3)"]
            OllamaDaemon["Host Service: Ollama Daemon :11434"]
        end
    end

    FrontendContainer -->|REST / WS| BackendContainer
    BackendContainer --> WorkerContainer
    BackendContainer --> PostgresContainer
    BackendContainer --> RedisContainer
    WorkerContainer --> PostgresContainer
    PostgresContainer --- DBVolume

    WorkerContainer -->|Inference HTTP| OllamaDaemon
    BackendContainer -->|Inference HTTP| OllamaDaemon
    OllamaDaemon --> GPUDevice`
      },

      flow: {
        id: `diag-flow-${Date.now()}`,
        projectId: targetProject?.id || 'proj-core',
        type: 'flow',
        title: `Business Process & Decision Flow — ${projectName}`,
        description: 'Algorithmic decision tree representing core validation logic and failure recovery branches.',
        mermaidCode: `flowchart TD
    Start([Receive Transaction / Request]) --> CheckAuth{Is Authenticated & Authorized?}
    CheckAuth -- No --> ErrAuth[Return 401 Unauthorized]
    CheckAuth -- Yes --> ValidateSchema{Is Payload Valid Schema?}
    ValidateSchema -- No --> Err400[Return 400 Bad Request]
    ValidateSchema -- Yes --> AcquireLock[Acquire DB Lock on Resource]
    AcquireLock --> CheckBusinessRules{Passes Business & Balance Rules?}
    CheckBusinessRules -- No --> ReleaseLock[Release Lock & Return 422 Unprocessable]
    CheckBusinessRules -- Yes --> ExecuteWrite[Write DB Changes & Ledger Log]
    ExecuteWrite --> EmitEvent[Emit Async Event to Message Broker]
    EmitEvent --> CommitTx[Commit DB Transaction]
    CommitTx --> Success([Return 200 OK Response])`
      }
    };

    const diag = diagramsMap[type] || diagramsMap.architecture;
    return of(diag).pipe(delay(150));
  }

  getAllDiagrams(projectId?: string): Observable<UMLDiagram[]> {
    const targetProject = projectId ? this.projectService.projects().find(p => p.id === projectId || p.slug === projectId) : this.projectService.selectedProject();
    const list: UMLType[] = ['architecture', 'database', 'c4', 'class', 'sequence', 'component', 'deployment', 'flow'];
    const results = list.map(type => {
      let d: UMLDiagram;
      this.getDiagram(type, targetProject?.id).subscribe(diag => d = diag);
      return d!;
    });
    return of(results).pipe(delay(200));
  }
}
