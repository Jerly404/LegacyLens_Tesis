import { Injectable, inject } from '@angular/core';
import { ArchitectureAnalysis, AIRecommendation } from '@codelens/shared';
import { ProjectService } from '../projects/project.service';
import { TranslationService } from '../i18n/translation.service';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ArchitectureService {
  private projectService = inject(ProjectService);
  private translationService = inject(TranslationService);

  private generateAnalysis(): ArchitectureAnalysis {
    const proj = this.projectService.selectedProject();
    const isEs = this.translationService.isSpanish();
    const isMindguard = (proj.name || '').toLowerCase().includes('mindguard') || (proj.slug || '').includes('mindguard') || (proj.name || '').toLowerCase().includes('quality');
    const isEHR = (proj.name || '').toLowerCase().includes('ehr') || (proj.name || '').toLowerCase().includes('clinical') || (proj.name || '').toLowerCase().includes('patient');
    const isPython = (proj.mainLanguage || '').toLowerCase() === 'python' || isMindguard || isEHR;

    const name = proj.name || (isMindguard ? 'MindGuard — Software Quality & Mental Health Platform' : (isEHR ? 'Clinical Electronic Health Record (EHR) API' : 'E-Commerce Order Management Microservice'));
    const arch = proj.architecture || 'Layered Architecture';

    if (isMindguard) {
      return {
        id: `arch-${proj.id}`,
        projectId: proj.id,
        type: 'Layered',
        confidence: 96,
        summary: `Arquitectura en Capas (${arch}) con Enrutadores FastAPI, Servicios Psicométricos de IA y Persistencia SQLAlchemy.`,
        explanation: `La plataforma ${name} implementa una arquitectura desacoplada en capas. La capa de presentación (backend/app/api/assessments.py y auth.py) recibe los cuestionarios PHQ-9 y GAD-7, los delega a los servicios de evaluación clínica e inteligencia artificial (backend/app/services/clinical_ai.py) que integran Google Gemini y Groq, y almacena las evaluaciones en la base de datos mediante modelos SQLAlchemy (backend/app/models/base.py).`,
        evidence: [
          {
            title: 'Separación Modular de Endpoints y Servicios Clínicos',
            description: 'Inyección de dependencias con Depends(get_db) y Depends(get_current_user) para aislar la autenticación y las transacciones.',
            files: ['backend/app/api/assessments.py', 'backend/app/services/clinical_ai.py', 'backend/app/api/deps.py'],
            confidence: 97
          },
          {
            title: 'Modelado Relacional de Usuarios y Evaluaciones Psicométricas',
            description: 'Esquema SQLAlchemy normalizado con relaciones 1:N entre Usuario, Evaluacion, RegistroEmocional y Cita.',
            files: ['backend/app/models/base.py'],
            confidence: 96
          },
          {
            title: 'Integración Multi-Modelo de Inteligencia Artificial',
            description: 'Servicio clínico desacoplado que soporta inferencia híbrida (Google Gemini 1.5, Groq y Qwen 2.5 local).',
            files: ['backend/app/services/clinical_ai.py', 'backend/app/services/assessment_ai.py'],
            confidence: 95
          }
        ],
        components: [
          {
            name: 'Capa de Enrutamiento API (FastAPI)',
            type: 'API Router',
            role: 'Controladores de autenticación, evaluaciones y chat',
            responsibilities: ['Validar payloads con Pydantic', 'Verificar tokens JWT con OAuth2PasswordBearer', 'Manejar excepciones HTTP'],
            filePatterns: ['backend/app/api/*.py'],
            layer: 'Presentation'
          },
          {
            name: 'Capa de Servicios de Dominio e IA',
            type: 'Domain & AI Service',
            role: 'Lógica clínica, cálculo PHQ-9/GAD-7 e inferencia LLM',
            responsibilities: ['Calcular puntajes psicométricos', 'Evaluar umbrales de riesgo clínico', 'Generar diagnósticos con LLM'],
            filePatterns: ['backend/app/services/*.py'],
            layer: 'Business Logic'
          },
          {
            name: 'Capa de Modelos y Persistencia (SQLAlchemy)',
            type: 'ORM & Database Layer',
            role: 'Mapeo de datos relacionales y gestión de sesiones',
            responsibilities: ['Persistir usuarios y evaluaciones', 'Gestionar transacciones ACID', 'Control de integridad referencial'],
            filePatterns: ['backend/app/models/*.py', 'backend/app/core/database.py'],
            layer: 'Persistence'
          }
        ],
        layers: [
          {
            name: 'Capa de Presentación Web & API',
            description: 'Frontend Angular 17 y Enrutadores REST FastAPI.',
            components: ['assessments.py', 'auth.py', 'chat.py'],
            dependsOn: ['Capa de Servicios de Dominio e IA']
          },
          {
            name: 'Capa de Servicios de Dominio e IA',
            description: 'Servicios de evaluación psicométrica y llamadas a modelos de IA.',
            components: ['clinical_ai.py', 'assessment_ai.py', 'business_services.py'],
            dependsOn: ['Capa de Persistencia']
          },
          {
            name: 'Capa de Persistencia',
            description: 'Modelos relacionales SQLAlchemy y motor SQLite / PostgreSQL.',
            components: ['Usuario', 'Evaluacion', 'RegistroEmocional', 'ResultadoIA'],
            dependsOn: []
          }
        ],
        risks: [
          'Dependencia de APIs externas (Gemini/Groq) que podrían presentar latencia o indisponibilidad sin fallback local',
          'Almacenamiento de respuestas psicométricas en texto plano sin cifrado a nivel de columna en base de datos',
          'Falta de limitación de tasa de peticiones (Rate Limiting) en el endpoint público de autenticación'
        ]
      };
    }

    if (isPython) {
      if (isEs) {
        return {
          id: `arch-${proj.id}`,
          projectId: proj.id,
          type: 'Layered',
          confidence: proj.confidence || 95,
          summary: `Arquitectura en Capas (${arch}) asíncrona con separación entre Enrutadores FastAPI, Servicios de Dominio y Repositorios SQLAlchemy 2.0.`,
          explanation: `El microservicio ${name} implementa una arquitectura modular no bloqueante. Las peticiones HTTP ingresan a través del enrutador FastAPI (src/api/patients_router.py) con validación estricta de esquemas Pydantic, se delegan a la capa de servicios (src/services/patient_service.py) para verificación biométrica y se persisten de forma asíncrona mediante repositorios SQLAlchemy (src/repositories/patient_repository.py).`,
          evidence: [
            {
              title: 'Separación por Capas con Inyección de Dependencias',
              description: 'Uso de Depends(get_service) y Depends(get_db) para desacoplar completamente las capas de transporte, negocio y datos.',
              files: ['src/api/patients_router.py', 'src/services/patient_service.py', 'src/repositories/patient_repository.py'],
              confidence: 97
            },
            {
              title: 'Patrón Repositorio y Mapeo Asíncrono (Async ORM)',
              description: 'Encapsulamiento de transacciones SQLAlchemy con selectinload para carga eficiente de registros clínicos.',
              files: ['src/repositories/patient_repository.py', 'src/models/patient.py', 'src/models/clinical_record.py'],
              confidence: 95
            },
            {
              title: 'Contratos Fuertemente Tipados (DTOs Pydantic)',
              description: 'Modelos de validación PatientCreate, PatientResponse y ClinicalRecordCreate que aíslan las entidades de la API pública.',
              files: ['src/schemas/patient_dto.py'],
              confidence: 94
            }
          ],
          components: [
            {
              name: 'Capa de Enrutamiento API (FastAPI)',
              type: 'API Router',
              role: 'Recepción de solicitudes HTTP y validación de DTOs',
              responsibilities: ['Validar esquemas Pydantic', 'Enrutar endpoints de pacientes', 'Manejo de excepciones HTTPException'],
              filePatterns: ['src/api/*.py'],
              layer: 'Presentation'
            },
            {
              name: 'Capa de Servicios Clínicos (Dominio)',
              type: 'Service Layer',
              role: 'Reglas de negocio y validación de telemetría',
              responsibilities: ['Validar unicidad de MRN', 'Verificar rangos de presión arterial y pulso', 'Coordinar transacciones'],
              filePatterns: ['src/services/*.py'],
              layer: 'Business Logic'
            },
            {
              name: 'Capa de Repositorios (SQLAlchemy Async)',
              type: 'Async ORM Layer',
              role: 'Consultas asíncronas y persistencia relacional',
              responsibilities: ['Consultas por ID y MRN', 'Carga anticipada de relaciones (Eager Loading)', 'Gestión del pool de conexiones'],
              filePatterns: ['src/repositories/*.py', 'src/models/*.py'],
              layer: 'Persistence'
            }
          ],
          layers: [
            {
              name: 'Capa de Presentación',
              description: 'Enrutador FastAPI que gestiona las peticiones REST de historiales clínicos.',
              components: ['patients_router.py'],
              dependsOn: ['Capa de Servicios Clínicos']
            },
            {
              name: 'Capa de Servicios Clínicos',
              description: 'Servicio de dominio que ejecuta validaciones de telemetría y reglas médicas.',
              components: ['patient_service.py'],
              dependsOn: ['Capa de Repositorios']
            },
            {
              name: 'Capa de Repositorios',
              description: 'Repositorio asíncrono con sesiones AsyncSession y driver asyncpg.',
              components: ['patient_repository.py'],
              dependsOn: ['Base de Datos PostgreSQL']
            },
            {
              name: 'Modelos de Dominio',
              description: 'Entidades relacionales Patient y ClinicalRecord.',
              components: ['Patient', 'ClinicalRecord'],
              dependsOn: []
            }
          ],
          risks: [
            'Falta de autenticación JWT y control de acceso basado en roles (RBAC) en los endpoints clínicos',
            'Ausencia de alertas automáticas para valores de telemetría biométrica fuera de rango crítico',
            'Falta de migraciones automáticas con Alembic configuradas en el pipeline de despliegue'
          ]
        };
      }

      // English Python EHR
      return {
        id: `arch-${proj.id}`,
        projectId: proj.id,
        type: 'Layered',
        confidence: proj.confidence || 95,
        summary: `Asynchronous Layered Architecture with FastAPI routers, domain services, and SQLAlchemy 2.0 repositories.`,
        explanation: `The microservice ${name} adheres to an async non-blocking layered architecture. HTTP requests arrive through FastAPI router (src/api/patients_router.py) with Pydantic validation, delegate to domain services (src/services/patient_service.py) for telemetry verification, and persist via async SQLAlchemy repositories (src/repositories/patient_repository.py).`,
        evidence: [
          {
            title: 'Layered Separation with Dependency Injection',
            description: 'Usage of Depends(get_service) and Depends(get_db) isolating presentation, business, and persistence layers.',
            files: ['src/api/patients_router.py', 'src/services/patient_service.py', 'src/repositories/patient_repository.py'],
            confidence: 97
          },
          {
            title: 'Repository Pattern & Async ORM Mapping',
            description: 'Encapsulation of SQLAlchemy transactions using selectinload to optimize relational queries.',
            files: ['src/repositories/patient_repository.py', 'src/models/patient.py', 'src/models/clinical_record.py'],
            confidence: 95
          },
          {
            title: 'Strongly Typed DTO Contracts (Pydantic v2)',
            description: 'Validation schemas PatientCreate, PatientResponse, and ClinicalRecordCreate isolating entities from public API.',
            files: ['src/schemas/patient_dto.py'],
            confidence: 94
          }
        ],
        components: [
          {
            name: 'API Routing Layer (FastAPI)',
            type: 'API Router',
            role: 'HTTP request handling and Pydantic validation',
            responsibilities: ['Validate schemas', 'Route endpoints', 'Handle HTTP exceptions'],
            filePatterns: ['src/api/*.py'],
            layer: 'Presentation'
          },
          {
            name: 'Clinical Domain Services',
            type: 'Service Layer',
            role: 'Clinical business logic and telemetry validation',
            responsibilities: ['Validate MRN uniqueness', 'Check blood pressure ranges', 'Coordinate transactions'],
            filePatterns: ['src/services/*.py'],
            layer: 'Business Logic'
          },
          {
            name: 'Repository Layer (SQLAlchemy Async)',
            type: 'Async ORM Layer',
            role: 'Asynchronous queries and PostgreSQL persistence',
            responsibilities: ['Query by ID/MRN', 'Eager loading of records', 'Connection pool management'],
            filePatterns: ['src/repositories/*.py', 'src/models/*.py'],
            layer: 'Persistence'
          }
        ],
        layers: [
          {
            name: 'Presentation Layer',
            description: 'FastAPI router managing REST health record requests.',
            components: ['patients_router.py'],
            dependsOn: ['Clinical Domain Services']
          },
          {
            name: 'Clinical Domain Services',
            description: 'Domain service executing medical validation rules.',
            components: ['patient_service.py'],
            dependsOn: ['Repository Layer']
          },
          {
            name: 'Repository Layer',
            description: 'Async repository with AsyncSession and asyncpg driver.',
            components: ['patient_repository.py'],
            dependsOn: ['PostgreSQL Database']
          },
          {
            name: 'Domain Models',
            description: 'Patient and ClinicalRecord relational entities.',
            components: ['Patient', 'ClinicalRecord'],
            dependsOn: []
          }
        ],
        risks: [
          'Missing JWT authentication and RBAC role validation on clinical endpoints',
          'Lack of automated alerts for telemetry values exceeding critical thresholds',
          'Absence of automated database migrations with Alembic in CI/CD pipeline'
        ]
      };
    }

    // Java / E-Commerce Architecture Analysis
    const isJava = (proj.mainLanguage || '').toLowerCase() === 'java' || 
                   (proj.name || '').toLowerCase().includes('ecommerce') || 
                   (proj.name || '').toLowerCase().includes('order');

    if (isJava) {
      if (isEs) {
        return {
          id: `arch-${proj.id}`,
          projectId: proj.id,
          type: 'Layered',
          confidence: proj.confidence || 96,
          summary: `Arquitectura en Capas Estricta (Layered Architecture) con Controladores Spring Boot REST, Lógica Transaccional de Checkout y Persistencia Relacional con Spring Data JPA.`,
          explanation: `El microservicio ${name} implementa el patrón clásico en capas de grado empresarial para procesamiento de órdenes. Las peticiones HTTP ingresan por el controlador REST (src/controllers/OrderController.java), se procesan bajo fronteras transaccionales atómicas en la capa de servicios (src/services/OrderService.java) calculando subtotales con BigDecimal, y se persisten en cascada hacia PostgreSQL mediante el repositorio JPA (src/repositories/OrderRepository.java) sobre las entidades de dominio Order y OrderItem.`,
          projectName: 'ecommerce-order-service',
          moduleName: 'com.enterprise.ecommerce',
          inferenceItems: [
            {
              id: 'inf-1',
              module: 'com.enterprise.ecommerce.controllers',
              layer: 'Capa de Presentación (REST API Controllers)',
              component: 'OrderController & UsuarioController',
              responsibilities: [
                'Exposición de contratos RESTful HTTP (/api/v1/orders, /api/v1/usuarios)',
                'Deserialización JSON y validación sintáctica de DTOs de entrada',
                'Mapeo de respuestas con códigos de estado HTTP (201 Created, 200 OK, 404 Not Found)'
              ],
              associatedElements: [
                'OrderController.createOrder(OrderDTO)',
                'OrderController.getOrderById(UUID)',
                'UsuarioController.registrar(UsuarioRegistroDTO)'
              ],
              dependencies: [
                'OrderService (Inyección por constructor)',
                'UsuarioService (Inyección por constructor)'
              ],
              relations: 'Inversión de Control / Inyección de Dependencias (@Autowired)',
              evidence: [
                'src/controllers/OrderController.java: AST @RestController, @RequestMapping("/api/v1/orders")',
                'src/controllers/UsuarioController.java: AST @RestController, @PostMapping',
                'Ausencia de vistas servidor (.jsp / Thymeleaf): 100% API REST desacoplada'
              ],
              confidence: 98
            },
            {
              id: 'inf-2',
              module: 'com.enterprise.ecommerce.services',
              layer: 'Capa de Lógica de Negocio (Business Service Tier)',
              component: 'OrderService & UsuarioService',
              responsibilities: [
                'Delimitación transaccional ACID con rollback automático (@Transactional)',
                'Reglas de negocio críticas: validación de stock, cálculo con BigDecimal, hashing BCrypt',
                'Orquestación de operaciones de persistencia y despacho asíncrono de notificaciones'
              ],
              associatedElements: [
                'OrderService.processOrder(OrderDTO)',
                'OrderService.calculateTotals(List<OrderItem>)',
                'UsuarioService.registrarUsuario(UsuarioRegistroDTO)',
                'UsuarioService.buscarPorEmail(String)'
              ],
              dependencies: [
                'OrderRepository (Spring Data JPA)',
                'UsuarioRepository (Spring Data JPA)',
                'PasswordEncoder (BCrypt)',
                'NotificacionService'
              ],
              relations: 'Flujo descendente unidireccional hacia capa de persistencia',
              evidence: [
                'src/services/OrderService.java: AST @Service, @Transactional, invocación orderRepository.save()',
                'src/services/UsuarioService.java: AST @Service, @Transactional, validación existsByEmail()',
                'Grafo de llamadas: Cero dependencias hacia la capa de controladores (Strict Layering)'
              ],
              confidence: 97
            },
            {
              id: 'inf-3',
              module: 'com.enterprise.ecommerce.repositories',
              layer: 'Capa de Persistencia (Spring Data JPA Repositories)',
              component: 'OrderRepository & UsuarioRepository',
              responsibilities: [
                'Abstracción de operaciones CRUD sobre base de datos PostgreSQL',
                'Ejecución de consultas derivadas mediante convención de nombres de Spring Data JPA',
                'Gestión del contexto transaccional y pool de conexiones HikariCP'
              ],
              associatedElements: [
                'OrderRepository.findByCustomerId(UUID)',
                'OrderRepository.findByStatus(OrderStatus)',
                'UsuarioRepository.existsByEmail(String)',
                'UsuarioRepository.findByEmail(String)'
              ],
              dependencies: [
                'Entidades de Dominio (Order, Usuario)',
                'PostgreSQL / Driver HikariCP'
              ],
              relations: 'Especialización de interfaces: extends JpaRepository<T, ID>',
              evidence: [
                'src/repositories/OrderRepository.java: AST interface extends JpaRepository<Order, UUID>',
                'src/repositories/UsuarioRepository.java: AST interface extends JpaRepository<Usuario, UUID>',
                'Anotaciones @Repository y métodos de consulta derivada sin SQL acoplado'
              ],
              confidence: 96
            },
            {
              id: 'inf-4',
              module: 'com.enterprise.ecommerce.models',
              layer: 'Capa de Entidades de Dominio (Domain Entity Tier)',
              component: 'Order, OrderItem & Usuario',
              responsibilities: [
                'Representación canónica del modelo de datos relacional del negocio',
                'Garantía de integridad referencial mediante claves foráneas y restricciones únicas',
                'Mapeo de ciclo de vida en cascada y tipos inmutables (UUID, BigDecimal)'
              ],
              associatedElements: [
                'Order (id, orderNumber, totalAmount, status, items)',
                'OrderItem (id, productId, quantity, unitPrice)',
                'Usuario (id, nombre, email, passwordHash, rol)'
              ],
              dependencies: [
                'javax.persistence.* (JPA Specifications)',
                'Cero dependencias de capas superiores'
              ],
              relations: 'Relación bidireccional @OneToMany(cascade = ALL) entre Order y OrderItem',
              evidence: [
                'src/models/Order.java: AST @Entity, @Table(name = "orders"), @OneToMany',
                'src/models/OrderItem.java: AST @Entity, @ManyToOne(fetch = FetchType.LAZY)',
                'src/models/Usuario.java: AST @Entity, @Table(name = "usuarios"), @Column(unique = true)'
              ],
              confidence: 99
            }
          ],
          patternAudits: [
            {
              pattern: 'Layered Architecture (Arquitectura en Capas)',
              confidence: 96,
              status: 'CONCLUYENTE',
              decisionRationale: 'Separación estricta y unidireccional verificada entre Presentación, Negocio, Persistencia y Dominio. No se registran dependencias cíclicas ni violaciones de capas.'
            },
            {
              pattern: 'Microservices (Microservicio Autónomo)',
              confidence: 88,
              status: 'CONCLUYENTE',
              decisionRationale: 'Configuración Dockerfile autónoma, puerto HTTP 8080 acotado, persistencia PostgreSQL de esquema privado y bounded context de comercio electrónico delimitado.'
            },
            {
              pattern: 'Hexagonal / Clean Architecture (Puertos y Adaptadores)',
              confidence: 24,
              status: 'INSUFICIENTE',
              decisionRationale: 'Evidencia insuficiente: No se detectaron interfaces de puertos (ports/in, ports/out) ni adaptadores desacoplados de infraestructura. El dominio depende directamente de anotaciones de framework (@Entity, @Service). El sistema NO asigna este patrón automáticamente por falta de evidencia.',
              missingEvidence: [
                'Sin paquetes "ports" o "adapters" en la estructura del código',
                'Entidades acopladas a anotaciones JPA de infraestructura',
                'Servicios de aplicación acoplados a dependencias Spring (@Transactional)'
              ]
            },
            {
              pattern: 'Event-Driven Architecture (Dirigida por Eventos)',
              confidence: 12,
              status: 'INSUFICIENTE',
              decisionRationale: 'Evidencia insuficiente: El procesamiento de órdenes es completamente sincrónico. No se encontraron dependencias de Message Brokers (spring-kafka, spring-rabbit) ni suscriptores @EventListener en el AST. El sistema NO asigna este patrón automáticamente por falta de evidencia.',
              missingEvidence: [
                'Sin librerías de Message Broker en pom.xml',
                'Ausencia de productores de eventos o tópicos asíncronos',
                'Sin listeners reactivos o colas de mensajería'
              ]
            },
            {
              pattern: 'MVC Tradicional con Vistas Server-Side',
              confidence: 58,
              status: 'DESCARTADO',
              decisionRationale: 'Patrón descartado: Existen controladores y modelos, pero no se hallaron plantillas de renderizado de servidor (JSP, Thymeleaf). La capa de presentación opera puramente como API REST desacoplada.'
            }
          ],
          evidence: [
            {
              title: 'Controladores REST y Enrutamiento de Checkout',
              description: 'Mapeo declarativo con @RestController y @RequestMapping("/api/v1/orders") en OrderController.java. Endpoints de creación de pedidos (/checkout) y consulta por UUID (/orders/{orderId}).',
              files: ['src/controllers/OrderController.java'],
              confidence: 98
            },
            {
              title: 'Fronteras Transaccionales ACID y Lógica Financiera',
              description: 'Anotación @Transactional en OrderService.java garantizando la atomicidad en la creación de la orden, cálculo seguro de totales monetarios con BigDecimal para prevenir desbordamientos de precisión.',
              files: ['src/services/OrderService.java'],
              confidence: 97
            },
            {
              title: 'Mapeo Objeto-Relacional en Cascada (JPA Cascade)',
              description: 'Relación bidireccional @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true) entre la entidad Order y sus líneas de detalle OrderItem con claves foráneas.',
              files: ['src/models/Order.java', 'src/models/OrderItem.java'],
              confidence: 96
            },
            {
              title: 'Abstracción de Persistencia con Spring Data JPA',
              description: 'OrderRepository extendiendo JpaRepository<Order, UUID> para consultas optimizadas por customerId y status sin acoplar SQL al código de negocio.',
              files: ['src/repositories/OrderRepository.java'],
              confidence: 95
            }
          ],
          components: [
            {
              name: 'Capa de Controladores Web (Spring MVC)',
              type: 'REST Controller',
              role: 'Recepción de solicitudes HTTP, deserialización JSON y control de respuestas',
              responsibilities: ['Exponer /api/v1/orders/checkout y /api/v1/orders/{orderId}', 'Validar payloads con Jackson', 'Responder con códigos HTTP 200, 201 y 404'],
              filePatterns: ['src/controllers/*.java'],
              layer: 'Presentation'
            },
            {
              name: 'Capa de Servicios de Aplicación (Spring Service)',
              type: 'Transactional Service',
              role: 'Orquestación del flujo de compra y reglas de negocio',
              responsibilities: ['Calcular total monetario acumulando items', 'Gestionar transacciones ACID con @Transactional', 'Actualizar estado de la orden a PROCESSING'],
              filePatterns: ['src/services/*.java'],
              layer: 'Business Logic'
            },
            {
              name: 'Capa de Acceso a Datos (Spring Data JPA)',
              type: 'Data Repository',
              role: 'Consultas y persistencia relacional en PostgreSQL',
              responsibilities: ['Persistir agregados Order y OrderItem en cascada', 'Buscar órdenes por cliente y estado', 'Manejo del pool de conexiones HikariCP'],
              filePatterns: ['src/repositories/*.java'],
              layer: 'Persistence'
            },
            {
              name: 'Capa de Entidades del Dominio (JPA Entities)',
              type: 'Domain Entity',
              role: 'Modelo de datos relacional y lógica de integridad de la orden',
              responsibilities: ['Representar la cabecera de la orden y sus items', 'Garantizar claves foráneas e integridad referencial', 'Mapear tipos UUID y BigDecimal'],
              filePatterns: ['src/models/*.java'],
              layer: 'Domain'
            }
          ],
          layers: [
            {
              name: 'Capa de Presentación (REST API)',
              description: 'Expone la API HTTP mediante Spring Web MVC.',
              components: ['OrderController.java'],
              dependsOn: ['Capa de Lógica de Negocio']
            },
            {
              name: 'Capa de Lógica de Negocio',
              description: 'Coordina el proceso de checkout y cálculos de precios.',
              components: ['OrderService.java'],
              dependsOn: ['Capa de Persistencia (JPA)']
            },
            {
              name: 'Capa de Persistencia (JPA)',
              description: 'Repositorios de datos y persistencia en PostgreSQL.',
              components: ['OrderRepository.java'],
              dependsOn: ['Capa de Modelos de Dominio']
            },
            {
              name: 'Capa de Modelos de Dominio',
              description: 'Entidades relacionales Order y OrderItem.',
              components: ['Order.java', 'OrderItem.java'],
              dependsOn: []
            }
          ],
          risks: [
            'Exposición directa de entidades JPA en controladores: El endpoint /checkout recibe @RequestBody Order directamente, lo que crea riesgos de sobreescritura indebida de atributos internos (Mass Assignment).',
            'Falta de Bloqueo Concurrente (@Version): En picos de tráfico comercial, múltiples actualizaciones simultáneas pueden provocar condiciones de carrera sin Optimistic Locking.',
            'Ausencia de Autenticación JWT en Endpoints Públicos: Las rutas de órdenes no validan cabeceras Authorization: Bearer ni integran Spring Security.',
            'Acoplamiento Síncrono en Checkout: La confirmación de pedidos no emite eventos asíncronos hacia Kafka o RabbitMQ para desacoplar pasarela de pagos y logística.'
          ]
        };
      }

      // English Java E-Commerce
      return {
        id: `arch-${proj.id}`,
        projectId: proj.id,
        type: 'Layered',
        confidence: proj.confidence || 96,
        summary: `Strict N-Tier Layered Architecture with Spring Boot REST Controllers, Transactional Checkout Service, and Spring Data JPA Persistence.`,
        explanation: `The microservice ${name} implements enterprise-grade layered architecture for order processing. REST requests enter through OrderController.java, execute within atomic transaction boundaries in OrderService.java calculating totals with BigDecimal, and cascade-persist into PostgreSQL via OrderRepository.java.`,
        evidence: [
          {
            title: 'REST Controllers & Checkout Routing',
            description: 'Declarative endpoint mapping with @RestController and @RequestMapping("/api/v1/orders") in OrderController.java.',
            files: ['src/controllers/OrderController.java'],
            confidence: 98
          },
          {
            title: 'ACID Transaction Boundaries & Financial Calculation',
            description: '@Transactional annotation in OrderService.java enforcing atomicity, using BigDecimal for precise currency arithmetic.',
            files: ['src/services/OrderService.java'],
            confidence: 97
          },
          {
            title: 'JPA Cascading Object-Relational Mapping',
            description: 'Bidirectional @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true) between Order and OrderItem entities.',
            files: ['src/models/Order.java', 'src/models/OrderItem.java'],
            confidence: 96
          },
          {
            title: 'Persistence Abstraction with Spring Data JPA',
            description: 'OrderRepository interface extending JpaRepository<Order, UUID> for optimized queries without hardcoded SQL.',
            files: ['src/repositories/OrderRepository.java'],
            confidence: 95
          }
        ],
        components: [
          {
            name: 'Web Controller Tier (Spring MVC)',
            type: 'REST Controller',
            role: 'HTTP request handling, JSON deserialization, response formatting',
            responsibilities: ['Expose /api/v1/orders/checkout and /api/v1/orders/{orderId}', 'Jackson serialization', 'HTTP 200/201/404 responses'],
            filePatterns: ['src/controllers/*.java'],
            layer: 'Presentation'
          },
          {
            name: 'Application Service Tier (Spring Service)',
            type: 'Transactional Service',
            role: 'Checkout orchestration and business rules execution',
            responsibilities: ['Compute total order amount', 'Manage ACID transactions with @Transactional', 'Update order status to PROCESSING'],
            filePatterns: ['src/services/*.java'],
            layer: 'Business Logic'
          },
          {
            name: 'Data Access Tier (Spring Data JPA)',
            type: 'Data Repository',
            role: 'Relational querying and PostgreSQL persistence',
            responsibilities: ['Persist Order and OrderItem aggregates in cascade', 'Query by customer and status', 'Manage HikariCP connection pool'],
            filePatterns: ['src/repositories/*.java'],
            layer: 'Persistence'
          },
          {
            name: 'Domain Entity Tier (JPA Entities)',
            type: 'Domain Entity',
            role: 'Relational data model and domain invariants',
            responsibilities: ['Represent order headers and line items', 'Enforce foreign key constraints', 'Handle UUID and BigDecimal types'],
            filePatterns: ['src/models/*.java'],
            layer: 'Domain'
          }
        ],
        layers: [
          {
            name: 'Presentation Layer (REST API)',
            description: 'Exposes HTTP REST API via Spring Web MVC.',
            components: ['OrderController.java'],
            dependsOn: ['Application Service Layer']
          },
          {
            name: 'Application Service Layer',
            description: 'Coordinates checkout workflow and pricing rules.',
            components: ['OrderService.java'],
            dependsOn: ['Persistence Layer (JPA)']
          },
          {
            name: 'Persistence Layer (JPA)',
            description: 'Spring Data JPA repositories connected to PostgreSQL.',
            components: ['OrderRepository.java'],
            dependsOn: ['Domain Entity Layer']
          },
          {
            name: 'Domain Entity Layer',
            description: 'Order and OrderItem relational entities.',
            components: ['Order.java', 'OrderItem.java'],
            dependsOn: []
          }
        ],
        risks: [
          'Direct exposure of JPA entities in REST controllers (@RequestBody Order) introduces mass assignment vulnerabilities.',
          'Lack of optimistic locking (@Version) may cause race conditions under high concurrent checkout traffic.',
          'Missing JWT Bearer authentication on public order endpoints.',
          'Synchronous checkout coupling without event-driven messaging (Kafka / RabbitMQ).'
        ]
      };
    }

    // Generic Enterprise Fallback with rich default structure
    return {
      id: `arch-${proj.id}`,
      projectId: proj.id,
      type: 'Layered',
      confidence: 94,
      summary: `Layered Architecture with decoupled Controllers, Services, and Data Access Repositories.`,
      explanation: `Enterprise multi-tier architecture for ${name} maintaining separation of concerns across presentation, business logic, and persistence layers.`,
      evidence: [
        {
          title: 'Layered Separation of Concerns',
          description: 'Distinct separation between API transport layer and data persistence repositories.',
          files: ['src/controllers', 'src/services', 'src/repositories'],
          confidence: 94
        }
      ],
      components: [
        {
          name: 'Presentation Layer',
          type: 'API Controller',
          role: 'HTTP routing and contract serialization',
          responsibilities: ['Handle incoming requests', 'Validate input payloads'],
          filePatterns: ['src/controllers/*'],
          layer: 'Presentation'
        },
        {
          name: 'Service Layer',
          type: 'Domain Service',
          role: 'Core business logic and transactional orchestration',
          responsibilities: ['Execute business rules', 'Coordinate repository calls'],
          filePatterns: ['src/services/*'],
          layer: 'Business Logic'
        },
        {
          name: 'Persistence Layer',
          type: 'Repository',
          role: 'Database access and query execution',
          responsibilities: ['Execute CRUD queries', 'Manage database connection'],
          filePatterns: ['src/repositories/*'],
          layer: 'Persistence'
        }
      ],
      layers: [
        {
          name: 'Presentation Layer',
          description: 'Handles HTTP requests and responses.',
          components: ['Controllers'],
          dependsOn: ['Service Layer']
        },
        {
          name: 'Service Layer',
          description: 'Orchestrates business workflows.',
          components: ['Services'],
          dependsOn: ['Persistence Layer']
        },
        {
          name: 'Persistence Layer',
          description: 'Communicates with the underlying relational database.',
          components: ['Repositories'],
          dependsOn: []
        }
      ],
      risks: [
        'Ensure input payload sanitization and authentication across all public endpoints.',
        'Consider connection pooling optimizations and automated database migrations.'
      ]
    };
  }

  private generateRecommendations(): AIRecommendation[] {
    const proj = this.projectService.selectedProject();
    const isEs = this.translationService.isSpanish();
    const isMindguard = (proj.name || '').toLowerCase().includes('mindguard') || (proj.slug || '').includes('mindguard') || (proj.name || '').toLowerCase().includes('quality');
    const isEHR = (proj.name || '').toLowerCase().includes('ehr') || (proj.name || '').toLowerCase().includes('clinical') || (proj.name || '').toLowerCase().includes('patient');
    const isJava = (proj.mainLanguage || '').toLowerCase() === 'java' || 
                   (proj.name || '').toLowerCase().includes('ecommerce') || 
                   (proj.name || '').toLowerCase().includes('order');

    if (isMindguard) {
      return [
        {
          id: 'rec-mg-1',
          projectId: proj.id,
          title: 'Implementar Fallback Local con Ollama para Inferencia Psicométrica',
          severity: 'HIGH',
          category: 'PERFORMANCE',
          file: 'backend/app/services/clinical_ai.py',
          lineRange: 'L35-L65',
          explanation: 'La llamada a las APIs de Google Gemini y Groq puede fallar o exceder las cuotas de red. Un fallback local garantiza disponibilidad continua.',
          recommendation: 'Capturar excepciones de red y redirigir el prompt hacia el daemon local de Ollama (http://localhost:11434/api/generate) con Qwen 2.5 Coder.'
        },
        {
          id: 'rec-mg-2',
          projectId: proj.id,
          title: 'Cifrado de Datos Psicométricos Sensibles en Reposo',
          severity: 'HIGH',
          category: 'SECURITY',
          file: 'backend/app/models/base.py',
          lineRange: 'L55-L75',
          explanation: 'Los campos phq9_respuestas y notas_personales contienen información de salud altamente confidencial almacenada en texto plano.',
          recommendation: 'Integrar SQLAlchemy-Utils TypeDecorator con cifrado AES-256 (Fernet) para los campos de respuestas psicométricas.'
        },
        {
          id: 'rec-mg-3',
          projectId: proj.id,
          title: 'Añadir Limitador de Tasa (Rate Limiting) en Endpoints de Autenticación',
          severity: 'MEDIUM',
          category: 'SECURITY',
          file: 'backend/app/api/auth.py',
          lineRange: 'L15-L35',
          explanation: 'El endpoint /api/v1/auth/login no cuenta con límite de peticiones, lo que expone el sistema a ataques de fuerza bruta.',
          recommendation: 'Integrar middleware slowapi con decorador @limiter.limit("5/minute") sobre la ruta de inicio de sesión.'
        }
      ];
    }

    if (isEHR) {
      if (isEs) {
        return [
          {
            id: 'rec-1',
            projectId: proj.id,
            title: 'Implementar Autenticación OAuth2 / JWT con Roles Clínicos',
            severity: 'CRITICAL',
            category: 'SECURITY',
            file: 'src/api/patients_router.py',
            lineRange: 'L18-L45',
            explanation: 'Los endpoints de consulta y registro de historias clínicas no validan tokens de autorización.',
            recommendation: 'Añadir dependencia Security(get_current_active_doctor, scopes=["clinical:write"]).'
          },
          {
            id: 'rec-2',
            projectId: proj.id,
            title: 'Añadir Migraciones de Base de Datos con Alembic',
            severity: 'HIGH',
            category: 'MAINTAINABILITY',
            file: 'src/config/database.py',
            lineRange: 'L1-L25',
            explanation: 'El inicio de la aplicación utiliza Base.metadata.create_all.',
            recommendation: 'Configurar alembic.ini para gestionar migraciones de esquema versionadas.'
          }
        ];
      } else {
        return [
          {
            id: 'rec-1',
            projectId: proj.id,
            title: 'Implement OAuth2 / JWT Authentication with Clinical Roles',
            severity: 'CRITICAL',
            category: 'SECURITY',
            file: 'src/api/patients_router.py',
            lineRange: 'L18-L45',
            explanation: 'Endpoints handling clinical health records lack token-based authorization.',
            recommendation: 'Add Security(get_current_active_doctor, scopes=["clinical:write"]) dependency.'
          },
          {
            id: 'rec-2',
            projectId: proj.id,
            title: 'Add Versioned Database Migrations with Alembic',
            severity: 'HIGH',
            category: 'MAINTAINABILITY',
            file: 'src/config/database.py',
            lineRange: 'L1-L25',
            explanation: 'Application startup relies on Base.metadata.create_all.',
            recommendation: 'Configure alembic.ini to manage reproducible, version-controlled schema migrations.'
          }
        ];
      }
    }

    if (isJava) {
      if (isEs) {
        return [
          {
            id: 'rec-java-1',
            projectId: proj.id,
            title: 'Aislar Entidades JPA con DTOs de Petición (OrderCreateDTO)',
            severity: 'HIGH',
            category: 'SECURITY',
            file: 'src/controllers/OrderController.java',
            lineRange: 'L20-L40',
            explanation: 'El endpoint de checkout expone directamente la entidad @Entity Order en @RequestBody. Un atacante puede forzar valores en id, status ("COMPLETED") o totalAmount (vulnerabilidad de Mass Assignment).',
            recommendation: 'Crear OrderCreateRequest con Bean Validation (Jakarta @NotNull, @Positive) y mapearlo limpiamente a Order dentro del servicio.'
          },
          {
            id: 'rec-java-2',
            projectId: proj.id,
            title: 'Implementar Bloqueo Optimista (@Version) en la Entidad Order',
            severity: 'HIGH',
            category: 'PERFORMANCE',
            file: 'src/models/Order.java',
            lineRange: 'L15-L35',
            explanation: 'En entornos de alta concurrencia de comercio electrónico, compras y cancelaciones simultáneas pueden provocar inconsistencias de datos o ventas en exceso (overselling).',
            recommendation: 'Añadir el atributo @Version private Long version; en la clase Order para que Hibernate detecte colisiones concurrentes y lance OptimisticLockException.'
          },
          {
            id: 'rec-java-3',
            projectId: proj.id,
            title: 'Desacoplar Notificaciones de Pago mediante Eventos Asíncronos',
            severity: 'MEDIUM',
            category: 'ARCHITECTURE',
            file: 'src/services/OrderService.java',
            lineRange: 'L25-L50',
            explanation: 'La llamada a la pasarela de pagos y actualización de inventario bloquea el hilo HTTP de checkout del cliente, provocando cuellos de botella bajo carga.',
            recommendation: 'Inyectar ApplicationEventPublisher o un productor Kafka para emitir un evento OrderPlacedEvent y procesar la facturación de forma reactiva.'
          },
          {
            id: 'rec-java-4',
            projectId: proj.id,
            title: 'Proteger Endpoints con Spring Security y Tokens Bearer JWT',
            severity: 'CRITICAL',
            category: 'SECURITY',
            file: 'src/controllers/OrderController.java',
            lineRange: 'L10-L30',
            explanation: 'Los endpoints /api/v1/orders/{orderId} y /customer/{customerId} no validan credenciales de acceso, permitiendo a cualquier actor consultar pedidos ajenos (IDOR).',
            recommendation: 'Configurar SecurityFilterChain con validación de tokens JWT y restricción de lectura por UUID de usuario autenticado.'
          }
        ];
      } else {
        return [
          {
            id: 'rec-java-1',
            projectId: proj.id,
            title: 'Isolate JPA Entities with Dedicated DTOs (OrderCreateDTO)',
            severity: 'HIGH',
            category: 'SECURITY',
            file: 'src/controllers/OrderController.java',
            lineRange: 'L20-L40',
            explanation: 'The checkout endpoint directly binds @RequestBody Order. Malicious clients can manipulate internal fields like id or status (Mass Assignment vulnerability).',
            recommendation: 'Implement an OrderCreateRequest record with Jakarta Bean Validation (@NotNull, @Positive) and map to entity in service tier.'
          },
          {
            id: 'rec-java-2',
            projectId: proj.id,
            title: 'Implement Optimistic Locking (@Version) on Order Entity',
            severity: 'HIGH',
            category: 'PERFORMANCE',
            file: 'src/models/Order.java',
            lineRange: 'L15-L35',
            explanation: 'Concurrent checkout or cancellation operations can lead to overselling or lost updates without lock verification.',
            recommendation: 'Add @Version private Long version; to Order to enforce Hibernate optimistic concurrency checks.'
          },
          {
            id: 'rec-java-3',
            projectId: proj.id,
            title: 'Decouple Payment & Fulfillment via Asynchronous Events',
            severity: 'MEDIUM',
            category: 'ARCHITECTURE',
            file: 'src/services/OrderService.java',
            lineRange: 'L25-L50',
            explanation: 'Synchronous payment gateway interaction blocks the HTTP request thread, decreasing checkout throughput.',
            recommendation: 'Use ApplicationEventPublisher or Kafka producer to emit OrderPlacedEvent for asynchronous downstream processing.'
          }
        ];
      }
    }

    return [];
  }

  getAnalysis(projectId?: string): Observable<ArchitectureAnalysis> {
    return of(this.generateAnalysis()).pipe(delay(80));
  }

  getRecommendations(projectId?: string): Observable<AIRecommendation[]> {
    return of(this.generateRecommendations()).pipe(delay(80));
  }
}
