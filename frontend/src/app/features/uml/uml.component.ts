import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiagramService } from '../../core/diagrams/diagram.service';
import { ProjectService } from '../../core/projects/project.service';
import { NotificationService } from '../../core/notifications/notification.service';
import { DiagramViewerComponent } from '../../shared/components/diagram-viewer/diagram-viewer.component';
import { UMLDiagram, UMLType } from '@codelens/shared';

@Component({
  selector: 'app-uml',
  standalone: true,
  imports: [CommonModule, DiagramViewerComponent],
  templateUrl: './uml.component.html',
  styleUrls: ['./uml.component.css']
})
export class UmlComponent implements OnInit {
  diagramService = inject(DiagramService);
  projectService = inject(ProjectService);
  notificationService = inject(NotificationService);

  activeType = signal<UMLType>('class');
  currentDiagram = signal<UMLDiagram | null>(null);
  isRegenerating = signal<boolean>(false);
  selectedElementId = signal<string>('OrderService');

  detectedElements = [
    {
      id: 'OrderController',
      name: 'OrderController',
      type: 'REST Controller',
      stereotype: '@RestController',
      file: 'src/controllers/OrderController.java',
      membersCount: '3 métodos públicos, 1 atributo',
      methods: [
        '+ createOrder(Order): ResponseEntity',
        '+ getOrder(UUID): ResponseEntity',
        '+ getCustomerOrders(UUID): List'
      ],
      attributes: ['- orderService: OrderService'],
      badgeClass: 'bg-blue-500/15 text-blue-300 border-blue-500/30'
    },
    {
      id: 'OrderService',
      name: 'OrderService',
      type: 'Domain Service',
      stereotype: '@Service, @Transactional',
      file: 'src/services/OrderService.java',
      membersCount: '3 métodos, 1 repositorio inyectado',
      methods: [
        '+ processOrderCheckout(Order): Order',
        '+ findOrderById(UUID): Optional',
        '+ getOrdersByCustomer(UUID): List'
      ],
      attributes: ['- orderRepository: OrderRepository'],
      badgeClass: 'bg-purple-500/15 text-purple-300 border-purple-500/30'
    },
    {
      id: 'OrderRepository',
      name: 'OrderRepository',
      type: 'Data Repository Interface',
      stereotype: '<<interface>> JpaRepository',
      file: 'src/repositories/OrderRepository.java',
      membersCount: '4 consultas derivadas',
      methods: [
        '+ findByCustomerId(UUID): List',
        '+ findByStatus(String): List',
        '+ save(Order): Order',
        '+ findById(UUID): Optional'
      ],
      attributes: [],
      badgeClass: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
    },
    {
      id: 'Order',
      name: 'Order',
      type: 'JPA Domain Entity',
      stereotype: '@Entity (orders)',
      file: 'src/models/Order.java',
      membersCount: '6 atributos, relación 1:N',
      methods: [],
      attributes: [
        '+ id: UUID [PK]',
        '+ customerId: UUID',
        '+ totalAmount: BigDecimal',
        '+ status: String',
        '+ items: List<OrderItem>',
        '+ createdAt: LocalDateTime'
      ],
      badgeClass: 'bg-amber-500/15 text-amber-300 border-amber-500/30'
    },
    {
      id: 'OrderItem',
      name: 'OrderItem',
      type: 'JPA Domain Entity',
      stereotype: '@Entity (order_items)',
      file: 'src/models/OrderItem.java',
      membersCount: '6 atributos, relación @ManyToOne',
      methods: [],
      attributes: [
        '+ id: UUID [PK]',
        '+ order: Order [@ManyToOne]',
        '+ productId: UUID',
        '+ productSku: String',
        '+ quantity: Integer',
        '+ unitPrice: BigDecimal'
      ],
      badgeClass: 'bg-rose-500/15 text-rose-300 border-rose-500/30'
    }
  ];

  detectedRelations = [
    {
      source: 'OrderController',
      target: 'OrderService',
      type: 'Inyección / Delegación',
      stereotype: 'delegates to',
      multiplicity: '1 : 1',
      evidence: 'AST: private OrderService orderService',
      badgeClass: 'text-blue-400'
    },
    {
      source: 'OrderService',
      target: 'OrderRepository',
      type: 'Persistencia de Datos',
      stereotype: 'persists via',
      multiplicity: '1 : 1',
      evidence: 'AST: private OrderRepository orderRepository',
      badgeClass: 'text-purple-400'
    },
    {
      source: 'OrderRepository',
      target: 'JpaRepository<Order, UUID>',
      type: 'Realización de Interfaz',
      stereotype: 'extends',
      multiplicity: '—',
      evidence: 'AST: interface extends JpaRepository',
      badgeClass: 'text-emerald-400'
    },
    {
      source: 'Order',
      target: 'OrderItem',
      type: 'Composición / Cascada ALL',
      stereotype: 'contains',
      multiplicity: '1 : N',
      evidence: 'AST: @OneToMany(cascade = CascadeType.ALL)',
      badgeClass: 'text-rose-400'
    }
  ];

  tabs: Array<{ type: UMLType; label: string; icon: string }> = [
    { type: 'class', label: 'Diagrama de Clases UML', icon: 'class' },
    { type: 'architecture', label: 'Arquitectura Fullstack', icon: 'account_tree' },
    { type: 'database', label: 'Esquema de BD (ERD)', icon: 'database' },
    { type: 'c4', label: 'Modelo C4 Container', icon: 'grid_view' },
    { type: 'sequence', label: 'Flujo de Secuencia', icon: 'swap_horiz' },
    { type: 'component', label: 'Límites de Módulo', icon: 'view_module' },
    { type: 'deployment', label: 'Despliegue & Docker', icon: 'dns' },
    { type: 'flow', label: 'Proceso de Negocio', icon: 'alt_route' }
  ];

  selectElement(id: string) {
    this.selectedElementId.set(id);
  }

  ngOnInit() {
    this.loadDiagram(this.activeType());
  }

  loadDiagram(type: UMLType) {
    this.activeType.set(type);
    this.diagramService.getDiagram(type, this.projectService.selectedProject().id).subscribe(diag => {
      this.currentDiagram.set(diag);
    });
  }

  regenerate() {
    this.isRegenerating.set(true);
    setTimeout(() => {
      this.diagramService.getDiagram(this.activeType(), this.projectService.selectedProject().id).subscribe(diag => {
        this.currentDiagram.set(diag);
        this.isRegenerating.set(false);
        this.notificationService.success('Diagram Regenerated', `Updated ${this.activeType().toUpperCase()} diagram for ${this.projectService.selectedProject().name}`);
      });
    }, 600);
  }
}
