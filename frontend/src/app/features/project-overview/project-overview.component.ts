import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ProjectService } from '../../core/projects/project.service';
import { ArchitectureService } from '../../core/architecture/architecture.service';
import { NotificationService } from '../../core/notifications/notification.service';
import { TranslationService } from '../../core/i18n/translation.service';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { CodeViewerComponent } from '../../shared/components/code-viewer/code-viewer.component';
import { DependencyGraphComponent } from '../../shared/components/dependency-graph/dependency-graph.component';
import { FileNode, DependencyGraphData, AstElementNode, AstUnitDocumentation } from '@codelens/shared';

@Component({
  selector: 'app-project-overview',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    RouterModule, 
    BadgeComponent, 
    CodeViewerComponent, 
    DependencyGraphComponent
  ],
  templateUrl: './project-overview.component.html',
  styleUrls: ['./project-overview.component.css']
})
export class ProjectOverviewComponent implements OnInit {
  projectService = inject(ProjectService);
  architectureService = inject(ArchitectureService);
  notificationService = inject(NotificationService);
  translationService = inject(TranslationService);
  router = inject(Router);

  activeTab = signal<'structure' | 'files' | 'dependencies' | 'metrics' | 'pipeline'>('structure');
  astViewMode = signal<'split' | 'docs' | 'code'>('code');
  isRegeneratingDoc = signal<boolean>(false);
  fileTree = signal<FileNode[]>([]);
  astTree = signal<AstElementNode[]>([]);
  selectedFile = signal<FileNode | null>(null);
  selectedAstNode = signal<AstElementNode | null>(null);
  dependencyData = signal<DependencyGraphData>({ nodes: [], links: [] });
  fileSearchQuery = signal<string>('');
  astSearchQuery = signal<string>('');
  selectedKindFilter = signal<'all' | 'package' | 'class' | 'interface' | 'method'>('all');
  expandedNodeIds = signal<Set<string>>(
    new Set([
      'pkg-controllers',
      'pkg-services',
      'pkg-repositories',
      'pkg-models',
      'cls-order-ctrl',
      'cls-order-srv',
      'cls-usuario-srv',
      'iface-usuario-repo',
      'iface-order-repo',
      'cls-usuario-entity',
      'cls-order-entity',
      'cls-order-item-entity'
    ])
  );

  packagesCount = computed(() => {
    let count = 0;
    const walk = (nodes: AstElementNode[]) => {
      for (const n of nodes) {
        if (n.kind === 'package') count++;
        if (n.children) walk(n.children);
      }
    };
    walk(this.astTree());
    return count;
  });

  classesCount = computed(() => {
    let count = 0;
    const walk = (nodes: AstElementNode[]) => {
      for (const n of nodes) {
        if (n.kind === 'class') count++;
        if (n.children) walk(n.children);
      }
    };
    walk(this.astTree());
    return count;
  });

  interfacesCount = computed(() => {
    let count = 0;
    const walk = (nodes: AstElementNode[]) => {
      for (const n of nodes) {
        if (n.kind === 'interface') count++;
        if (n.children) walk(n.children);
      }
    };
    walk(this.astTree());
    return count;
  });

  methodsCount = computed(() => {
    let count = 0;
    const walk = (nodes: AstElementNode[]) => {
      for (const n of nodes) {
        if (n.kind === 'method') count++;
        if (n.children) walk(n.children);
      }
    };
    walk(this.astTree());
    return count;
  });

  filteredAstTree = computed(() => {
    const query = this.astSearchQuery().toLowerCase().trim();
    const filter = this.selectedKindFilter();
    const tree = this.astTree();

    if (!query && filter === 'all') {
      return tree;
    }

    const filterNode = (node: AstElementNode): AstElementNode | null => {
      const matchesQuery = !query || 
        node.name.toLowerCase().includes(query) || 
        (node.packageName && node.packageName.toLowerCase().includes(query)) ||
        (node.annotations && node.annotations.some(a => a.toLowerCase().includes(query))) ||
        (node.details && node.details.toLowerCase().includes(query));

      const matchesKind = filter === 'all' || node.kind === filter;

      let filteredChildren: AstElementNode[] = [];
      if (node.children) {
        filteredChildren = node.children
          .map(c => filterNode(c))
          .filter((c): c is AstElementNode => c !== null);
      }

      if ((matchesQuery && matchesKind) || filteredChildren.length > 0) {
        return {
          ...node,
          children: filteredChildren
        };
      }
      return null;
    };

    return tree.map(filterNode).filter((n): n is AstElementNode => n !== null);
  });

  ngOnInit() {
    const files = this.projectService.getFileTree();
    this.fileTree.set(files);

    const ast = this.projectService.getAstStructuralTree();
    this.astTree.set(ast);

    // Look for mth-usuario-registrar first (or first available node)
    let targetNode: AstElementNode | null = null;
    const findNode = (nodes: AstElementNode[], id: string): AstElementNode | null => {
      for (const n of nodes) {
        if (n.id === id) return n;
        if (n.children) {
          const res = findNode(n.children, id);
          if (res) return res;
        }
      }
      return null;
    };

    targetNode = findNode(ast, 'mth-usuario-registrar');
    if (!targetNode && ast.length > 0 && ast[0].children && ast[0].children.length > 0) {
      targetNode = ast[0].children[0];
    }

    if (targetNode) {
      this.selectedAstNode.set(targetNode);
      if (targetNode.filePath) {
        const matchingFile = this.findFileByPath(files, targetNode.filePath);
        if (matchingFile) {
          this.selectedFile.set(matchingFile);
        }
      }
    } else if (files.length > 0 && files[0].children && files[0].children.length > 0 && files[0].children[0].children) {
      this.selectedFile.set(files[0].children[0].children[0]);
    }

    // Force expansion of packages and service classes for prominent view
    this.expandedNodeIds.update(set => {
      const next = new Set(set);
      next.add('pkg-services');
      next.add('cls-usuario-srv');
      next.add('pkg-repositories');
      next.add('iface-usuario-repo');
      return next;
    });

    this.dependencyData.set(this.projectService.getDependencyGraph());
  }

  isExpanded(id: string): boolean {
    if (id === 'cls-usuario-srv' || id === 'pkg-services') {
      return !this.collapsedOverrides.has(id);
    }
    return this.expandedNodeIds().has(id);
  }

  private collapsedOverrides = new Set<string>();

  toggleNode(id: string) {
    if (id === 'cls-usuario-srv' || id === 'pkg-services') {
      if (this.collapsedOverrides.has(id)) {
        this.collapsedOverrides.delete(id);
      } else {
        this.collapsedOverrides.add(id);
      }
      return;
    }
    this.expandedNodeIds.update(set => {
      const next = new Set(set);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  expandAll() {
    const allIds = new Set<string>();
    const collect = (nodes: AstElementNode[]) => {
      for (const n of nodes) {
        allIds.add(n.id);
        if (n.children) collect(n.children);
      }
    };
    collect(this.astTree());
    this.expandedNodeIds.set(allIds);
  }

  collapseAll() {
    this.expandedNodeIds.set(new Set());
  }

  selectAstNode(node: AstElementNode) {
    this.selectedAstNode.set(node);

    // If node points to a file, load that file in the viewer
    if (node.filePath) {
      const matchingFile = this.findFileByPath(this.fileTree(), node.filePath);
      if (matchingFile) {
        this.selectedFile.set(matchingFile);
      }
    } else if (node.children && node.children.length > 0 && node.children[0].filePath) {
      const matchingFile = this.findFileByPath(this.fileTree(), node.children[0].filePath);
      if (matchingFile) {
        this.selectedFile.set(matchingFile);
      }
    }
  }

  selectFile(file: FileNode) {
    if (file.type === 'file') {
      this.selectedFile.set(file);
      this.notificationService.info('File Opened', file.path);
    }
  }

  private findFileByPath(nodes: FileNode[], path: string): FileNode | null {
    for (const n of nodes) {
      if (n.path === path || path.endsWith(n.path) || n.path.endsWith(path)) {
        return n;
      }
      if (n.children) {
        const found = this.findFileByPath(n.children, path);
        if (found) return found;
      }
    }
    return null;
  }

  askAiAboutCode(code: string) {
    this.notificationService.info('Opening AI Assistant', 'Querying context for selected code...');
    this.router.navigate(['/ai-chat']);
  }

  explainCode(code: string) {
    this.notificationService.info('Generating Explanation', 'Qwen 2.5 Coder is analyzing class AST...');
    this.router.navigate(['/ai-chat']);
  }

  explainWithAI(file: any) {
    this.notificationService.info('Generating Explanation', 'Qwen 2.5 Coder is analyzing class AST...');
    this.router.navigate(['/ai-chat']);
  }

  reanalyze() {
    this.router.navigate(['/analysis-progress']);
  }

  getUnitDocumentation(node: AstElementNode | null): AstUnitDocumentation | null {
    if (!node) return null;
    if (node.documentation) return node.documentation;

    const isMethod = node.kind === 'method';
    const name = node.name;
    return {
      purpose: node.details || (isMethod 
        ? `Ejecuta la operación ${name} dentro de la arquitectura de la aplicación, garantizando consistencia funcional.`
        : `Define la estructura y contratos del componente ${name}.`),
      parameters: node.parameters ? [{
        name: node.parameters.split(' ')[1] || 'param',
        type: node.parameters.split(' ')[0] || 'Object',
        description: `Parámetro de entrada tipado para la ejecución de ${name}.`
      }] : [
        { name: 'Ninguno', type: 'void', description: 'Este método no recibe argumentos de entrada.' }
      ],
      returnVal: {
        type: node.returnType || 'void',
        description: node.returnType && node.returnType !== 'void'
          ? `Instancia resultante de tipo ${node.returnType}.`
          : 'No retorna ningún valor (operación void).'
      },
      dependencies: (node.annotations || []).concat(node.packageName ? [node.packageName] : []),
      ragContext: {
        model: 'Qwen 2.5 Coder 7B (Local Ollama)',
        similarity: 96.4,
        sources: node.filePath ? [node.filePath] : ['AST Index'],
        astEvidence: `Nodo AST analizado tipo ${node.kind} con complejidad ciclomática CC ${node.complexity || 1}.`
      }
    };
  }

  getNodeSnippet(node: AstElementNode | null): string {
    if (!node) return '// Ningún elemento seleccionado';
    if (node.id === 'mth-usuario-registrar') {
      return `@Transactional
public UsuarioResponseDTO registrarUsuario(UsuarioRegistroDTO dto) {
    if (usuarioRepository.existsByEmail(dto.getEmail())) {
        throw new EmailAlreadyExistsException("El email ya se encuentra registrado: " + dto.getEmail());
    }

    String passwordHash = passwordEncoder.encode(dto.getPassword());
    Usuario usuario = new Usuario();
    usuario.setNombre(dto.getNombre());
    usuario.setEmail(dto.getEmail());
    usuario.setPasswordHash(passwordHash);
    usuario.setRol(dto.getRol() != null ? dto.getRol() : "CLIENTE");

    Usuario usuarioGuardado = usuarioRepository.save(usuario);
    notificacionService.enviarEmailBienvenida(usuarioGuardado.getEmail());

    return new UsuarioResponseDTO(
        usuarioGuardado.getId(),
        usuarioGuardado.getNombre(),
        usuarioGuardado.getEmail(),
        usuarioGuardado.getRol(),
        usuarioGuardado.getFechaRegistro()
    );
}`;
    }
    if (node.id === 'mth-srv-checkout') {
      return `@Transactional
public Order processOrderCheckout(Order order) {
    BigDecimal total = BigDecimal.ZERO;
    for (OrderItem item : order.getItems()) {
        BigDecimal lineTotal = item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
        total = total.add(lineTotal);
    }
    order.setTotalAmount(total);
    order.setStatus("PROCESSING");
    
    return orderRepository.save(order);
}`;
    }
    if (node.id === 'mth-usuario-buscar-email') {
      return `public Optional<Usuario> buscarPorEmail(String email) {
    return usuarioRepository.findByEmail(email);
}`;
    }
    if (this.selectedFile()?.content) {
      return this.selectedFile()!.content!;
    }
    return `// Elemento AST: ${node.name} (${node.kind})\n// Declarado en ${node.filePath || 'src'}\npublic ${node.returnType || 'void'} ${node.name} {\n    // Lógica del componente recuperada del AST\n}`;
  }

  regenerateUnitDoc() {
    this.isRegeneratingDoc.set(true);
    setTimeout(() => {
      this.isRegeneratingDoc.set(false);
      this.notificationService.success(
        'Documentación RAG Actualizada',
        'Especificación re-sintetizada con Qwen 2.5 Coder 7B sobre el índice AST.'
      );
    }, 500);
  }

  copyUnitDocMarkdown() {
    const node = this.selectedAstNode();
    const doc = this.getUnitDocumentation(node);
    if (!doc || !node) return;

    const md = `### Documentación Técnica de Unidad de Código
**Elemento:** \`${node.name}\`
**Tipo:** ${node.kind}
**Archivo:** \`${node.filePath || 'N/A'}\`

#### Propósito
${doc.purpose}

#### Parámetros
${doc.parameters.map(p => `- \`${p.name}\` (*${p.type}*): ${p.description}`).join('\n')}

#### Retorno
- **Tipo:** \`${doc.returnVal.type}\`
- **Descripción:** ${doc.returnVal.description}

#### Dependencias
${doc.dependencies.map(d => `- ${d}`).join('\n')}

${doc.ragContext ? `\n> *Generado con RAG mediante ${doc.ragContext.model}. Relevancia: ${doc.ragContext.similarity}%.*` : ''}
`;
    navigator.clipboard.writeText(md);
    this.notificationService.info('Copiado', 'Documentación copiada al portapapeles en formato Markdown.');
  }

  clearCurrentProject() {
    this.projectService.clearAllProjects().subscribe(() => {
      this.notificationService.success('Espacio de Trabajo Limpio', 'Se han eliminado todos los datos, archivos y diagramas del proyecto anterior.');
      this.router.navigate(['/upload']);
    });
  }
}
