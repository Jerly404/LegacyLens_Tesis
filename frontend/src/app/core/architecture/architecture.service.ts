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
    const name = proj.name || 'Microservicio de Órdenes';
    const lang = proj.mainLanguage || 'Java';
    const arch = proj.architecture || 'Layered Architecture';

    if (isEs) {
      return {
        id: `arch-${proj.id}`,
        projectId: proj.id,
        type: 'Layered',
        confidence: proj.confidence || 94,
        summary: `Arquitectura en Capas (${arch}) estricta con límites claros entre Controladores REST, Servicios de Dominio y Persistencia JPA.`,
        explanation: `El código fuente de ${name} sigue una arquitectura limpia en capas horizontales. La capa de presentación delega la lógica de negocio a los servicios de dominio transaccionales, los cuales a su vez interactúan con la base de datos relacional mediante repositorios JPA sin acoplamientos circulares.`,
        evidence: [
          {
            title: 'Separación de Responsabilidades por Capas',
            description: 'Estructura modular con anotaciones estandarizadas (@RestController, @Service, @Repository) que delimitan las fronteras de procesamiento.',
            files: ['src/controllers/OrderController.java', 'src/services/OrderService.java', 'src/repositories/OrderRepository.java'],
            confidence: 96
          },
          {
            title: 'Patrón Repositorio y Mapeo Relacional (ORM)',
            description: 'Interfaces que extienden Spring Data JpaRepository mapeando las entidades relacionales.',
            files: ['src/repositories/OrderRepository.java', 'src/models/Order.java'],
            confidence: 94
          },
          {
            title: 'Encapsulamiento Transaccional del Dominio',
            description: 'Métodos de negocio anotados con @Transactional para garantizar consistencia ACID en la persistencia de órdenes.',
            files: ['src/services/OrderService.java'],
            confidence: 92
          }
        ],
        components: [
          {
            name: 'Capa de Presentación (REST API)',
            type: 'API Controllers',
            role: 'Recepción de solicitudes HTTP y serialización JSON',
            responsibilities: ['Validar payloads de entrada', 'Enrutar checkout de órdenes', 'Devolver códigos HTTP estándar'],
            filePatterns: ['src/controllers/*.java'],
            layer: 'Presentation'
          },
          {
            name: 'Núcleo de Negocio (Servicios de Dominio)',
            type: 'Service Layer',
            role: 'Reglas de negocio y coordinación transaccional',
            responsibilities: ['Cálculo de importes y precios', 'Validación de ítems', 'Límites transaccionales @Transactional'],
            filePatterns: ['src/services/*.java'],
            layer: 'Business Logic'
          },
          {
            name: 'Capa de Persistencia y Datos',
            type: 'Spring Data & JPA',
            role: 'Mapeo y persistencia relacional',
            responsibilities: ['Operaciones CRUD', 'Consultas por cliente', 'Gestión de transacciones de base de datos'],
            filePatterns: ['src/repositories/*.java', 'src/models/*.java'],
            layer: 'Persistence'
          }
        ],
        layers: [
          {
            name: 'Capa de Presentación',
            description: 'Controladores Spring REST que gestionan las peticiones de los clientes web y móviles.',
            components: ['OrderController'],
            dependsOn: ['Capa de Servicios de Aplicación']
          },
          {
            name: 'Capa de Servicios de Aplicación',
            description: 'Servicios de negocio que implementan la lógica de checkout y cálculo monetario.',
            components: ['OrderService'],
            dependsOn: ['Capa de Persistencia']
          },
          {
            name: 'Capa de Persistencia',
            description: 'Repositorios JPA que interactúan con el esquema de base de datos relacional.',
            components: ['OrderRepository'],
            dependsOn: ['Base de Datos Relacional']
          },
          {
            name: 'Modelos de Dominio',
            description: 'Entidades relacionales que representan el modelo de datos maestro de órdenes.',
            components: ['Order', 'OrderItem'],
            dependsOn: []
          }
        ],
        risks: [
          'Exposición directa de entidades JPA en controladores en lugar de contratos DTO desacoplados',
          'Ausencia de bloqueo optimista (@Version) en la entidad Order para concurrencia de pagos',
          'Falta de anotaciones OpenAPI / Swagger en OrderController.java para documentación interactiva'
        ]
      };
    }

    // English version
    return {
      id: `arch-${proj.id}`,
      projectId: proj.id,
      type: 'Layered',
      confidence: proj.confidence || 94,
      summary: `Strict N-Tier Layered Architecture with clean boundaries across REST Controllers, Domain Services, and JPA Repositories.`,
      explanation: `The codebase of ${name} adheres to a classic layered design. Presentation controllers delegate domain logic to transactional application services, which in turn access relational data via Spring Data JPA repositories without circular dependencies.`,
      evidence: [
        {
          title: 'Layered Separation of Concerns',
          description: 'Modular package structures and Spring annotations (@RestController, @Service, @Repository) enforce tier boundaries.',
          files: ['src/controllers/OrderController.java', 'src/services/OrderService.java', 'src/repositories/OrderRepository.java'],
          confidence: 96
        },
        {
          title: 'Repository Pattern & ORM Mapping',
          description: 'Interfaces extending Spring Data JpaRepository mapping relational entities.',
          files: ['src/repositories/OrderRepository.java', 'src/models/Order.java'],
          confidence: 94
        },
        {
          title: 'Transactional Domain Encapsulation',
          description: 'Business methods annotated with @Transactional guaranteeing ACID consistency.',
          files: ['src/services/OrderService.java'],
          confidence: 92
        }
      ],
      components: [
        {
          name: 'Presentation Tier (REST API)',
          type: 'API Controllers',
          role: 'HTTP Request Handling & Serialization',
          responsibilities: ['Validate incoming JSON payloads', 'Route order checkouts', 'Return HTTP status codes'],
          filePatterns: ['src/controllers/*.java'],
          layer: 'Presentation'
        },
        {
          name: 'Domain Core (Application Services)',
          type: 'Service Layer',
          role: 'Business rules and transaction coordination',
          responsibilities: ['Compute item totals', 'Validate line items', 'Enforce transactional boundaries'],
          filePatterns: ['src/services/*.java'],
          layer: 'Business Logic'
        },
        {
          name: 'Persistence Tier',
          type: 'Spring Data & JPA',
          role: 'Relational database mappings and queries',
          responsibilities: ['Execute CRUD operations', 'Query orders by customer', 'Manage connection transactions'],
          filePatterns: ['src/repositories/*.java', 'src/models/*.java'],
          layer: 'Persistence'
        }
      ],
      layers: [
        {
          name: 'Presentation Layer',
          description: 'Spring REST Controllers managing client HTTP communication.',
          components: ['OrderController'],
          dependsOn: ['Application Service Layer']
        },
        {
          name: 'Application Service Layer',
          description: 'Service classes implementing checkout logic and pricing rules.',
          components: ['OrderService'],
          dependsOn: ['Persistence Layer']
        },
        {
          name: 'Persistence Layer',
          description: 'JPA Repositories communicating with the database schema.',
          components: ['OrderRepository'],
          dependsOn: ['Database Storage']
        },
        {
          name: 'Domain Entities',
          description: 'Relational entities representing domain aggregates.',
          components: ['Order', 'OrderItem'],
          dependsOn: []
        }
      ],
      risks: [
        'Direct JPA entity exposure in controllers instead of dedicated DTO contracts',
        'Lack of optimistic locking (@Version) on Order entity under high checkout concurrency',
        'Missing OpenAPI / Swagger annotations in OrderController.java'
      ]
    };
  }

  private generateRecommendations(): AIRecommendation[] {
    const proj = this.projectService.selectedProject();
    const isEs = this.translationService.isSpanish();

    if (isEs) {
      return [
        {
          id: 'rec-1',
          projectId: proj.id,
          title: 'Desacoplar Entidades JPA de la API REST mediante DTOs',
          severity: 'HIGH',
          category: 'ARCHITECTURE',
          file: 'src/controllers/OrderController.java',
          lineRange: 'L18-L35',
          explanation: 'La exposición directa de entidades JPA en los controladores expone la estructura interna de la base de datos y puede causar problemas de serialización en cascada.',
          recommendation: 'Crear clases CreateOrderRequest y OrderResponse (DTOs) para aislar la interfaz pública de la API de la capa de persistencia.',
          suggestedCode: `public class CreateOrderRequest {
    private UUID customerId;
    private List<OrderItemDTO> items;
    // Getters y Setters
}`
        },
        {
          id: 'rec-2',
          projectId: proj.id,
          title: 'Implementar Bloqueo Optimista (@Version) para Concurrencia',
          severity: 'HIGH',
          category: 'PERFORMANCE',
          file: 'src/models/Order.java',
          lineRange: 'L12-L30',
          explanation: 'Bajo cargas concurrentes, múltiples solicitudes podrían intentar modificar el estado de la misma orden simultáneamente sin control de versiones.',
          recommendation: 'Añadir un campo @Version private Long version; en la clase Order para habilitar bloqueo optimista transparente en JPA.'
        },
        {
          id: 'rec-3',
          projectId: proj.id,
          title: 'Documentar Endpoints con Especificación OpenAPI 3.0',
          severity: 'MEDIUM',
          category: 'DOCUMENTATION',
          file: 'src/controllers/OrderController.java',
          lineRange: 'L15-L35',
          explanation: 'Los endpoints carecen de metadatos Swagger, lo que dificulta la generación automática de clientes SDK y pruebas de contrato.',
          recommendation: 'Añadir anotaciones @Tag(name = "Orders") y @Operation(summary = "Crear nueva orden") con códigos de respuesta HTTP estándar.'
        },
        {
          id: 'rec-4',
          projectId: proj.id,
          title: 'Añadir Pruebas Unitarias para el Cálculo de Totales',
          severity: 'MEDIUM',
          category: 'MAINTAINABILITY',
          file: 'src/services/OrderService.java',
          lineRange: 'L22-L36',
          explanation: 'La lógica de cálculo de importes y validación de cantidades requiere cobertura de pruebas automatizadas con casos de borde.',
          recommendation: 'Crear una suite OrderServiceTest con JUnit 5 y Mockito simulando las llamadas al repositorio.'
        }
      ];
    }

    // English version
    return [
      {
        id: 'rec-1',
        projectId: proj.id,
        title: 'Decouple JPA Entities from REST API using DTOs',
        severity: 'HIGH',
        category: 'ARCHITECTURE',
        file: 'src/controllers/OrderController.java',
        lineRange: 'L18-L35',
        explanation: 'Directly returning JPA entities in REST endpoints exposes internal database schemas and can cause serialization circularities.',
        recommendation: 'Create dedicated CreateOrderRequest and OrderResponse DTO records to decouple the public API contract.',
        suggestedCode: `public class CreateOrderRequest {
    private UUID customerId;
    private List<OrderItemDTO> items;
}`
      },
      {
        id: 'rec-2',
        projectId: proj.id,
        title: 'Implement Optimistic Locking (@Version) for Concurrency',
        severity: 'HIGH',
        category: 'PERFORMANCE',
        file: 'src/models/Order.java',
        lineRange: 'L12-L30',
        explanation: 'Concurrent checkouts could attempt to modify the same order record simultaneously without version checking.',
        recommendation: 'Add @Version private Long version; field to Order entity to enable Hibernate optimistic locking.'
      },
      {
        id: 'rec-3',
        projectId: proj.id,
        title: 'Document REST Endpoints with OpenAPI 3.0 Annotations',
        severity: 'MEDIUM',
        category: 'DOCUMENTATION',
        file: 'src/controllers/OrderController.java',
        lineRange: 'L15-L35',
        explanation: 'Endpoints lack Swagger documentation annotations, hindering client SDK generation and contract testing.',
        recommendation: 'Add @Tag and @Operation annotations with standard response code definitions.'
      },
      {
        id: 'rec-4',
        projectId: proj.id,
        title: 'Add Automated Unit Tests for Pricing Logic',
        severity: 'MEDIUM',
        category: 'MAINTAINABILITY',
        file: 'src/services/OrderService.java',
        lineRange: 'L22-L36',
        explanation: 'Total price calculation and line item multipliers require test coverage for edge cases.',
        recommendation: 'Create an OrderServiceTest suite using JUnit 5 and Mockito.'
      }
    ];
  }

  getAnalysis(projectId?: string): Observable<ArchitectureAnalysis> {
    return of(this.generateAnalysis()).pipe(delay(80));
  }

  getRecommendations(projectId?: string): Observable<AIRecommendation[]> {
    return of(this.generateRecommendations()).pipe(delay(80));
  }
}
