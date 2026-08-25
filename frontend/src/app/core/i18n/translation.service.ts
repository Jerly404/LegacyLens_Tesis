import { Injectable, signal, computed } from '@angular/core';

export type SupportedLanguage = 'en' | 'es';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private currentLangSignal = signal<SupportedLanguage>(
    (localStorage.getItem('legacyai_lang') as SupportedLanguage) || 'es'
  );

  currentLang = this.currentLangSignal.asReadonly();
  isSpanish = computed(() => this.currentLangSignal() === 'es');

  private translations: Record<SupportedLanguage, Record<string, string>> = {
    es: {
      // Sidebar & Navigation
      'nav.dashboard': 'Panel Principal',
      'nav.projects': 'Proyectos',
      'nav.upload': 'Subir Repositorio',
      'nav.analysis': 'Pipeline de Análisis',
      'nav.overview': 'Explorador & Código',
      'nav.architecture': 'Arquitectura & Refactor',
      'nav.documentation': 'Documentación Técnica',
      'nav.diagrams': 'Diagramas de Sistema & UML',
      'nav.chat': 'Chat RAG con IA',
      'nav.reports': 'Reportes Ejecutivos',
      'nav.settings': 'Configuración & Hardware',
      'nav.logout': 'Cerrar Sesión',
      
      // Topbar
      'topbar.active_project': 'Proyecto Activo',
      'topbar.ai_engine': 'Motor IA Local',
      'topbar.hardware': 'GPU RTX 3050 · Activa',
      'topbar.notifications': 'Notificaciones',
      'topbar.language': 'Idioma',

      // Dashboard
      'dashboard.title': 'Panel de Inteligencia de Software Legado',
      'dashboard.subtitle': 'Monitoreo en tiempo real de análisis de código, arquitecturas detectadas y modelos locales.',
      'dashboard.kpi_projects': 'Proyectos Analizados',
      'dashboard.kpi_files': 'Archivos Procesados',
      'dashboard.kpi_docs': 'Módulos Documentados',
      'dashboard.kpi_arch': 'Arquitecturas Recuperadas',
      'dashboard.kpi_speed': 'Velocidad de Inferencia',
      'dashboard.gpu_title': 'Aceleración por Hardware GPU',
      'dashboard.recent_projects': 'Proyectos Recientes',
      'dashboard.activity': 'Línea de Tiempo de Actividad',

      // Projects
      'projects.title': 'Repositorios de Software',
      'projects.subtitle': 'Administra, busca y analiza tus proyectos de software.',
      'projects.upload_btn': 'Subir Proyecto',
      'projects.clear_demos': 'Limpiar Demos',
      'projects.restore_demos': 'Restaurar Ejemplos',
      'projects.search_placeholder': 'Buscar por nombre, lenguaje, arquitectura...',
      'projects.filter_all': 'Todos',
      'projects.filter_completed': 'Completados',
      'projects.filter_analyzing': 'En Análisis',
      'projects.filter_failed': 'Fallidos',
      'projects.empty_title': 'No hay proyectos registrados',
      'projects.empty_desc': 'Sube un repositorio Git o archivo ZIP para comenzar el análisis automático.',

      // Upload Wizard
      'upload.title': 'Ingesta & Detección Automática de Repositorio',
      'upload.subtitle': 'El sistema analiza automáticamente el árbol de archivos, detecta tecnologías y orquesta los agentes de IA.',
      'upload.step1': '1. Origen del Código',
      'upload.step2': '2. Detección Automática',
      'upload.step3': '3. Configuración del Equipo IA',
      'upload.step4': '4. Confirmar & Iniciar',
      'upload.drag_drop': 'Arrastra y suelta tu archivo ZIP / TAR aquí',
      'upload.or_browse': 'o busca en tu equipo (hasta 500 MB)',
      'upload.git_url': 'URL del Repositorio Git (GitHub / GitLab / Bitbucket)',
      'upload.branch': 'Rama (Branch)',
      'upload.autodetect_btn': 'Detectar Tecnologías Automáticamente',
      'upload.start_btn': 'Iniciar Análisis con Equipo Multi-Agente',

      // UML & Diagrams
      'uml.title': 'Diagramas de Arquitectura & Sistema',
      'uml.subtitle': 'Visualizaciones interactivas de base de datos, topología fullstack, contenedores C4 y clases.',
      'uml.regenerate': 'Regenerar Diagrama',
      'uml.tab_arch': 'Topología Fullstack',
      'uml.tab_db': 'Base de Datos (ERD)',
      'uml.tab_c4': 'Modelo de Contenedores C4',
      'uml.tab_class': 'Jerarquía de Clases',
      'uml.tab_seq': 'Flujo de Secuencia',
      'uml.tab_comp': 'Fronteras de Módulos',
      'uml.tab_deploy': 'Despliegue & Docker',
      'uml.tab_flow': 'Flujo de Negocio',

      // Architecture
      'arch.title': 'Recuperación de Arquitectura de Software',
      'arch.subtitle': 'Detección automática de patrones arquitectónicos, límites de capas y recomendaciones de refactorización.',
      'arch.detected': 'Arquitectura Detectada',
      'arch.confidence': 'Nivel de Confianza',
      'arch.evidence': 'Evidencia Extraída del Código',
      'arch.recommendations': 'Recomendaciones de Modernización',
      'arch.ask_ai': 'Pedir Refactor a la IA',

      // Documentation
      'docs.title': 'Especificaciones Técnicas & Documentación',
      'docs.subtitle': 'Documentación técnica generada automáticamente con especificaciones de módulos y contratos de API.',
      'docs.regenerate': 'Regenerar Sección con IA',
      'docs.export_md': 'Exportar Markdown',
      'docs.export_pdf': 'Exportar PDF',
      'docs.export_docx': 'Exportar DOCX',

      // Chat RAG
      'chat.title': 'Asistente de Código & RAG Local',
      'chat.subtitle': 'Pregunta sobre la arquitectura, flujos o dependencias de tu proyecto con citaciones exactas.',
      'chat.new_session': 'Nueva Conversación',
      'chat.placeholder': 'Escribe tu consulta sobre el código o arquitectura...',
      'chat.send': 'Enviar Consulta',
      'chat.sources': 'Fuentes y Archivos Referenciados',

      // Settings
      'settings.title': 'Configuración de la Plataforma & Modelos Locales',
      'settings.subtitle': 'Administra el servidor de inferencia Ollama, aceleración GPU y preferencias de usuario.',
      'settings.models': 'Modelos de Lenguaje Locales (LLMs)',
      'settings.server_url': 'URL del Servidor Ollama',
      'settings.test_ping': 'Probar Conexión',
      'settings.gpu_monitor': 'Monitor de GPU & VRAM',
      'settings.preferences': 'Preferencias de la Aplicación',
      'settings.save_btn': 'Guardar Preferencias'
    },

    en: {
      // Sidebar & Navigation
      'nav.dashboard': 'Dashboard',
      'nav.projects': 'Projects',
      'nav.upload': 'Upload Repository',
      'nav.analysis': 'Analysis Pipeline',
      'nav.overview': 'Explorer & Code',
      'nav.architecture': 'Architecture & Refactor',
      'nav.documentation': 'Technical Documentation',
      'nav.diagrams': 'System & UML Diagrams',
      'nav.chat': 'AI RAG Chat',
      'nav.reports': 'Executive Reports',
      'nav.settings': 'Settings & Hardware',
      'nav.logout': 'Sign Out',

      // Topbar
      'topbar.active_project': 'Active Project',
      'topbar.ai_engine': 'Local AI Engine',
      'topbar.hardware': 'GPU RTX 3050 · Active',
      'topbar.notifications': 'Notifications',
      'topbar.language': 'Language',

      // Dashboard
      'dashboard.title': 'Legacy Software Intelligence Dashboard',
      'dashboard.subtitle': 'Real-time monitoring of code analysis, detected architectures, and local AI engines.',
      'dashboard.kpi_projects': 'Analyzed Projects',
      'dashboard.kpi_files': 'Processed Files',
      'dashboard.kpi_docs': 'Documented Modules',
      'dashboard.kpi_arch': 'Recovered Architectures',
      'dashboard.kpi_speed': 'Inference Speed',
      'dashboard.gpu_title': 'Hardware GPU Acceleration',
      'dashboard.recent_projects': 'Recent Projects',
      'dashboard.activity': 'Activity Timeline',

      // Projects
      'projects.title': 'Software Repositories',
      'projects.subtitle': 'Manage, search, and reverse-engineer your ingested codebases.',
      'projects.upload_btn': 'Upload Project',
      'projects.clear_demos': 'Clear Demos',
      'projects.restore_demos': 'Restore Samples',
      'projects.search_placeholder': 'Search by name, language, architecture...',
      'projects.filter_all': 'All',
      'projects.filter_completed': 'Completed',
      'projects.filter_analyzing': 'Analyzing',
      'projects.filter_failed': 'Failed',
      'projects.empty_title': 'No projects registered',
      'projects.empty_desc': 'Upload a Git repository or ZIP archive to start automated analysis.',

      // Upload Wizard
      'upload.title': 'Repository Ingestion & Auto-Detection',
      'upload.subtitle': 'The system automatically scans directory trees, identifies technologies, and orchestrates AI agents.',
      'upload.step1': '1. Code Source',
      'upload.step2': '2. Automatic Stack Detection',
      'upload.step3': '3. AI Multi-Agent Team Config',
      'upload.step4': '4. Review & Launch',
      'upload.drag_drop': 'Drag and drop your ZIP / TAR archive here',
      'upload.or_browse': 'or browse your machine (up to 500 MB)',
      'upload.git_url': 'Git Repository URL (GitHub / GitLab / Bitbucket)',
      'upload.branch': 'Branch',
      'upload.autodetect_btn': 'Auto-Detect Technologies',
      'upload.start_btn': 'Start Multi-Agent Analysis',

      // UML & Diagrams
      'uml.title': 'System & Architecture Diagrams',
      'uml.subtitle': 'Interactive database schema, fullstack topology, C4 containers, and class hierarchies.',
      'uml.regenerate': 'Regenerate Diagram',
      'uml.tab_arch': 'Fullstack Topology',
      'uml.tab_db': 'Database (ERD)',
      'uml.tab_c4': 'C4 Container Model',
      'uml.tab_class': 'Class Hierarchy',
      'uml.tab_seq': 'Sequence Flow',
      'uml.tab_comp': 'Module Boundaries',
      'uml.tab_deploy': 'Deployment & Docker',
      'uml.tab_flow': 'Business Flow',

      // Architecture
      'arch.title': 'Software Architecture Recovery',
      'arch.subtitle': 'Automated detection of design patterns, layer boundaries, and refactoring roadmaps.',
      'arch.detected': 'Detected Architecture',
      'arch.confidence': 'Confidence Level',
      'arch.evidence': 'Codebase Evidence',
      'arch.recommendations': 'Modernization Recommendations',
      'arch.ask_ai': 'Ask AI to Refactor',

      // Documentation
      'docs.title': 'Technical Specifications & Docs',
      'docs.subtitle': 'Automated documentation with module responsibilities, schema dictionaries, and API specs.',
      'docs.regenerate': 'Regenerate Section with AI',
      'docs.export_md': 'Export Markdown',
      'docs.export_pdf': 'Export PDF',
      'docs.export_docx': 'Export DOCX',

      // Chat RAG
      'chat.title': 'Codebase Assistant & Local RAG',
      'chat.subtitle': 'Ask questions regarding system architecture, execution traces, or dependencies with exact citations.',
      'chat.new_session': 'New Chat Session',
      'chat.placeholder': 'Ask anything about the codebase or architecture...',
      'chat.send': 'Send Query',
      'chat.sources': 'Referenced Sources & Citations',

      // Settings
      'settings.title': 'Platform Settings & Local AI Models',
      'settings.subtitle': 'Manage Ollama inference daemon, GPU acceleration, and workspace preferences.',
      'settings.models': 'Local Large Language Models (LLMs)',
      'settings.server_url': 'Ollama Server Endpoint',
      'settings.test_ping': 'Test Connection',
      'settings.gpu_monitor': 'GPU & VRAM Hardware Monitor',
      'settings.preferences': 'Application Preferences',
      'settings.save_btn': 'Save Preferences'
    }
  };

  setLanguage(lang: SupportedLanguage) {
    this.currentLangSignal.set(lang);
    localStorage.setItem('legacyai_lang', lang);
  }

  t(key: string): string {
    const lang = this.currentLangSignal();
    return this.translations[lang]?.[key] || this.translations['en']?.[key] || key;
  }
}
