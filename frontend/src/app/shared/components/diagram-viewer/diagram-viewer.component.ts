import { Component, input, signal, ElementRef, viewChild, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ProjectService } from '../../../core/projects/project.service';

@Component({
  selector: 'app-diagram-viewer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-[#151821] border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl flex flex-col h-full">
      <!-- Toolbar -->
      <div class="px-5 py-3 bg-[#11131B] border-b border-white/[0.08] flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div class="flex items-center gap-2 min-w-0">
          <span class="material-symbols-outlined text-purple-400 text-lg shrink-0">schema</span>
          <span class="text-sm font-semibold text-white truncate">{{ title() }}</span>
          <span class="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/20 font-mono font-bold shrink-0">Vector SVG Engine</span>
        </div>

        <!-- Controls -->
        <div class="flex items-center gap-1.5">
          <button (click)="zoomIn()" title="Zoom In" class="p-1.5 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition">
            <span class="material-symbols-outlined text-sm">zoom_in</span>
          </button>
          <button (click)="zoomOut()" title="Zoom Out" class="p-1.5 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition">
            <span class="material-symbols-outlined text-sm">zoom_out</span>
          </button>
          <button (click)="resetZoom()" title="Reset" class="p-1.5 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition text-xs font-mono">
            {{ zoomLevel() }}%
          </button>

          <div class="h-4 w-px bg-white/10 mx-1"></div>

          <button (click)="exportSvg()" title="Export SVG" class="px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition flex items-center gap-1">
            <span class="material-symbols-outlined text-xs">download</span>
            SVG
          </button>

          <button (click)="toggleFullscreen()" title="Fullscreen" class="p-1.5 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition">
            <span class="material-symbols-outlined text-sm">{{ isFullscreen() ? 'fullscreen_exit' : 'fullscreen' }}</span>
          </button>
        </div>
      </div>

      <!-- Diagram Canvas -->
      <div 
        class="flex-1 overflow-auto bg-[#0a0c12] p-8 flex items-center justify-center min-h-[460px] select-none relative scrollbar-thin"
        [class.fixed]="isFullscreen()"
        [class.inset-0]="isFullscreen()"
        [class.z-50]="isFullscreen()"
      >
        @if (isFullscreen()) {
          <button (click)="toggleFullscreen()" class="absolute top-4 right-4 z-10 px-3 py-1.5 bg-black/70 backdrop-blur text-white text-xs font-medium rounded-xl border border-white/20 flex items-center gap-1 shadow-2xl">
            <span class="material-symbols-outlined text-sm">close</span>
            Exit Fullscreen
          </button>
        }

        <!-- Rendered Graphic Viewport -->
        <div 
          #diagramContainer 
          class="transition-transform duration-150 origin-center flex items-center justify-center w-full"
          [style.transform]="'scale(' + (zoomLevel() / 100) + ')'"
          [innerHTML]="svgContent()"
        >
        </div>
      </div>
    </div>
  `
})
export class DiagramViewerComponent {
  definition = input<string>('');
  title = input<string>('Architecture Diagram');
  
  private projectService = inject(ProjectService);
  private sanitizer = inject(DomSanitizer);
  diagramContainer = viewChild<ElementRef<HTMLDivElement>>('diagramContainer');

  zoomLevel = signal<number>(100);
  isFullscreen = signal<boolean>(false);
  rawSvg = signal<string>('');
  svgContent = signal<SafeHtml>('');

  constructor() {
    effect(() => {
      const def = this.definition();
      const t = this.title().toLowerCase();
      this.generateRichSvgDiagram(t, def);
    });
  }

  private isMindguardProject(): boolean {
    const proj = this.projectService.selectedProject();
    return (proj.name || '').toLowerCase().includes('mindguard') || 
           (proj.slug || '').includes('mindguard') || 
           (proj.name || '').toLowerCase().includes('quality');
  }

  private isPythonProject(): boolean {
    const proj = this.projectService.selectedProject();
    return this.isMindguardProject() ||
           (proj.mainLanguage || '').toLowerCase() === 'python' || 
           (proj.name || '').toLowerCase().includes('ehr') || 
           (proj.name || '').toLowerCase().includes('clinical') || 
           (proj.name || '').toLowerCase().includes('patient');
  }

  private generateRichSvgDiagram(title: string, def: string) {
    let svg = '';
    if (title.includes('database') || title.includes('erd') || def.includes('erDiagram')) {
      svg = this.renderDatabaseErdSvg();
    } else if (title.includes('sequence') || def.includes('sequenceDiagram')) {
      svg = this.renderSequenceSvg();
    } else if (title.includes('c4') || def.includes('EnterpriseBoundary')) {
      svg = this.renderC4ContainerSvg();
    } else if (title.includes('class') || def.includes('classDiagram')) {
      svg = this.renderClassDiagramSvg();
    } else if (title.includes('deployment') || title.includes('docker')) {
      svg = this.renderDeploymentSvg();
    } else if (title.includes('flow') || def.includes('flowchart')) {
      svg = this.renderProcessFlowSvg();
    } else if (title.includes('component') || title.includes('boundary')) {
      svg = this.renderComponentBoundarySvg();
    } else {
      svg = this.renderFullstackArchitectureSvg();
    }

    this.rawSvg.set(svg);
    this.svgContent.set(this.sanitizer.bypassSecurityTrustHtml(svg));
  }

  // 1. FULLSTACK ARCHITECTURE SVG
  private renderFullstackArchitectureSvg(): string {
    const isMg = this.isMindguardProject();
    const isPy = this.isPythonProject();
    const runtimeName = isMg ? 'Python 3.11 / FastAPI & Angular 17' : (isPy ? 'Python 3.11 / FastAPI ASGI' : 'Java 11 / Spring Boot 2.7');
    const ormName = isMg ? 'SQLAlchemy ORM / SQLite & PostgreSQL' : (isPy ? 'Async SQLAlchemy 2.0 / asyncpg' : 'Spring Data JPA / Hibernate');
    const ctrlName = isMg ? 'FastAPI APIRouters (assessments.py, auth.py)' : (isPy ? 'FastAPI APIRouter (patients_router.py)' : 'Spring REST Controllers (OrderController.java)');
    const srvName = isMg ? 'Clinical AI & Psychometrics (clinical_ai.py)' : (isPy ? 'Clinical Domain Services (patient_service.py)' : 'Order Processing Services (OrderService.java)');

    return `
      <svg width="960" height="600" viewBox="0 0 960 600" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="layerGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#1E293B" stop-opacity="0.8"/>
            <stop offset="100%" stop-color="#0F172A" stop-opacity="0.9"/>
          </linearGradient>
          <filter id="cardShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000000" flood-opacity="0.4"/>
          </filter>
        </defs>

        <!-- Tier 1: Client & Presentation -->
        <rect x="40" y="30" width="880" height="100" rx="16" fill="url(#layerGrad)" stroke="#334155" stroke-width="1.5"/>
        <text x="60" y="55" fill="#94A3B8" font-family="Inter, sans-serif" font-size="11" font-weight="700" letter-spacing="1">CLIENT & PRESENTATION TIER</text>
        
        <g transform="translate(70, 70)">
          <rect width="240" height="45" rx="10" fill="#1E293B" stroke="#3B82F6" stroke-width="1.5" filter="url(#cardShadow)"/>
          <text x="120" y="27" fill="#F8FAFC" font-family="Inter, sans-serif" font-size="11.5" font-weight="600" text-anchor="middle">${isMg ? 'Angular 17 Web Portal' : 'Angular SPA Web Portal'}</text>
        </g>
        <g transform="translate(360, 70)">
          <rect width="240" height="45" rx="10" fill="#1E293B" stroke="#3B82F6" stroke-width="1.5" filter="url(#cardShadow)"/>
          <text x="120" y="27" fill="#F8FAFC" font-family="Inter, sans-serif" font-size="11.5" font-weight="600" text-anchor="middle">${isMg ? 'Mobile Psychometrics Client' : 'Mobile App (Clinical/Client)'}</text>
        </g>
        <g transform="translate(650, 70)">
          <rect width="240" height="45" rx="10" fill="#1E293B" stroke="#3B82F6" stroke-width="1.5" filter="url(#cardShadow)"/>
          <text x="120" y="27" fill="#F8FAFC" font-family="Inter, sans-serif" font-size="11.5" font-weight="600" text-anchor="middle">Third-Party REST Consumers</text>
        </g>

        <!-- Arrows Tier 1 -> Tier 2 -->
        <path d="M 480 130 L 480 160" stroke="#60A5FA" stroke-width="2" stroke-dasharray="4"/>
        <polygon points="476,155 484,155 480,162" fill="#60A5FA"/>

        <!-- Tier 2: Ingress & Security Gateway -->
        <rect x="40" y="165" width="880" height="100" rx="16" fill="url(#layerGrad)" stroke="#334155" stroke-width="1.5"/>
        <text x="60" y="190" fill="#94A3B8" font-family="Inter, sans-serif" font-size="11" font-weight="700" letter-spacing="1">SECURITY & INGRESS GATEWAY</text>
        
        <g transform="translate(180, 205)">
          <rect width="270" height="45" rx="10" fill="#1E293B" stroke="#8B5CF6" stroke-width="1.5" filter="url(#cardShadow)"/>
          <text x="135" y="27" fill="#F8FAFC" font-family="Inter, sans-serif" font-size="11.5" font-weight="600" text-anchor="middle">NGINX Ingress & SSL Termination</text>
        </g>
        <g transform="translate(510, 205)">
          <rect width="270" height="45" rx="10" fill="#1E293B" stroke="#8B5CF6" stroke-width="1.5" filter="url(#cardShadow)"/>
          <text x="135" y="27" fill="#F8FAFC" font-family="Inter, sans-serif" font-size="11.5" font-weight="600" text-anchor="middle">JWT Security & Rate Limiter</text>
        </g>

        <!-- Arrows Tier 2 -> Tier 3 -->
        <path d="M 480 265 L 480 295" stroke="#60A5FA" stroke-width="2" stroke-dasharray="4"/>
        <polygon points="476,290 484,290 480,297" fill="#60A5FA"/>

        <!-- Tier 3: Application & Domain Tier -->
        <rect x="40" y="300" width="880" height="110" rx="16" fill="url(#layerGrad)" stroke="#334155" stroke-width="1.5"/>
        <text x="60" y="325" fill="#94A3B8" font-family="Inter, sans-serif" font-size="11" font-weight="700" letter-spacing="1">APPLICATION & DOMAIN SERVICE TIER (${runtimeName})</text>
        
        <g transform="translate(70, 335)">
          <rect width="240" height="55" rx="10" fill="#1E293B" stroke="#10B981" stroke-width="1.5" filter="url(#cardShadow)"/>
          <text x="120" y="26" fill="#F8FAFC" font-family="Inter, sans-serif" font-size="11" font-weight="600" text-anchor="middle">API Router / Controllers</text>
          <text x="120" y="44" fill="#94A3B8" font-family="Inter, sans-serif" font-size="9" text-anchor="middle">${ctrlName}</text>
        </g>
        <g transform="translate(360, 335)">
          <rect width="240" height="55" rx="10" fill="#1E293B" stroke="#3B82F6" stroke-width="1.5" filter="url(#cardShadow)"/>
          <text x="120" y="26" fill="#F8FAFC" font-family="Inter, sans-serif" font-size="11" font-weight="600" text-anchor="middle">Domain Services</text>
          <text x="120" y="44" fill="#94A3B8" font-family="Inter, sans-serif" font-size="9" text-anchor="middle">${srvName}</text>
        </g>
        <g transform="translate(650, 335)">
          <rect width="240" height="55" rx="10" fill="#1E293B" stroke="#F59E0B" stroke-width="1.5" filter="url(#cardShadow)"/>
          <text x="120" y="26" fill="#F8FAFC" font-family="Inter, sans-serif" font-size="11" font-weight="600" text-anchor="middle">Data Repository / ORM</text>
          <text x="120" y="44" fill="#94A3B8" font-family="Inter, sans-serif" font-size="9.5" text-anchor="middle">${ormName}</text>
        </g>

        <!-- Arrows Tier 3 -> Tier 4 -->
        <path d="M 480 410 L 480 445" stroke="#60A5FA" stroke-width="2" stroke-dasharray="4"/>
        <polygon points="476,440 484,440 480,447" fill="#60A5FA"/>

        <!-- Tier 4: Data & Local AI -->
        <rect x="40" y="450" width="880" height="110" rx="16" fill="url(#layerGrad)" stroke="#334155" stroke-width="1.5"/>
        <text x="60" y="475" fill="#94A3B8" font-family="Inter, sans-serif" font-size="11" font-weight="700" letter-spacing="1">PERSISTENCE, CACHE & LOCAL AI TIER</text>
        
        <g transform="translate(70, 490)">
          <rect width="240" height="55" rx="10" fill="#1E293B" stroke="#10B981" stroke-width="1.5" filter="url(#cardShadow)"/>
          <text x="120" y="26" fill="#F8FAFC" font-family="Inter, sans-serif" font-size="12" font-weight="600" text-anchor="middle">${isMg ? 'SQLite / PostgreSQL 16 DB' : 'PostgreSQL 16 Database'}</text>
          <text x="120" y="44" fill="#94A3B8" font-family="Inter, sans-serif" font-size="10" text-anchor="middle">${isMg ? 'mindguard.db / alembic' : 'Relational Schema & JSONB'}</text>
        </g>
        <g transform="translate(360, 490)">
          <rect width="240" height="55" rx="10" fill="#1E293B" stroke="#EF4444" stroke-width="1.5" filter="url(#cardShadow)"/>
          <text x="120" y="26" fill="#F8FAFC" font-family="Inter, sans-serif" font-size="12" font-weight="600" text-anchor="middle">${isMg ? 'Gemini 1.5 & Groq Llama 3' : 'Redis Distributed Cache'}</text>
          <text x="120" y="44" fill="#94A3B8" font-family="Inter, sans-serif" font-size="10" text-anchor="middle">${isMg ? 'Cloud AI Ingestion API' : 'Sessions, Telemetry & Queues'}</text>
        </g>
        <g transform="translate(650, 490)">
          <rect width="240" height="55" rx="10" fill="#1E293B" stroke="#A855F7" stroke-width="1.5" filter="url(#cardShadow)"/>
          <text x="120" y="26" fill="#F8FAFC" font-family="Inter, sans-serif" font-size="12" font-weight="600" text-anchor="middle">Local Ollama GPU Inference</text>
          <text x="120" y="44" fill="#94A3B8" font-family="Inter, sans-serif" font-size="10" text-anchor="middle">Qwen 2.5 Coder 7B (RTX 3050)</text>
        </g>
      </svg>
    `;
  }

  // 2. DATABASE ERD SVG
  private renderDatabaseErdSvg(): string {
    const isMg = this.isMindguardProject();
    const isPy = this.isPythonProject();

    if (isMg) {
      return `
        <svg width="960" height="620" viewBox="0 0 960 620" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="erdShadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000000" flood-opacity="0.5"/>
            </filter>
          </defs>

          <!-- TABLE: USUARIO -->
          <g transform="translate(40, 40)" filter="url(#erdShadow)">
            <rect width="270" height="230" rx="12" fill="#151821" stroke="#3B82F6" stroke-width="1.5"/>
            <rect width="270" height="34" rx="12" fill="#1E3A8A"/>
            <text x="135" y="22" fill="#FFFFFF" font-family="Inter, sans-serif" font-size="12" font-weight="700" text-anchor="middle">USUARIO</text>
            
            <text x="15" y="60" fill="#F59E0B" font-family="JetBrains Mono, monospace" font-size="11" font-weight="700">PK  id</text>
            <text x="180" y="60" fill="#94A3B8" font-family="JetBrains Mono, monospace" font-size="11">INTEGER</text>
            
            <text x="15" y="88" fill="#E2E8F0" font-family="JetBrains Mono, monospace" font-size="11">    nombre</text>
            <text x="180" y="88" fill="#94A3B8" font-family="JetBrains Mono, monospace" font-size="11">VARCHAR(100)</text>

            <text x="15" y="116" fill="#E2E8F0" font-family="JetBrains Mono, monospace" font-size="11">UQ  email</text>
            <text x="180" y="116" fill="#94A3B8" font-family="JetBrains Mono, monospace" font-size="11">VARCHAR(150)</text>

            <text x="15" y="144" fill="#E2E8F0" font-family="JetBrains Mono, monospace" font-size="11">    password_hash</text>
            <text x="180" y="144" fill="#94A3B8" font-family="JetBrains Mono, monospace" font-size="11">VARCHAR(255)</text>

            <text x="15" y="172" fill="#E2E8F0" font-family="JetBrains Mono, monospace" font-size="11">    rol</text>
            <text x="180" y="172" fill="#94A3B8" font-family="JetBrains Mono, monospace" font-size="11">VARCHAR(50)</text>

            <text x="15" y="200" fill="#E2E8F0" font-family="JetBrains Mono, monospace" font-size="11">    colegiatura</text>
            <text x="180" y="200" fill="#94A3B8" font-family="JetBrains Mono, monospace" font-size="11">VARCHAR(50)</text>
          </g>

          <!-- TABLE: EVALUACION -->
          <g transform="translate(360, 40)" filter="url(#erdShadow)">
            <rect width="270" height="250" rx="12" fill="#151821" stroke="#10B981" stroke-width="1.5"/>
            <rect width="270" height="34" rx="12" fill="#064E3B"/>
            <text x="135" y="22" fill="#FFFFFF" font-family="Inter, sans-serif" font-size="12" font-weight="700" text-anchor="middle">EVALUACION</text>
            
            <text x="15" y="60" fill="#F59E0B" font-family="JetBrains Mono, monospace" font-size="11" font-weight="700">PK  id</text>
            <text x="180" y="60" fill="#94A3B8" font-family="JetBrains Mono, monospace" font-size="11">INTEGER</text>
            
            <text x="15" y="88" fill="#38BDF8" font-family="JetBrains Mono, monospace" font-size="11" font-weight="700">FK  id_usuario</text>
            <text x="180" y="88" fill="#94A3B8" font-family="JetBrains Mono, monospace" font-size="11">INTEGER</text>

            <text x="15" y="116" fill="#E2E8F0" font-family="JetBrains Mono, monospace" font-size="11">    phq9Score</text>
            <text x="180" y="116" fill="#94A3B8" font-family="JetBrains Mono, monospace" font-size="11">INTEGER</text>

            <text x="15" y="144" fill="#E2E8F0" font-family="JetBrains Mono, monospace" font-size="11">    gad7Score</text>
            <text x="180" y="144" fill="#94A3B8" font-family="JetBrains Mono, monospace" font-size="11">INTEGER</text>

            <text x="15" y="172" fill="#E2E8F0" font-family="JetBrains Mono, monospace" font-size="11">    nivelRiesgo</text>
            <text x="180" y="172" fill="#94A3B8" font-family="JetBrains Mono, monospace" font-size="11">VARCHAR(50)</text>

            <text x="15" y="200" fill="#E2E8F0" font-family="JetBrains Mono, monospace" font-size="11">    has_high_risk</text>
            <text x="180" y="200" fill="#94A3B8" font-family="JetBrains Mono, monospace" font-size="11">BOOLEAN</text>

            <text x="15" y="228" fill="#E2E8F0" font-family="JetBrains Mono, monospace" font-size="11">    fecha</text>
            <text x="180" y="228" fill="#94A3B8" font-family="JetBrains Mono, monospace" font-size="11">TIMESTAMP</text>
          </g>

          <!-- TABLE: RESULTADO_IA -->
          <g transform="translate(680, 40)" filter="url(#erdShadow)">
            <rect width="240" height="170" rx="12" fill="#151821" stroke="#A855F7" stroke-width="1.5"/>
            <rect width="240" height="34" rx="12" fill="#581C87"/>
            <text x="120" y="22" fill="#FFFFFF" font-family="Inter, sans-serif" font-size="12" font-weight="700" text-anchor="middle">RESULTADO_IA</text>
            
            <text x="15" y="60" fill="#F59E0B" font-family="JetBrains Mono, monospace" font-size="11" font-weight="700">PK  id</text>
            <text x="160" y="60" fill="#94A3B8" font-family="JetBrains Mono, monospace" font-size="11">INTEGER</text>
            
            <text x="15" y="88" fill="#38BDF8" font-family="JetBrains Mono, monospace" font-size="11" font-weight="700">FK  id_evaluacion</text>
            <text x="160" y="88" fill="#94A3B8" font-family="JetBrains Mono, monospace" font-size="11">INTEGER</text>

            <text x="15" y="116" fill="#E2E8F0" font-family="JetBrains Mono, monospace" font-size="11">    nivel</text>
            <text x="160" y="116" fill="#94A3B8" font-family="JetBrains Mono, monospace" font-size="11">VARCHAR(10)</text>

            <text x="15" y="144" fill="#E2E8F0" font-family="JetBrains Mono, monospace" font-size="11">    scoreConfianza</text>
            <text x="160" y="144" fill="#94A3B8" font-family="JetBrains Mono, monospace" font-size="11">FLOAT</text>
          </g>

          <!-- TABLE: REGISTRO_EMOCIONAL -->
          <g transform="translate(40, 330)" filter="url(#erdShadow)">
            <rect width="270" height="200" rx="12" fill="#151821" stroke="#EC4899" stroke-width="1.5"/>
            <rect width="270" height="34" rx="12" fill="#831843"/>
            <text x="135" y="22" fill="#FFFFFF" font-family="Inter, sans-serif" font-size="12" font-weight="700" text-anchor="middle">REGISTRO_EMOCIONAL</text>
            
            <text x="15" y="60" fill="#F59E0B" font-family="JetBrains Mono, monospace" font-size="11" font-weight="700">PK  id</text>
            <text x="180" y="60" fill="#94A3B8" font-family="JetBrains Mono, monospace" font-size="11">INTEGER</text>
            
            <text x="15" y="88" fill="#38BDF8" font-family="JetBrains Mono, monospace" font-size="11" font-weight="700">FK  id_usuario</text>
            <text x="180" y="88" fill="#94A3B8" font-family="JetBrains Mono, monospace" font-size="11">INTEGER</text>

            <text x="15" y="116" fill="#E2E8F0" font-family="JetBrains Mono, monospace" font-size="11">    emocion_principal</text>
            <text x="180" y="116" fill="#94A3B8" font-family="JetBrains Mono, monospace" font-size="11">VARCHAR(50)</text>

            <text x="15" y="144" fill="#E2E8F0" font-family="JetBrains Mono, monospace" font-size="11">    intensidad</text>
            <text x="180" y="144" fill="#94A3B8" font-family="JetBrains Mono, monospace" font-size="11">INTEGER</text>

            <text x="15" y="172" fill="#E2E8F0" font-family="JetBrains Mono, monospace" font-size="11">    disparador</text>
            <text x="180" y="172" fill="#94A3B8" font-family="JetBrains Mono, monospace" font-size="11">VARCHAR(200)</text>
          </g>

          <!-- TABLE: CITA -->
          <g transform="translate(360, 330)" filter="url(#erdShadow)">
            <rect width="270" height="200" rx="12" fill="#151821" stroke="#EAB308" stroke-width="1.5"/>
            <rect width="270" height="34" rx="12" fill="#713F12"/>
            <text x="135" y="22" fill="#FFFFFF" font-family="Inter, sans-serif" font-size="12" font-weight="700" text-anchor="middle">CITA</text>
            
            <text x="15" y="60" fill="#F59E0B" font-family="JetBrains Mono, monospace" font-size="11" font-weight="700">PK  id</text>
            <text x="180" y="60" fill="#94A3B8" font-family="JetBrains Mono, monospace" font-size="11">INTEGER</text>
            
            <text x="15" y="88" fill="#38BDF8" font-family="JetBrains Mono, monospace" font-size="11" font-weight="700">FK  id_paciente</text>
            <text x="180" y="88" fill="#94A3B8" font-family="JetBrains Mono, monospace" font-size="11">INTEGER</text>

            <text x="15" y="116" fill="#38BDF8" font-family="JetBrains Mono, monospace" font-size="11" font-weight="700">FK  id_profesional</text>
            <text x="180" y="116" fill="#94A3B8" font-family="JetBrains Mono, monospace" font-size="11">INTEGER</text>

            <text x="15" y="144" fill="#E2E8F0" font-family="JetBrains Mono, monospace" font-size="11">    fecha_cita</text>
            <text x="180" y="144" fill="#94A3B8" font-family="JetBrains Mono, monospace" font-size="11">TIMESTAMP</text>

            <text x="15" y="172" fill="#E2E8F0" font-family="JetBrains Mono, monospace" font-size="11">    estado</text>
            <text x="180" y="172" fill="#94A3B8" font-family="JetBrains Mono, monospace" font-size="11">VARCHAR(50)</text>
          </g>

          <!-- Connectors -->
          <!-- Usuario (1) -> Evaluacion (N) -->
          <path d="M 310 120 L 360 120" stroke="#38BDF8" stroke-width="2" stroke-dasharray="6"/>
          <text x="320" y="110" fill="#F59E0B" font-family="Inter, sans-serif" font-size="12" font-weight="700">1</text>
          <text x="345" y="110" fill="#38BDF8" font-family="Inter, sans-serif" font-size="12" font-weight="700">N</text>

          <!-- Evaluacion (1) -> ResultadoIA (1) -->
          <path d="M 630 120 L 680 120" stroke="#A855F7" stroke-width="2"/>
          <text x="640" y="110" fill="#10B981" font-family="Inter, sans-serif" font-size="12" font-weight="700">1</text>
          <text x="665" y="110" fill="#A855F7" font-family="Inter, sans-serif" font-size="12" font-weight="700">1</text>

          <!-- Usuario (1) -> RegistroEmocional (N) -->
          <path d="M 175 270 L 175 330" stroke="#EC4899" stroke-width="2" stroke-dasharray="6"/>

          <!-- Usuario (1) -> Cita (N) -->
          <path d="M 310 230 L 490 230 L 490 330" stroke="#EAB308" stroke-width="2" stroke-dasharray="6" fill="none"/>
        </svg>
      `;
    }

    if (isPy) {
      return `
        <svg width="960" height="620" viewBox="0 0 960 620" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="erdShadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000000" flood-opacity="0.5"/>
            </filter>
          </defs>

          <!-- TABLE: PATIENTS -->
          <g transform="translate(60, 50)" filter="url(#erdShadow)">
            <rect width="280" height="230" rx="12" fill="#151821" stroke="#3B82F6" stroke-width="1.5"/>
            <rect width="280" height="34" rx="12" fill="#1E3A8A"/>
            <text x="140" y="22" fill="#FFFFFF" font-family="Inter, sans-serif" font-size="12" font-weight="700" text-anchor="middle">PATIENTS</text>
            
            <text x="15" y="60" fill="#F59E0B" font-family="JetBrains Mono, monospace" font-size="11" font-weight="700">PK  id</text>
            <text x="190" y="60" fill="#94A3B8" font-family="JetBrains Mono, monospace" font-size="11">UUID</text>
            
            <text x="15" y="88" fill="#E2E8F0" font-family="JetBrains Mono, monospace" font-size="11">UQ  medical_record_no</text>
            <text x="190" y="88" fill="#94A3B8" font-family="JetBrains Mono, monospace" font-size="11">VARCHAR(32)</text>

            <text x="15" y="116" fill="#E2E8F0" font-family="JetBrains Mono, monospace" font-size="11">    first_name</text>
            <text x="190" y="116" fill="#94A3B8" font-family="JetBrains Mono, monospace" font-size="11">VARCHAR(64)</text>

            <text x="15" y="144" fill="#E2E8F0" font-family="JetBrains Mono, monospace" font-size="11">    last_name</text>
            <text x="190" y="144" fill="#94A3B8" font-family="JetBrains Mono, monospace" font-size="11">VARCHAR(64)</text>

            <text x="15" y="172" fill="#E2E8F0" font-family="JetBrains Mono, monospace" font-size="11">    date_of_birth</text>
            <text x="190" y="172" fill="#94A3B8" font-family="JetBrains Mono, monospace" font-size="11">DATE</text>

            <text x="15" y="200" fill="#E2E8F0" font-family="JetBrains Mono, monospace" font-size="11">    blood_group</text>
            <text x="190" y="200" fill="#94A3B8" font-family="JetBrains Mono, monospace" font-size="11">VARCHAR(8)</text>
          </g>

          <!-- TABLE: CLINICAL_RECORDS -->
          <g transform="translate(560, 50)" filter="url(#erdShadow)">
            <rect width="320" height="250" rx="12" fill="#151821" stroke="#10B981" stroke-width="1.5"/>
            <rect width="320" height="34" rx="12" fill="#064E3B"/>
            <text x="160" y="22" fill="#FFFFFF" font-family="Inter, sans-serif" font-size="12" font-weight="700" text-anchor="middle">CLINICAL_RECORDS</text>
            
            <text x="15" y="60" fill="#F59E0B" font-family="JetBrains Mono, monospace" font-size="11" font-weight="700">PK  id</text>
            <text x="210" y="60" fill="#94A3B8" font-family="JetBrains Mono, monospace" font-size="11">UUID</text>
            
            <text x="15" y="88" fill="#38BDF8" font-family="JetBrains Mono, monospace" font-size="11" font-weight="700">FK  patient_id</text>
            <text x="210" y="88" fill="#94A3B8" font-family="JetBrains Mono, monospace" font-size="11">UUID</text>

            <text x="15" y="116" fill="#E2E8F0" font-family="JetBrains Mono, monospace" font-size="11">    diagnosis_code</text>
            <text x="210" y="116" fill="#94A3B8" font-family="JetBrains Mono, monospace" font-size="11">VARCHAR(32)</text>

            <text x="15" y="144" fill="#E2E8F0" font-family="JetBrains Mono, monospace" font-size="11">    systolic_bp</text>
            <text x="210" y="144" fill="#94A3B8" font-family="JetBrains Mono, monospace" font-size="11">FLOAT</text>

            <text x="15" y="172" fill="#E2E8F0" font-family="JetBrains Mono, monospace" font-size="11">    diastolic_bp</text>
            <text x="210" y="172" fill="#94A3B8" font-family="JetBrains Mono, monospace" font-size="11">FLOAT</text>

            <text x="15" y="200" fill="#E2E8F0" font-family="JetBrains Mono, monospace" font-size="11">    heart_rate</text>
            <text x="210" y="200" fill="#94A3B8" font-family="JetBrains Mono, monospace" font-size="11">FLOAT</text>

            <text x="15" y="228" fill="#E2E8F0" font-family="JetBrains Mono, monospace" font-size="11">    attending_physician</text>
            <text x="210" y="228" fill="#94A3B8" font-family="JetBrains Mono, monospace" font-size="11">VARCHAR(128)</text>
          </g>

          <!-- Connector Patients (1) -> Clinical Records (N) -->
          <path d="M 340 140 L 560 140" stroke="#38BDF8" stroke-width="2" stroke-dasharray="6"/>
          <text x="350" y="130" fill="#F59E0B" font-family="Inter, sans-serif" font-size="12" font-weight="700">1</text>
          <text x="540" y="130" fill="#38BDF8" font-family="Inter, sans-serif" font-size="12" font-weight="700">N</text>
          <polygon points="555,140 545,135 545,145" fill="#38BDF8"/>

          <!-- TABLE: DOCTORS -->
          <g transform="translate(60, 360)" filter="url(#erdShadow)">
            <rect width="280" height="200" rx="12" fill="#151821" stroke="#8B5CF6" stroke-width="1.5"/>
            <rect width="280" height="34" rx="12" fill="#4C1D95"/>
            <text x="140" y="22" fill="#FFFFFF" font-family="Inter, sans-serif" font-size="12" font-weight="700" text-anchor="middle">DOCTORS / PRACTITIONERS</text>
            
            <text x="15" y="60" fill="#F59E0B" font-family="JetBrains Mono, monospace" font-size="11" font-weight="700">PK  id</text>
            <text x="190" y="60" fill="#94A3B8" font-family="JetBrains Mono, monospace" font-size="11">UUID</text>
            
            <text x="15" y="88" fill="#E2E8F0" font-family="JetBrains Mono, monospace" font-size="11">    license_number</text>
            <text x="190" y="88" fill="#94A3B8" font-family="JetBrains Mono, monospace" font-size="11">VARCHAR(32)</text>

            <text x="15" y="116" fill="#E2E8F0" font-family="JetBrains Mono, monospace" font-size="11">    full_name</text>
            <text x="190" y="116" fill="#94A3B8" font-family="JetBrains Mono, monospace" font-size="11">VARCHAR(128)</text>

            <text x="15" y="144" fill="#E2E8F0" font-family="JetBrains Mono, monospace" font-size="11">    specialty</text>
            <text x="190" y="144" fill="#94A3B8" font-family="JetBrains Mono, monospace" font-size="11">VARCHAR(64)</text>

            <text x="15" y="172" fill="#E2E8F0" font-family="JetBrains Mono, monospace" font-size="11">    email</text>
            <text x="190" y="172" fill="#94A3B8" font-family="JetBrains Mono, monospace" font-size="11">VARCHAR(128)</text>
          </g>

          <!-- TABLE: BIOMETRIC_ALERTS -->
          <g transform="translate(560, 360)" filter="url(#erdShadow)">
            <rect width="320" height="200" rx="12" fill="#151821" stroke="#EF4444" stroke-width="1.5"/>
            <rect width="320" height="34" rx="12" fill="#7F1D1D"/>
            <text x="160" y="22" fill="#FFFFFF" font-family="Inter, sans-serif" font-size="12" font-weight="700" text-anchor="middle">BIOMETRIC_TELEMETRY_ALERTS</text>
            
            <text x="15" y="60" fill="#F59E0B" font-family="JetBrains Mono, monospace" font-size="11" font-weight="700">PK  id</text>
            <text x="210" y="60" fill="#94A3B8" font-family="JetBrains Mono, monospace" font-size="11">UUID</text>
            
            <text x="15" y="88" fill="#38BDF8" font-family="JetBrains Mono, monospace" font-size="11" font-weight="700">FK  record_id</text>
            <text x="210" y="88" fill="#94A3B8" font-family="JetBrains Mono, monospace" font-size="11">UUID</text>

            <text x="15" y="116" fill="#E2E8F0" font-family="JetBrains Mono, monospace" font-size="11">    alert_type</text>
            <text x="210" y="116" fill="#94A3B8" font-family="JetBrains Mono, monospace" font-size="11">VARCHAR(32)</text>

            <text x="15" y="144" fill="#E2E8F0" font-family="JetBrains Mono, monospace" font-size="11">    severity</text>
            <text x="210" y="144" fill="#94A3B8" font-family="JetBrains Mono, monospace" font-size="11">CRITICAL</text>

            <text x="15" y="172" fill="#E2E8F0" font-family="JetBrains Mono, monospace" font-size="11">    triggered_at</text>
            <text x="210" y="172" fill="#94A3B8" font-family="JetBrains Mono, monospace" font-size="11">TIMESTAMP</text>
          </g>

          <!-- Connector Clinical Records -> Alerts -->
          <path d="M 720 300 L 720 360" stroke="#EF4444" stroke-width="2" stroke-dasharray="6"/>
        </svg>
      `;
    }

    // Java E-Commerce ERD
    return `
      <svg width="960" height="620" viewBox="0 0 960 620" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="erdShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000000" flood-opacity="0.5"/>
          </filter>
        </defs>

        <!-- TABLE: ORDERS -->
        <g transform="translate(60, 50)" filter="url(#erdShadow)">
          <rect width="280" height="210" rx="12" fill="#151821" stroke="#3B82F6" stroke-width="1.5"/>
          <rect width="280" height="34" rx="12" fill="#1E3A8A"/>
          <text x="140" y="22" fill="#FFFFFF" font-family="Inter, sans-serif" font-size="12" font-weight="700" text-anchor="middle">ORDERS</text>
          
          <text x="15" y="60" fill="#F59E0B" font-family="JetBrains Mono, monospace" font-size="11" font-weight="700">PK  id</text>
          <text x="190" y="60" fill="#94A3B8" font-family="JetBrains Mono, monospace" font-size="11">UUID</text>
          
          <text x="15" y="88" fill="#38BDF8" font-family="JetBrains Mono, monospace" font-size="11" font-weight="700">FK  customer_id</text>
          <text x="190" y="88" fill="#94A3B8" font-family="JetBrains Mono, monospace" font-size="11">UUID</text>

          <text x="15" y="116" fill="#E2E8F0" font-family="JetBrains Mono, monospace" font-size="11">    total_amount</text>
          <text x="190" y="116" fill="#94A3B8" font-family="JetBrains Mono, monospace" font-size="11">DECIMAL</text>

          <text x="15" y="144" fill="#E2E8F0" font-family="JetBrains Mono, monospace" font-size="11">    status</text>
          <text x="190" y="144" fill="#94A3B8" font-family="JetBrains Mono, monospace" font-size="11">VARCHAR</text>

          <text x="15" y="172" fill="#E2E8F0" font-family="JetBrains Mono, monospace" font-size="11">    created_at</text>
          <text x="190" y="172" fill="#94A3B8" font-family="JetBrains Mono, monospace" font-size="11">TIMESTAMP</text>
        </g>

        <!-- TABLE: ORDER_ITEMS -->
        <g transform="translate(560, 50)" filter="url(#erdShadow)">
          <rect width="320" height="210" rx="12" fill="#151821" stroke="#10B981" stroke-width="1.5"/>
          <rect width="320" height="34" rx="12" fill="#064E3B"/>
          <text x="160" y="22" fill="#FFFFFF" font-family="Inter, sans-serif" font-size="12" font-weight="700" text-anchor="middle">ORDER_ITEMS</text>
          
          <text x="15" y="60" fill="#F59E0B" font-family="JetBrains Mono, monospace" font-size="11" font-weight="700">PK  id</text>
          <text x="210" y="60" fill="#94A3B8" font-family="JetBrains Mono, monospace" font-size="11">UUID</text>
          
          <text x="15" y="88" fill="#38BDF8" font-family="JetBrains Mono, monospace" font-size="11" font-weight="700">FK  order_id</text>
          <text x="210" y="88" fill="#94A3B8" font-family="JetBrains Mono, monospace" font-size="11">UUID</text>

          <text x="15" y="116" fill="#38BDF8" font-family="JetBrains Mono, monospace" font-size="11" font-weight="700">FK  product_id</text>
          <text x="210" y="116" fill="#94A3B8" font-family="JetBrains Mono, monospace" font-size="11">UUID</text>

          <text x="15" y="144" fill="#E2E8F0" font-family="JetBrains Mono, monospace" font-size="11">    quantity</text>
          <text x="210" y="144" fill="#94A3B8" font-family="JetBrains Mono, monospace" font-size="11">INTEGER</text>

          <text x="15" y="172" fill="#E2E8F0" font-family="JetBrains Mono, monospace" font-size="11">    unit_price</text>
          <text x="210" y="172" fill="#94A3B8" font-family="JetBrains Mono, monospace" font-size="11">DECIMAL</text>
        </g>

        <!-- Connector Orders (1) -> Order Items (N) -->
        <path d="M 340 140 L 560 140" stroke="#38BDF8" stroke-width="2" stroke-dasharray="6"/>
        <text x="350" y="130" fill="#F59E0B" font-family="Inter, sans-serif" font-size="12" font-weight="700">1</text>
        <text x="540" y="130" fill="#38BDF8" font-family="Inter, sans-serif" font-size="12" font-weight="700">N</text>
      </svg>
    `;
  }

  // 3. C4 CONTAINER SVG
  private renderC4ContainerSvg(): string {
    const isPy = this.isPythonProject();
    const appTitle = isPy ? 'FastAPI Async Backend' : 'Spring Boot Microservice';
    const appTech = isPy ? 'Python 3.11 / Uvicorn ASGI' : 'Java 11 / Tomcat Embedded';

    return `
      <svg width="960" height="580" viewBox="0 0 960 580" xmlns="http://www.w3.org/2000/svg">
        <rect x="20" y="20" width="920" height="540" rx="16" fill="#0B0F19" stroke="#1E293B" stroke-width="2"/>
        <text x="50" y="55" fill="#94A3B8" font-family="Inter, sans-serif" font-size="13" font-weight="700" letter-spacing="1">C4 CONTAINER MODEL — SYSTEM BOUNDARY</text>

        <!-- Container 1: SPA -->
        <g transform="translate(60, 100)">
          <rect width="250" height="150" rx="12" fill="#151821" stroke="#3B82F6" stroke-width="1.5"/>
          <text x="125" y="35" fill="#FFFFFF" font-family="Inter, sans-serif" font-size="14" font-weight="700" text-anchor="middle">Single-Page App</text>
          <text x="125" y="55" fill="#38BDF8" font-family="Inter, sans-serif" font-size="10" font-weight="600" text-anchor="middle">[Container: Angular 20 SPA]</text>
          <text x="125" y="90" fill="#94A3B8" font-family="Inter, sans-serif" font-size="11" text-anchor="middle">Delivers responsive UI for</text>
          <text x="125" y="110" fill="#94A3B8" font-family="Inter, sans-serif" font-size="11" text-anchor="middle">clinicians and operations.</text>
        </g>

        <!-- Connector SPA -> API -->
        <path d="M 310 175 L 430 175" stroke="#60A5FA" stroke-width="2"/>
        <text x="370" y="165" fill="#94A3B8" font-family="Inter, sans-serif" font-size="10" text-anchor="middle">HTTPS / JSON</text>
        <polygon points="425,175 415,170 415,180" fill="#60A5FA"/>

        <!-- Container 2: API Gateway / Core -->
        <g transform="translate(430, 100)">
          <rect width="260" height="150" rx="12" fill="#151821" stroke="#10B981" stroke-width="1.5"/>
          <text x="130" y="35" fill="#FFFFFF" font-family="Inter, sans-serif" font-size="14" font-weight="700" text-anchor="middle">${appTitle}</text>
          <text x="130" y="55" fill="#34D399" font-family="Inter, sans-serif" font-size="10" font-weight="600" text-anchor="middle">[Container: ${appTech}]</text>
          <text x="130" y="90" fill="#94A3B8" font-family="Inter, sans-serif" font-size="11" text-anchor="middle">Exposes REST endpoints, validates</text>
          <text x="130" y="110" fill="#94A3B8" font-family="Inter, sans-serif" font-size="11" text-anchor="middle">DTOs and applies business rules.</text>
        </g>

        <!-- Connector API -> DB -->
        <path d="M 560 250 L 560 350" stroke="#60A5FA" stroke-width="2"/>
        <text x="610" y="305" fill="#94A3B8" font-family="Inter, sans-serif" font-size="10">SQL / TCP</text>
        <polygon points="560,345 555,335 565,335" fill="#60A5FA"/>

        <!-- Container 3: Database -->
        <g transform="translate(430, 350)">
          <rect width="260" height="140" rx="12" fill="#151821" stroke="#F59E0B" stroke-width="1.5"/>
          <text x="130" y="35" fill="#FFFFFF" font-family="Inter, sans-serif" font-size="14" font-weight="700" text-anchor="middle">Relational Database</text>
          <text x="130" y="55" fill="#FBBF24" font-family="Inter, sans-serif" font-size="10" font-weight="600" text-anchor="middle">[Container: PostgreSQL 16]</text>
          <text x="130" y="90" fill="#94A3B8" font-family="Inter, sans-serif" font-size="11" text-anchor="middle">Stores normalized records</text>
          <text x="130" y="110" fill="#94A3B8" font-family="Inter, sans-serif" font-size="11" text-anchor="middle">and transactional logs.</text>
        </g>

        <!-- Container 4: Ollama Local AI -->
        <g transform="translate(60, 350)">
          <rect width="250" height="140" rx="12" fill="#151821" stroke="#A855F7" stroke-width="1.5"/>
          <text x="125" y="35" fill="#FFFFFF" font-family="Inter, sans-serif" font-size="14" font-weight="700" text-anchor="middle">Local AI Daemon</text>
          <text x="125" y="55" fill="#C084FC" font-family="Inter, sans-serif" font-size="10" font-weight="600" text-anchor="middle">[Container: Ollama / Qwen 2.5]</text>
          <text x="125" y="90" fill="#94A3B8" font-family="Inter, sans-serif" font-size="11" text-anchor="middle">Runs hardware-accelerated</text>
          <text x="125" y="110" fill="#94A3B8" font-family="Inter, sans-serif" font-size="11" text-anchor="middle">reverse-engineering agents.</text>
        </g>
      </svg>
    `;
  }

  // 4. CLASS HIERARCHY SVG
  private renderClassDiagramSvg(): string {
    const isPy = this.isPythonProject();

    if (isPy) {
      return `
        <svg width="960" height="580" viewBox="0 0 960 580" xmlns="http://www.w3.org/2000/svg">
          <!-- Class: PatientsRouter -->
          <g transform="translate(60, 40)">
            <rect width="260" height="140" rx="8" fill="#151821" stroke="#3B82F6" stroke-width="1.5"/>
            <rect width="260" height="28" fill="#1E3A8A"/>
            <text x="130" y="19" fill="#FFF" font-family="JetBrains Mono, monospace" font-size="11" font-weight="700" text-anchor="middle">PatientsRouter (FastAPI)</text>
            <text x="12" y="50" fill="#94A3B8" font-family="JetBrains Mono, monospace" font-size="10">+ register_patient(dto)</text>
            <text x="12" y="70" fill="#94A3B8" font-family="JetBrains Mono, monospace" font-size="10">+ get_patient(id)</text>
            <text x="12" y="90" fill="#94A3B8" font-family="JetBrains Mono, monospace" font-size="10">+ add_clinical_observation(dto)</text>
            <text x="12" y="110" fill="#94A3B8" font-family="JetBrains Mono, monospace" font-size="10">+ list_patients(limit)</text>
          </g>

          <!-- Class: PatientService -->
          <g transform="translate(360, 40)">
            <rect width="260" height="140" rx="8" fill="#151821" stroke="#8B5CF6" stroke-width="1.5"/>
            <rect width="260" height="28" fill="#4C1D95"/>
            <text x="130" y="19" fill="#FFF" font-family="JetBrains Mono, monospace" font-size="11" font-weight="700" text-anchor="middle">PatientService</text>
            <text x="12" y="50" fill="#94A3B8" font-family="JetBrains Mono, monospace" font-size="10">+ register_new_patient()</text>
            <text x="12" y="70" fill="#94A3B8" font-family="JetBrains Mono, monospace" font-size="10">+ fetch_patient_summary()</text>
            <text x="12" y="90" fill="#94A3B8" font-family="JetBrains Mono, monospace" font-size="10">+ append_clinical_observation()</text>
            <text x="12" y="110" fill="#94A3B8" font-family="JetBrains Mono, monospace" font-size="10">+ retrieve_all_patients()</text>
          </g>

          <!-- Class: PatientRepository -->
          <g transform="translate(660, 40)">
            <rect width="250" height="140" rx="8" fill="#151821" stroke="#10B981" stroke-width="1.5"/>
            <rect width="250" height="28" fill="#064E3B"/>
            <text x="125" y="19" fill="#FFF" font-family="JetBrains Mono, monospace" font-size="11" font-weight="700" text-anchor="middle">PatientRepository (Async)</text>
            <text x="12" y="50" fill="#94A3B8" font-family="JetBrains Mono, monospace" font-size="10">+ create_patient()</text>
            <text x="12" y="70" fill="#94A3B8" font-family="JetBrains Mono, monospace" font-size="10">+ get_patient_by_id()</text>
            <text x="12" y="90" fill="#94A3B8" font-family="JetBrains Mono, monospace" font-size="10">+ get_patient_by_mrn()</text>
            <text x="12" y="110" fill="#94A3B8" font-family="JetBrains Mono, monospace" font-size="10">+ add_clinical_record()</text>
          </g>

          <!-- Arrow Router -> Service -->
          <path d="M 320 110 L 360 110" stroke="#60A5FA" stroke-width="2"/>
          <!-- Arrow Service -> Repo -->
          <path d="M 620 110 L 660 110" stroke="#60A5FA" stroke-width="2"/>

          <!-- Class: Patient Entity -->
          <g transform="translate(200, 260)">
            <rect width="250" height="150" rx="8" fill="#151821" stroke="#F59E0B" stroke-width="1.5"/>
            <rect width="250" height="28" fill="#78350F"/>
            <text x="125" y="19" fill="#FFF" font-family="JetBrains Mono, monospace" font-size="11" font-weight="700" text-anchor="middle">Patient (SQLAlchemy)</text>
            <text x="12" y="50" fill="#E2E8F0" font-family="JetBrains Mono, monospace" font-size="10">+ id: UUID</text>
            <text x="12" y="70" fill="#E2E8F0" font-family="JetBrains Mono, monospace" font-size="10">+ medical_record_number: str</text>
            <text x="12" y="90" fill="#E2E8F0" font-family="JetBrains Mono, monospace" font-size="10">+ first_name: str</text>
            <text x="12" y="110" fill="#E2E8F0" font-family="JetBrains Mono, monospace" font-size="10">+ records: List[ClinicalRecord]</text>
          </g>

          <!-- Class: ClinicalRecord Entity -->
          <g transform="translate(520, 260)">
            <rect width="260" height="150" rx="8" fill="#151821" stroke="#EC4899" stroke-width="1.5"/>
            <rect width="260" height="28" fill="#831843"/>
            <text x="130" y="19" fill="#FFF" font-family="JetBrains Mono, monospace" font-size="11" font-weight="700" text-anchor="middle">ClinicalRecord (SQLAlchemy)</text>
            <text x="12" y="50" fill="#E2E8F0" font-family="JetBrains Mono, monospace" font-size="10">+ id: UUID</text>
            <text x="12" y="70" fill="#E2E8F0" font-family="JetBrains Mono, monospace" font-size="10">+ patient_id: UUID</text>
            <text x="12" y="90" fill="#E2E8F0" font-family="JetBrains Mono, monospace" font-size="10">+ diagnosis_code: str</text>
            <text x="12" y="110" fill="#E2E8F0" font-family="JetBrains Mono, monospace" font-size="10">+ systolic_bp: float</text>
          </g>

          <!-- Association Patient <-> ClinicalRecord -->
          <path d="M 450 335 L 520 335" stroke="#EC4899" stroke-width="2" stroke-dasharray="4"/>
          <text x="480" y="325" fill="#FFF" font-family="Inter, sans-serif" font-size="11">1 : N</text>
        </svg>
      `;
    }

    // Java Class Diagram
    return `
      <svg width="960" height="580" viewBox="0 0 960 580" xmlns="http://www.w3.org/2000/svg">
        <rect x="60" y="40" width="250" height="130" rx="8" fill="#151821" stroke="#3B82F6" stroke-width="1.5"/>
        <text x="185" y="70" fill="#FFF" font-family="JetBrains Mono, monospace" font-size="12" font-weight="700" text-anchor="middle">OrderController</text>
        <rect x="360" y="40" width="250" height="130" rx="8" fill="#151821" stroke="#8B5CF6" stroke-width="1.5"/>
        <text x="485" y="70" fill="#FFF" font-family="JetBrains Mono, monospace" font-size="12" font-weight="700" text-anchor="middle">OrderService</text>
        <rect x="660" y="40" width="250" height="130" rx="8" fill="#151821" stroke="#10B981" stroke-width="1.5"/>
        <text x="785" y="70" fill="#FFF" font-family="JetBrains Mono, monospace" font-size="12" font-weight="700" text-anchor="middle">OrderRepository</text>
      </svg>
    `;
  }

  // 5. SEQUENCE FLOW SVG
  private renderSequenceSvg(): string {
    const isPy = this.isPythonProject();
    const routerName = isPy ? 'FastAPI Router' : 'REST Controller';
    const srvName = isPy ? 'PatientService' : 'OrderService';
    const actionName = isPy ? 'POST /patients/{id}/records' : 'POST /orders/checkout';
    const dbAction = isPy ? 'INSERT into clinical_records' : 'INSERT into orders, order_items';

    return `
      <svg width="960" height="560" viewBox="0 0 960 560" xmlns="http://www.w3.org/2000/svg">
        <!-- Actors / Lifelines -->
        <g transform="translate(60, 30)">
          <rect width="140" height="40" rx="8" fill="#1E293B" stroke="#3B82F6" stroke-width="1.5"/>
          <text x="70" y="25" fill="#FFF" font-family="Inter, sans-serif" font-size="12" font-weight="600" text-anchor="middle">Client / Clinician</text>
          <line x1="70" y1="40" x2="70" y2="480" stroke="#334155" stroke-dasharray="4"/>
        </g>
        <g transform="translate(280, 30)">
          <rect width="160" height="40" rx="8" fill="#1E293B" stroke="#10B981" stroke-width="1.5"/>
          <text x="80" y="25" fill="#FFF" font-family="Inter, sans-serif" font-size="12" font-weight="600" text-anchor="middle">${routerName}</text>
          <line x1="80" y1="40" x2="80" y2="480" stroke="#334155" stroke-dasharray="4"/>
        </g>
        <g transform="translate(510, 30)">
          <rect width="160" height="40" rx="8" fill="#1E293B" stroke="#8B5CF6" stroke-width="1.5"/>
          <text x="80" y="25" fill="#FFF" font-family="Inter, sans-serif" font-size="12" font-weight="600" text-anchor="middle">${srvName}</text>
          <line x1="80" y1="40" x2="80" y2="480" stroke="#334155" stroke-dasharray="4"/>
        </g>
        <g transform="translate(740, 30)">
          <rect width="160" height="40" rx="8" fill="#1E293B" stroke="#F59E0B" stroke-width="1.5"/>
          <text x="80" y="25" fill="#FFF" font-family="Inter, sans-serif" font-size="12" font-weight="600" text-anchor="middle">PostgreSQL DB</text>
          <line x1="80" y1="40" x2="80" y2="480" stroke="#334155" stroke-dasharray="4"/>
        </g>

        <!-- Message 1: Client -> Router -->
        <path d="M 130 110 L 360 110" stroke="#60A5FA" stroke-width="2"/>
        <polygon points="355,110 345,105 345,115" fill="#60A5FA"/>
        <text x="245" y="100" fill="#94A3B8" font-family="Inter, sans-serif" font-size="11" text-anchor="middle">1. ${actionName}</text>

        <!-- Message 2: Router -> Service -->
        <path d="M 360 170 L 590 170" stroke="#34D399" stroke-width="2"/>
        <polygon points="585,170 575,165 575,175" fill="#34D399"/>
        <text x="475" y="160" fill="#94A3B8" font-family="Inter, sans-serif" font-size="11" text-anchor="middle">2. Validate DTO & invoke domain logic</text>

        <!-- Message 3: Service -> DB -->
        <path d="M 590 230 L 820 230" stroke="#A78BFA" stroke-width="2"/>
        <polygon points="815,230 805,225 805,235" fill="#A78BFA"/>
        <text x="705" y="220" fill="#94A3B8" font-family="Inter, sans-serif" font-size="11" text-anchor="middle">3. ${dbAction}</text>

        <!-- Message 4: DB -> Service -->
        <path d="M 820 290 L 590 290" stroke="#FBBF24" stroke-width="2" stroke-dasharray="4"/>
        <polygon points="595,290 605,285 605,295" fill="#FBBF24"/>
        <text x="705" y="280" fill="#94A3B8" font-family="Inter, sans-serif" font-size="11" text-anchor="middle">4. Commit transaction & return entity</text>

        <!-- Message 5: Service -> Router -->
        <path d="M 590 350 L 360 350" stroke="#34D399" stroke-width="2" stroke-dasharray="4"/>
        <polygon points="365,350 375,345 375,355" fill="#34D399"/>
        <text x="475" y="340" fill="#94A3B8" font-family="Inter, sans-serif" font-size="11" text-anchor="middle">5. Return DTO response</text>

        <!-- Message 6: Router -> Client -->
        <path d="M 360 410 L 130 410" stroke="#60A5FA" stroke-width="2" stroke-dasharray="4"/>
        <polygon points="135,410 145,405 145,415" fill="#60A5FA"/>
        <text x="245" y="400" fill="#94A3B8" font-family="Inter, sans-serif" font-size="11" text-anchor="middle">6. 201 Created JSON response</text>
      </svg>
    `;
  }

  // 6. DEPLOYMENT SVG
  private renderDeploymentSvg(): string {
    return `
      <svg width="960" height="560" viewBox="0 0 960 560" xmlns="http://www.w3.org/2000/svg">
        <rect x="30" y="30" width="900" height="500" rx="16" fill="#0E131F" stroke="#334155" stroke-width="1.5"/>
        <text x="50" y="65" fill="#94A3B8" font-family="Inter, sans-serif" font-size="13" font-weight="700" letter-spacing="1">DOCKER CONTAINER NETWORK & GPU HARDWARE</text>

        <g transform="translate(60, 100)">
          <rect width="250" height="180" rx="12" fill="#151821" stroke="#3B82F6" stroke-width="1.5"/>
          <text x="125" y="35" fill="#FFF" font-family="Inter, sans-serif" font-size="13" font-weight="700" text-anchor="middle">Container: App API</text>
          <text x="125" y="65" fill="#94A3B8" font-family="Inter, sans-serif" font-size="11" text-anchor="middle">Port: 8000 (HTTP)</text>
          <text x="125" y="90" fill="#94A3B8" font-family="Inter, sans-serif" font-size="11" text-anchor="middle">Image: python:3.11-slim</text>
          <text x="125" y="130" fill="#38BDF8" font-family="JetBrains Mono, monospace" font-size="11" text-anchor="middle">bridge_net</text>
        </g>

        <g transform="translate(360, 100)">
          <rect width="250" height="180" rx="12" fill="#151821" stroke="#10B981" stroke-width="1.5"/>
          <text x="125" y="35" fill="#FFF" font-family="Inter, sans-serif" font-size="13" font-weight="700" text-anchor="middle">Container: PostgreSQL</text>
          <text x="125" y="65" fill="#94A3B8" font-family="Inter, sans-serif" font-size="11" text-anchor="middle">Port: 5432 (TCP)</text>
          <text x="125" y="90" fill="#94A3B8" font-family="Inter, sans-serif" font-size="11" text-anchor="middle">Image: postgres:16-alpine</text>
          <text x="125" y="130" fill="#34D399" font-family="JetBrains Mono, monospace" font-size="11" text-anchor="middle">Volume: pgdata</text>
        </g>

        <g transform="translate(660, 100)">
          <rect width="240" height="180" rx="12" fill="#151821" stroke="#A855F7" stroke-width="1.5"/>
          <text x="120" y="35" fill="#FFF" font-family="Inter, sans-serif" font-size="13" font-weight="700" text-anchor="middle">Ollama AI Daemon</text>
          <text x="120" y="65" fill="#94A3B8" font-family="Inter, sans-serif" font-size="11" text-anchor="middle">Port: 11434 (HTTP)</text>
          <text x="120" y="90" fill="#94A3B8" font-family="Inter, sans-serif" font-size="11" text-anchor="middle">Model: Qwen 2.5 Coder 7B</text>
          <text x="120" y="130" fill="#C084FC" font-family="JetBrains Mono, monospace" font-size="11" text-anchor="middle">GPU: RTX 3050 CUDA</text>
        </g>
      </svg>
    `;
  }

  // 7. PROCESS FLOW SVG
  private renderProcessFlowSvg(): string {
    return `
      <svg width="960" height="400" viewBox="0 0 960 400" xmlns="http://www.w3.org/2000/svg">
        <rect x="40" y="160" width="160" height="60" rx="10" fill="#1E293B" stroke="#3B82F6" stroke-width="1.5"/>
        <text x="120" y="195" fill="#FFF" font-family="Inter, sans-serif" font-size="12" font-weight="600" text-anchor="middle">HTTP Ingress</text>

        <path d="M 200 190 L 280 190" stroke="#60A5FA" stroke-width="2"/>
        
        <rect x="280" y="160" width="180" height="60" rx="10" fill="#1E293B" stroke="#8B5CF6" stroke-width="1.5"/>
        <text x="370" y="195" fill="#FFF" font-family="Inter, sans-serif" font-size="12" font-weight="600" text-anchor="middle">Schema Validation</text>

        <path d="M 460 190 L 540 190" stroke="#60A5FA" stroke-width="2"/>

        <rect x="540" y="160" width="180" height="60" rx="10" fill="#1E293B" stroke="#10B981" stroke-width="1.5"/>
        <text x="630" y="195" fill="#FFF" font-family="Inter, sans-serif" font-size="12" font-weight="600" text-anchor="middle">Domain Execution</text>

        <path d="M 720 190 L 800 190" stroke="#60A5FA" stroke-width="2"/>

        <rect x="800" y="160" width="140" height="60" rx="10" fill="#1E293B" stroke="#F59E0B" stroke-width="1.5"/>
        <text x="870" y="195" fill="#FFF" font-family="Inter, sans-serif" font-size="12" font-weight="600" text-anchor="middle">DB Commit</text>
      </svg>
    `;
  }

  // 8. COMPONENT BOUNDARY SVG
  private renderComponentBoundarySvg(): string {
    return `
      <svg width="960" height="500" viewBox="0 0 960 500" xmlns="http://www.w3.org/2000/svg">
        <rect x="40" y="40" width="400" height="400" rx="14" fill="#0F172A" stroke="#3B82F6" stroke-width="1.5"/>
        <text x="60" y="70" fill="#93C5FD" font-family="Inter, sans-serif" font-size="12" font-weight="700">CORE DOMAIN BOUNDARY</text>

        <rect x="520" y="40" width="400" height="400" rx="14" fill="#0F172A" stroke="#10B981" stroke-width="1.5"/>
        <text x="540" y="70" fill="#86EFAC" font-family="Inter, sans-serif" font-size="12" font-weight="700">PERSISTENCE & STORAGE BOUNDARY</text>
      </svg>
    `;
  }

  zoomIn() {
    this.zoomLevel.update(z => Math.min(z + 15, 200));
  }

  zoomOut() {
    this.zoomLevel.update(z => Math.max(z - 15, 50));
  }

  resetZoom() {
    this.zoomLevel.set(100);
  }

  toggleFullscreen() {
    this.isFullscreen.update(f => !f);
  }

  exportSvg() {
    const blob = new Blob([this.rawSvg()], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${this.title().toLowerCase().replace(/[^a-z0-9]+/g, '-')}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  }
}
