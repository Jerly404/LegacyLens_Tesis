import { Component, input, signal, ElementRef, viewChild, effect } from '@angular/core';
import { CommonModule } from '@angular/common';

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
  
  diagramContainer = viewChild<ElementRef<HTMLDivElement>>('diagramContainer');

  zoomLevel = signal<number>(100);
  isFullscreen = signal<boolean>(false);
  svgContent = signal<string>('');

  constructor() {
    effect(() => {
      const def = this.definition();
      const t = this.title().toLowerCase();
      this.generateRichSvgDiagram(t, def);
    });
  }

  private generateRichSvgDiagram(title: string, def: string) {
    if (title.includes('database') || title.includes('erd') || def.includes('erDiagram')) {
      this.svgContent.set(this.renderDatabaseErdSvg());
    } else if (title.includes('sequence') || def.includes('sequenceDiagram')) {
      this.svgContent.set(this.renderSequenceSvg());
    } else if (title.includes('c4') || def.includes('EnterpriseBoundary')) {
      this.svgContent.set(this.renderC4ContainerSvg());
    } else if (title.includes('class') || def.includes('classDiagram')) {
      this.svgContent.set(this.renderClassDiagramSvg());
    } else if (title.includes('deployment') || title.includes('docker')) {
      this.svgContent.set(this.renderDeploymentSvg());
    } else if (title.includes('flow') || def.includes('flowchart')) {
      this.svgContent.set(this.renderProcessFlowSvg());
    } else if (title.includes('component') || title.includes('boundary')) {
      this.svgContent.set(this.renderComponentBoundarySvg());
    } else {
      this.svgContent.set(this.renderFullstackArchitectureSvg());
    }
  }

  // 1. FULLSTACK ARCHITECTURE SVG
  private renderFullstackArchitectureSvg(): string {
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

        <!-- Tier 1: Clients -->
        <rect x="40" y="30" width="880" height="90" rx="16" fill="url(#layerGrad)" stroke="#334155" stroke-width="1.5"/>
        <text x="60" y="55" fill="#94A3B8" font-family="Inter, sans-serif" font-size="11" font-weight="700" letter-spacing="1">CLIENT & PRESENTATION TIER</text>
        
        <g transform="translate(70, 65)">
          <rect width="240" height="42" rx="10" fill="#1E293B" stroke="#3B82F6" stroke-width="1.5" filter="url(#cardShadow)"/>
          <text x="120" y="26" fill="#F8FAFC" font-family="Inter, sans-serif" font-size="12" font-weight="600" text-anchor="middle">Angular 20 SPA Client</text>
        </g>
        <g transform="translate(360, 65)">
          <rect width="240" height="42" rx="10" fill="#1E293B" stroke="#3B82F6" stroke-width="1.5" filter="url(#cardShadow)"/>
          <text x="120" y="26" fill="#F8FAFC" font-family="Inter, sans-serif" font-size="12" font-weight="600" text-anchor="middle">Mobile App (iOS / Android)</text>
        </g>
        <g transform="translate(650, 65)">
          <rect width="240" height="42" rx="10" fill="#1E293B" stroke="#8B5CF6" stroke-width="1.5" filter="url(#cardShadow)"/>
          <text x="120" y="26" fill="#F8FAFC" font-family="Inter, sans-serif" font-size="12" font-weight="600" text-anchor="middle">Third-Party REST Consumers</text>
        </g>

        <!-- Arrows Tier 1 -> Tier 2 -->
        <path d="M 480 120 L 480 160" stroke="#60A5FA" stroke-width="2" stroke-dasharray="4"/>
        <polygon points="476,155 484,155 480,162" fill="#60A5FA"/>

        <!-- Tier 2: Ingress Gateway -->
        <rect x="40" y="165" width="880" height="85" rx="16" fill="url(#layerGrad)" stroke="#334155" stroke-width="1.5"/>
        <text x="60" y="190" fill="#94A3B8" font-family="Inter, sans-serif" font-size="11" font-weight="700" letter-spacing="1">SECURITY & INGRESS GATEWAY</text>
        
        <g transform="translate(180, 200)">
          <rect width="280" height="40" rx="10" fill="#1E293B" stroke="#10B981" stroke-width="1.5" filter="url(#cardShadow)"/>
          <text x="140" y="25" fill="#F8FAFC" font-family="Inter, sans-serif" font-size="12" font-weight="600" text-anchor="middle">NGINX Ingress & SSL Termination</text>
        </g>
        <g transform="translate(500, 200)">
          <rect width="280" height="40" rx="10" fill="#1E293B" stroke="#EC4899" stroke-width="1.5" filter="url(#cardShadow)"/>
          <text x="140" y="25" fill="#F8FAFC" font-family="Inter, sans-serif" font-size="12" font-weight="600" text-anchor="middle">JWT Security & Rate Limiter</text>
        </g>

        <!-- Arrows Tier 2 -> Tier 3 -->
        <path d="M 480 250 L 480 290" stroke="#60A5FA" stroke-width="2" stroke-dasharray="4"/>
        <polygon points="476,285 484,285 480,292" fill="#60A5FA"/>

        <!-- Tier 3: Application Core -->
        <rect x="40" y="295" width="880" height="110" rx="16" fill="url(#layerGrad)" stroke="#334155" stroke-width="1.5"/>
        <text x="60" y="320" fill="#94A3B8" font-family="Inter, sans-serif" font-size="11" font-weight="700" letter-spacing="1">APPLICATION & DOMAIN SERVICE TIER</text>
        
        <g transform="translate(70, 335)">
          <rect width="240" height="55" rx="10" fill="#1E293B" stroke="#3B82F6" stroke-width="1.5" filter="url(#cardShadow)"/>
          <text x="120" y="26" fill="#F8FAFC" font-family="Inter, sans-serif" font-size="12" font-weight="600" text-anchor="middle">REST Controllers Layer</text>
          <text x="120" y="44" fill="#94A3B8" font-family="Inter, sans-serif" font-size="10" text-anchor="middle">Auth, Projects, Analysis API</text>
        </g>
        <g transform="translate(360, 335)">
          <rect width="240" height="55" rx="10" fill="#1E293B" stroke="#8B5CF6" stroke-width="1.5" filter="url(#cardShadow)"/>
          <text x="120" y="26" fill="#F8FAFC" font-family="Inter, sans-serif" font-size="12" font-weight="600" text-anchor="middle">Domain Business Services</text>
          <text x="120" y="44" fill="#94A3B8" font-family="Inter, sans-serif" font-size="10" text-anchor="middle">Use Cases, AST, Transactions</text>
        </g>
        <g transform="translate(650, 335)">
          <rect width="240" height="55" rx="10" fill="#1E293B" stroke="#F59E0B" stroke-width="1.5" filter="url(#cardShadow)"/>
          <text x="120" y="26" fill="#F8FAFC" font-family="Inter, sans-serif" font-size="12" font-weight="600" text-anchor="middle">Async Background Workers</text>
          <text x="120" y="44" fill="#94A3B8" font-family="Inter, sans-serif" font-size="10" text-anchor="middle">Reverse-Engineering Pipeline</text>
        </g>

        <!-- Arrows Tier 3 -> Tier 4 -->
        <path d="M 480 405 L 480 445" stroke="#60A5FA" stroke-width="2" stroke-dasharray="4"/>
        <polygon points="476,440 484,440 480,447" fill="#60A5FA"/>

        <!-- Tier 4: Data & Messaging -->
        <rect x="40" y="450" width="880" height="110" rx="16" fill="url(#layerGrad)" stroke="#334155" stroke-width="1.5"/>
        <text x="60" y="475" fill="#94A3B8" font-family="Inter, sans-serif" font-size="11" font-weight="700" letter-spacing="1">PERSISTENCE, CACHE & LOCAL AI TIER</text>
        
        <g transform="translate(70, 490)">
          <rect width="240" height="55" rx="10" fill="#1E293B" stroke="#10B981" stroke-width="1.5" filter="url(#cardShadow)"/>
          <text x="120" y="26" fill="#F8FAFC" font-family="Inter, sans-serif" font-size="12" font-weight="600" text-anchor="middle">Primary Relational DB</text>
          <text x="120" y="44" fill="#94A3B8" font-family="Inter, sans-serif" font-size="10" text-anchor="middle">PostgreSQL 16 / Oracle RAC</text>
        </g>
        <g transform="translate(360, 490)">
          <rect width="240" height="55" rx="10" fill="#1E293B" stroke="#EF4444" stroke-width="1.5" filter="url(#cardShadow)"/>
          <text x="120" y="26" fill="#F8FAFC" font-family="Inter, sans-serif" font-size="12" font-weight="600" text-anchor="middle">Redis Distributed Cache</text>
          <text x="120" y="44" fill="#94A3B8" font-family="Inter, sans-serif" font-size="10" text-anchor="middle">Sessions, Locks & Queues</text>
        </g>
        <g transform="translate(650, 490)">
          <rect width="240" height="55" rx="10" fill="#1E293B" stroke="#A855F7" stroke-width="1.5" filter="url(#cardShadow)"/>
          <text x="120" y="26" fill="#F8FAFC" font-family="Inter, sans-serif" font-size="12" font-weight="600" text-anchor="middle">Local Ollama LLM Daemon</text>
          <text x="120" y="44" fill="#94A3B8" font-family="Inter, sans-serif" font-size="10" text-anchor="middle">Qwen 2.5 Coder 7B (GPU RTX 3050)</text>
        </g>
      </svg>
    `;
  }

  // 2. DATABASE ERD SVG
  private renderDatabaseErdSvg(): string {
    return `
      <svg width="960" height="620" viewBox="0 0 960 620" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="erdShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000000" flood-opacity="0.5"/>
          </filter>
        </defs>

        <!-- TABLE: USERS -->
        <g transform="translate(40, 40)" filter="url(#erdShadow)">
          <rect width="260" height="190" rx="12" fill="#151821" stroke="#3B82F6" stroke-width="1.5"/>
          <rect width="260" height="32" rx="12" fill="#1E3A8A"/>
          <text x="130" y="21" fill="#FFFFFF" font-family="Inter, sans-serif" font-size="12" font-weight="700" text-anchor="middle">USERS</text>
          
          <text x="15" y="58" fill="#F59E0B" font-family="JetBrains Mono, monospace" font-size="11" font-weight="700">PK  id</text>
          <text x="180" y="58" fill="#94A3B8" font-family="JetBrains Mono, monospace" font-size="11">UUID</text>
          
          <text x="15" y="84" fill="#E2E8F0" font-family="JetBrains Mono, monospace" font-size="11">    email</text>
          <text x="180" y="84" fill="#94A3B8" font-family="JetBrains Mono, monospace" font-size="11">VARCHAR</text>

          <text x="15" y="110" fill="#E2E8F0" font-family="JetBrains Mono, monospace" font-size="11">    username</text>
          <text x="180" y="110" fill="#94A3B8" font-family="JetBrains Mono, monospace" font-size="11">VARCHAR</text>

          <text x="15" y="136" fill="#E2E8F0" font-family="JetBrains Mono, monospace" font-size="11">    password_hash</text>
          <text x="180" y="136" fill="#94A3B8" font-family="JetBrains Mono, monospace" font-size="11">VARCHAR</text>

          <text x="15" y="162" fill="#E2E8F0" font-family="JetBrains Mono, monospace" font-size="11">    created_at</text>
          <text x="180" y="162" fill="#94A3B8" font-family="JetBrains Mono, monospace" font-size="11">TIMESTAMP</text>
        </g>

        <!-- TABLE: ACCOUNTS -->
        <g transform="translate(360, 40)" filter="url(#erdShadow)">
          <rect width="260" height="210" rx="12" fill="#151821" stroke="#10B981" stroke-width="1.5"/>
          <rect width="260" height="32" rx="12" fill="#064E3B"/>
          <text x="130" y="21" fill="#FFFFFF" font-family="Inter, sans-serif" font-size="12" font-weight="700" text-anchor="middle">ACCOUNTS</text>
          
          <text x="15" y="58" fill="#F59E0B" font-family="JetBrains Mono, monospace" font-size="11" font-weight="700">PK  id</text>
          <text x="180" y="58" fill="#94A3B8" font-family="JetBrains Mono, monospace" font-size="11">UUID</text>
          
          <text x="15" y="84" fill="#38BDF8" font-family="JetBrains Mono, monospace" font-size="11" font-weight="700">FK  user_id</text>
          <text x="180" y="84" fill="#94A3B8" font-family="JetBrains Mono, monospace" font-size="11">UUID</text>

          <text x="15" y="110" fill="#E2E8F0" font-family="JetBrains Mono, monospace" font-size="11">    account_number</text>
          <text x="180" y="110" fill="#94A3B8" font-family="JetBrains Mono, monospace" font-size="11">VARCHAR</text>

          <text x="15" y="136" fill="#E2E8F0" font-family="JetBrains Mono, monospace" font-size="11">    balance</text>
          <text x="180" y="136" fill="#94A3B8" font-family="JetBrains Mono, monospace" font-size="11">DECIMAL</text>

          <text x="15" y="162" fill="#E2E8F0" font-family="JetBrains Mono, monospace" font-size="11">    currency</text>
          <text x="180" y="162" fill="#94A3B8" font-family="JetBrains Mono, monospace" font-size="11">VARCHAR</text>

          <text x="15" y="188" fill="#E2E8F0" font-family="JetBrains Mono, monospace" font-size="11">    status</text>
          <text x="180" y="188" fill="#94A3B8" font-family="JetBrains Mono, monospace" font-size="11">VARCHAR</text>
        </g>

        <!-- TABLE: TRANSACTIONS -->
        <g transform="translate(680, 40)" filter="url(#erdShadow)">
          <rect width="250" height="210" rx="12" fill="#151821" stroke="#8B5CF6" stroke-width="1.5"/>
          <rect width="250" height="32" rx="12" fill="#4C1D95"/>
          <text x="125" y="21" fill="#FFFFFF" font-family="Inter, sans-serif" font-size="12" font-weight="700" text-anchor="middle">TRANSACTIONS</text>
          
          <text x="15" y="58" fill="#F59E0B" font-family="JetBrains Mono, monospace" font-size="11" font-weight="700">PK  id</text>
          <text x="170" y="58" fill="#94A3B8" font-family="JetBrains Mono, monospace" font-size="11">UUID</text>
          
          <text x="15" y="84" fill="#38BDF8" font-family="JetBrains Mono, monospace" font-size="11" font-weight="700">FK  source_acct_id</text>
          <text x="170" y="84" fill="#94A3B8" font-family="JetBrains Mono, monospace" font-size="11">UUID</text>

          <text x="15" y="110" fill="#38BDF8" font-family="JetBrains Mono, monospace" font-size="11" font-weight="700">FK  target_acct_id</text>
          <text x="170" y="110" fill="#94A3B8" font-family="JetBrains Mono, monospace" font-size="11">UUID</text>

          <text x="15" y="136" fill="#E2E8F0" font-family="JetBrains Mono, monospace" font-size="11">    amount</text>
          <text x="170" y="136" fill="#94A3B8" font-family="JetBrains Mono, monospace" font-size="11">DECIMAL</text>

          <text x="15" y="162" fill="#E2E8F0" font-family="JetBrains Mono, monospace" font-size="11">    status</text>
          <text x="170" y="162" fill="#94A3B8" font-family="JetBrains Mono, monospace" font-size="11">VARCHAR</text>

          <text x="15" y="188" fill="#E2E8F0" font-family="JetBrains Mono, monospace" font-size="11">    executed_at</text>
          <text x="170" y="188" fill="#94A3B8" font-family="JetBrains Mono, monospace" font-size="11">TIMESTAMP</text>
        </g>

        <!-- TABLE: LEDGER_ENTRIES -->
        <g transform="translate(360, 360)" filter="url(#erdShadow)">
          <rect width="260" height="190" rx="12" fill="#151821" stroke="#EC4899" stroke-width="1.5"/>
          <rect width="260" height="32" rx="12" fill="#831843"/>
          <text x="130" y="21" fill="#FFFFFF" font-family="Inter, sans-serif" font-size="12" font-weight="700" text-anchor="middle">LEDGER_ENTRIES</text>
          
          <text x="15" y="58" fill="#F59E0B" font-family="JetBrains Mono, monospace" font-size="11" font-weight="700">PK  id</text>
          <text x="180" y="58" fill="#94A3B8" font-family="JetBrains Mono, monospace" font-size="11">UUID</text>
          
          <text x="15" y="84" fill="#38BDF8" font-family="JetBrains Mono, monospace" font-size="11" font-weight="700">FK  transaction_id</text>
          <text x="180" y="84" fill="#94A3B8" font-family="JetBrains Mono, monospace" font-size="11">UUID</text>

          <text x="15" y="110" fill="#E2E8F0" font-family="JetBrains Mono, monospace" font-size="11">    entry_type</text>
          <text x="180" y="110" fill="#94A3B8" font-family="JetBrains Mono, monospace" font-size="11">VARCHAR</text>

          <text x="15" y="136" fill="#E2E8F0" font-family="JetBrains Mono, monospace" font-size="11">    amount</text>
          <text x="180" y="136" fill="#94A3B8" font-family="JetBrains Mono, monospace" font-size="11">DECIMAL</text>

          <text x="15" y="162" fill="#E2E8F0" font-family="JetBrains Mono, monospace" font-size="11">    posted_at</text>
          <text x="180" y="162" fill="#94A3B8" font-family="JetBrains Mono, monospace" font-size="11">TIMESTAMP</text>
        </g>

        <!-- TABLE: AUDIT_LOGS -->
        <g transform="translate(40, 360)" filter="url(#erdShadow)">
          <rect width="260" height="190" rx="12" fill="#151821" stroke="#F59E0B" stroke-width="1.5"/>
          <rect width="260" height="32" rx="12" fill="#78350F"/>
          <text x="130" y="21" fill="#FFFFFF" font-family="Inter, sans-serif" font-size="12" font-weight="700" text-anchor="middle">AUDIT_LOGS</text>
          
          <text x="15" y="58" fill="#F59E0B" font-family="JetBrains Mono, monospace" font-size="11" font-weight="700">PK  id</text>
          <text x="180" y="58" fill="#94A3B8" font-family="JetBrains Mono, monospace" font-size="11">UUID</text>
          
          <text x="15" y="84" fill="#38BDF8" font-family="JetBrains Mono, monospace" font-size="11" font-weight="700">FK  user_id</text>
          <text x="180" y="84" fill="#94A3B8" font-family="JetBrains Mono, monospace" font-size="11">UUID</text>

          <text x="15" y="110" fill="#E2E8F0" font-family="JetBrains Mono, monospace" font-size="11">    action</text>
          <text x="180" y="110" fill="#94A3B8" font-family="JetBrains Mono, monospace" font-size="11">VARCHAR</text>

          <text x="15" y="136" fill="#E2E8F0" font-family="JetBrains Mono, monospace" font-size="11">    resource</text>
          <text x="180" y="136" fill="#94A3B8" font-family="JetBrains Mono, monospace" font-size="11">VARCHAR</text>

          <text x="15" y="162" fill="#E2E8F0" font-family="JetBrains Mono, monospace" font-size="11">    timestamp</text>
          <text x="180" y="162" fill="#94A3B8" font-family="JetBrains Mono, monospace" font-size="11">TIMESTAMP</text>
        </g>

        <!-- Relations Connectors -->
        <path d="M 300 120 L 360 120" stroke="#60A5FA" stroke-width="2"/>
        <text x="330" y="115" fill="#60A5FA" font-family="Inter, sans-serif" font-size="10" text-anchor="middle">1 : N</text>

        <path d="M 620 120 L 680 120" stroke="#60A5FA" stroke-width="2"/>
        <text x="650" y="115" fill="#60A5FA" font-family="Inter, sans-serif" font-size="10" text-anchor="middle">1 : N</text>

        <path d="M 490 250 L 490 360" stroke="#EC4899" stroke-width="2"/>
        <text x="515" y="310" fill="#EC4899" font-family="Inter, sans-serif" font-size="10" text-anchor="middle">1 : N</text>

        <path d="M 170 230 L 170 360" stroke="#F59E0B" stroke-width="2"/>
        <text x="195" y="300" fill="#F59E0B" font-family="Inter, sans-serif" font-size="10" text-anchor="middle">1 : N</text>
      </svg>
    `;
  }

  // 3. SEQUENCE DIAGRAM SVG
  private renderSequenceSvg(): string {
    return `
      <svg width="960" height="520" viewBox="0 0 960 520" xmlns="http://www.w3.org/2000/svg">
        <!-- Actors / Columns -->
        <g transform="translate(60, 30)">
          <rect width="120" height="38" rx="8" fill="#1E293B" stroke="#3B82F6" stroke-width="1.5"/>
          <text x="60" y="24" fill="#FFFFFF" font-family="Inter, sans-serif" font-size="12" font-weight="600" text-anchor="middle">Web Client</text>
          <line x1="60" y1="38" x2="60" y2="460" stroke="#334155" stroke-width="2" stroke-dasharray="4"/>
        </g>

        <g transform="translate(240, 30)">
          <rect width="140" height="38" rx="8" fill="#1E293B" stroke="#10B981" stroke-width="1.5"/>
          <text x="70" y="24" fill="#FFFFFF" font-family="Inter, sans-serif" font-size="12" font-weight="600" text-anchor="middle">API Gateway</text>
          <line x1="70" y1="38" x2="70" y2="460" stroke="#334155" stroke-width="2" stroke-dasharray="4"/>
        </g>

        <g transform="translate(440, 30)">
          <rect width="150" height="38" rx="8" fill="#1E293B" stroke="#8B5CF6" stroke-width="1.5"/>
          <text x="75" y="24" fill="#FFFFFF" font-family="Inter, sans-serif" font-size="12" font-weight="600" text-anchor="middle">Backend Service</text>
          <line x1="75" y1="38" x2="75" y2="460" stroke="#334155" stroke-width="2" stroke-dasharray="4"/>
        </g>

        <g transform="translate(650, 30)">
          <rect width="130" height="38" rx="8" fill="#1E293B" stroke="#F59E0B" stroke-width="1.5"/>
          <text x="65" y="24" fill="#FFFFFF" font-family="Inter, sans-serif" font-size="12" font-weight="600" text-anchor="middle">PostgreSQL DB</text>
          <line x1="65" y1="38" x2="65" y2="460" stroke="#334155" stroke-width="2" stroke-dasharray="4"/>
        </g>

        <g transform="translate(830, 30)">
          <rect width="110" height="38" rx="8" fill="#1E293B" stroke="#EC4899" stroke-width="1.5"/>
          <text x="55" y="24" fill="#FFFFFF" font-family="Inter, sans-serif" font-size="12" font-weight="600" text-anchor="middle">Message Broker</text>
          <line x1="55" y1="38" x2="55" y2="460" stroke="#334155" stroke-width="2" stroke-dasharray="4"/>
        </g>

        <!-- Message 1: Client -> Gateway -->
        <line x1="120" y1="100" x2="305" y2="100" stroke="#60A5FA" stroke-width="2"/>
        <polygon points="300,96 310,100 300,104" fill="#60A5FA"/>
        <text x="215" y="92" fill="#E2E8F0" font-family="Inter, sans-serif" font-size="11" text-anchor="middle">1. POST /transfer</text>

        <!-- Message 2: Gateway -> Service -->
        <line x1="310" y1="145" x2="510" y2="145" stroke="#60A5FA" stroke-width="2"/>
        <polygon points="505,141 515,145 505,149" fill="#60A5FA"/>
        <text x="410" y="137" fill="#E2E8F0" font-family="Inter, sans-serif" font-size="11" text-anchor="middle">2. Validate JWT & Forward</text>

        <!-- Message 3: Service -> DB (Lock) -->
        <line x1="515" y1="190" x2="710" y2="190" stroke="#F59E0B" stroke-width="2"/>
        <polygon points="705,186 715,190 705,194" fill="#F59E0B"/>
        <text x="615" y="182" fill="#F59E0B" font-family="Inter, sans-serif" font-size="11" text-anchor="middle">3. SELECT FOR UPDATE (Lock)</text>

        <!-- Message 4: DB -> Service -->
        <line x1="715" y1="235" x2="515" y2="235" stroke="#94A3B8" stroke-width="1.5" stroke-dasharray="4"/>
        <polygon points="525,231 515,235 525,239" fill="#94A3B8"/>
        <text x="615" y="227" fill="#94A3B8" font-family="Inter, sans-serif" font-size="11" text-anchor="middle">4. Row Locked Return</text>

        <!-- Message 5: Service -> DB (Commit) -->
        <line x1="515" y1="280" x2="710" y2="280" stroke="#10B981" stroke-width="2"/>
        <polygon points="705,276 715,280 705,284" fill="#10B981"/>
        <text x="615" y="272" fill="#10B981" font-family="Inter, sans-serif" font-size="11" text-anchor="middle">5. UPDATE & COMMIT</text>

        <!-- Message 6: Service -> Broker -->
        <line x1="515" y1="325" x2="880" y2="325" stroke="#EC4899" stroke-width="2"/>
        <polygon points="875,321 885,325 875,329" fill="#EC4899"/>
        <text x="700" y="317" fill="#EC4899" font-family="Inter, sans-serif" font-size="11" text-anchor="middle">6. Publish 'TxCompleted' Event</text>

        <!-- Message 7: Service -> Client -->
        <line x1="515" y1="375" x2="120" y2="375" stroke="#3B82F6" stroke-width="2" stroke-dasharray="4"/>
        <polygon points="130,371 120,375 130,379" fill="#3B82F6"/>
        <text x="315" y="367" fill="#3B82F6" font-family="Inter, sans-serif" font-size="11" text-anchor="middle">7. 200 OK Transfer Confirmation</text>
      </svg>
    `;
  }

  // 4. C4 CONTAINER SVG
  private renderC4ContainerSvg(): string {
    return `
      <svg width="960" height="540" viewBox="0 0 960 540" xmlns="http://www.w3.org/2000/svg">
        <rect x="40" y="30" width="880" height="480" rx="20" fill="#0B0F19" stroke="#334155" stroke-width="2" stroke-dasharray="6"/>
        <text x="65" y="60" fill="#94A3B8" font-family="Inter, sans-serif" font-size="13" font-weight="700">ENTERPRISE SYSTEM BOUNDARY [C4 CONTAINER MODEL]</text>

        <!-- Container: Frontend -->
        <g transform="translate(80, 90)">
          <rect width="240" height="150" rx="14" fill="#151821" stroke="#3B82F6" stroke-width="2"/>
          <text x="120" y="35" fill="#FFFFFF" font-family="Inter, sans-serif" font-size="14" font-weight="700" text-anchor="middle">Frontend SPA</text>
          <text x="120" y="55" fill="#60A5FA" font-family="Inter, sans-serif" font-size="11" text-anchor="middle">[Container: Angular 20 Standalone]</text>
          <text x="120" y="90" fill="#94A3B8" font-family="Inter, sans-serif" font-size="11" text-anchor="middle">Provides interactive UI,</text>
          <text x="120" y="108" fill="#94A3B8" font-family="Inter, sans-serif" font-size="11" text-anchor="middle">AST code viewer and dashboards.</text>
        </g>

        <!-- Container: Backend -->
        <g transform="translate(390, 90)">
          <rect width="240" height="150" rx="14" fill="#151821" stroke="#8B5CF6" stroke-width="2"/>
          <text x="120" y="35" fill="#FFFFFF" font-family="Inter, sans-serif" font-size="14" font-weight="700" text-anchor="middle">Backend API</text>
          <text x="120" y="55" fill="#A78BFA" font-family="Inter, sans-serif" font-size="11" text-anchor="middle">[Container: NestJS 10 / Node.js]</text>
          <text x="120" y="90" fill="#94A3B8" font-family="Inter, sans-serif" font-size="11" text-anchor="middle">Handles business rules, AST</text>
          <text x="120" y="108" fill="#94A3B8" font-family="Inter, sans-serif" font-size="11" text-anchor="middle">extraction & auth services.</text>
        </g>

        <!-- Container: Database -->
        <g transform="translate(700, 90)">
          <rect width="200" height="150" rx="14" fill="#151821" stroke="#10B981" stroke-width="2"/>
          <text x="100" y="35" fill="#FFFFFF" font-family="Inter, sans-serif" font-size="14" font-weight="700" text-anchor="middle">Database</text>
          <text x="100" y="55" fill="#34D399" font-family="Inter, sans-serif" font-size="11" text-anchor="middle">[Container: PostgreSQL 16]</text>
          <text x="100" y="90" fill="#94A3B8" font-family="Inter, sans-serif" font-size="11" text-anchor="middle">Stores project metadata,</text>
          <text x="100" y="108" fill="#94A3B8" font-family="Inter, sans-serif" font-size="11" text-anchor="middle">user entities and logs.</text>
        </g>

        <!-- Container: Local AI Engine -->
        <g transform="translate(390, 310)">
          <rect width="240" height="150" rx="14" fill="#151821" stroke="#F59E0B" stroke-width="2"/>
          <text x="120" y="35" fill="#FFFFFF" font-family="Inter, sans-serif" font-size="14" font-weight="700" text-anchor="middle">Local AI Engine</text>
          <text x="120" y="55" fill="#FBBF24" font-family="Inter, sans-serif" font-size="11" text-anchor="middle">[Daemon: Ollama / RTX 3050]</text>
          <text x="120" y="90" fill="#94A3B8" font-family="Inter, sans-serif" font-size="11" text-anchor="middle">Runs Qwen 2.5 Coder 7B</text>
          <text x="120" y="108" fill="#94A3B8" font-family="Inter, sans-serif" font-size="11" text-anchor="middle">for offline AST code reasoning.</text>
        </g>

        <!-- Connecting Lines -->
        <line x1="320" y1="165" x2="390" y2="165" stroke="#60A5FA" stroke-width="2"/>
        <text x="355" y="155" fill="#60A5FA" font-family="Inter, sans-serif" font-size="10" text-anchor="middle">HTTPS / REST</text>

        <line x1="630" y1="165" x2="700" y2="165" stroke="#34D399" stroke-width="2"/>
        <text x="665" y="155" fill="#34D399" font-family="Inter, sans-serif" font-size="10" text-anchor="middle">SQL / TCP</text>

        <line x1="510" y1="240" x2="510" y2="310" stroke="#FBBF24" stroke-width="2"/>
        <text x="560" y="280" fill="#FBBF24" font-family="Inter, sans-serif" font-size="10" text-anchor="middle">HTTP 11434</text>
      </svg>
    `;
  }

  // 5. CLASS DIAGRAM SVG
  private renderClassDiagramSvg(): string {
    return `
      <svg width="960" height="520" viewBox="0 0 960 520" xmlns="http://www.w3.org/2000/svg">
        <!-- Class 1: AuthController -->
        <g transform="translate(60, 40)">
          <rect width="250" height="150" rx="10" fill="#151821" stroke="#3B82F6" stroke-width="1.5"/>
          <rect width="250" height="30" rx="10" fill="#1E3A8A"/>
          <text x="125" y="20" fill="#FFFFFF" font-family="Inter, sans-serif" font-size="12" font-weight="700" text-anchor="middle">AuthController</text>
          <text x="15" y="55" fill="#94A3B8" font-family="JetBrains Mono, monospace" font-size="11">- authService: AuthService</text>
          <text x="15" y="75" fill="#94A3B8" font-family="JetBrains Mono, monospace" font-size="11">- tokenUtil: JwtTokenUtil</text>
          <line x1="0" y1="90" x2="250" y2="90" stroke="#334155" stroke-width="1"/>
          <text x="15" y="112" fill="#E2E8F0" font-family="JetBrains Mono, monospace" font-size="11">+ authenticate(req): Token</text>
          <text x="15" y="132" fill="#E2E8F0" font-family="JetBrains Mono, monospace" font-size="11">+ refreshToken(str): Token</text>
        </g>

        <!-- Class 2: AuthService -->
        <g transform="translate(370, 40)">
          <rect width="250" height="150" rx="10" fill="#151821" stroke="#8B5CF6" stroke-width="1.5"/>
          <rect width="250" height="30" rx="10" fill="#4C1D95"/>
          <text x="125" y="20" fill="#FFFFFF" font-family="Inter, sans-serif" font-size="12" font-weight="700" text-anchor="middle">AuthService</text>
          <text x="15" y="55" fill="#94A3B8" font-family="JetBrains Mono, monospace" font-size="11">- userRepo: UserRepository</text>
          <line x1="0" y1="90" x2="250" y2="90" stroke="#334155" stroke-width="1"/>
          <text x="15" y="112" fill="#E2E8F0" font-family="JetBrains Mono, monospace" font-size="11">+ validateCredentials(): bool</text>
          <text x="15" y="132" fill="#E2E8F0" font-family="JetBrains Mono, monospace" font-size="11">- legacyPasswordVerify(): bool</text>
        </g>

        <!-- Interface 3: UserRepository -->
        <g transform="translate(680, 40)">
          <rect width="240" height="130" rx="10" fill="#151821" stroke="#10B981" stroke-width="1.5"/>
          <rect width="240" height="30" rx="10" fill="#064E3B"/>
          <text x="120" y="20" fill="#FFFFFF" font-family="Inter, sans-serif" font-size="12" font-weight="700" text-anchor="middle">&lt;&lt;interface&gt;&gt; UserRepository</text>
          <text x="15" y="60" fill="#E2E8F0" font-family="JetBrains Mono, monospace" font-size="11">+ findByUsername(): User</text>
          <text x="15" y="85" fill="#E2E8F0" font-family="JetBrains Mono, monospace" font-size="11">+ existsByEmail(): bool</text>
          <text x="15" y="110" fill="#E2E8F0" font-family="JetBrains Mono, monospace" font-size="11">+ save(User): User</text>
        </g>

        <!-- Connecting Lines -->
        <line x1="310" y1="115" x2="370" y2="115" stroke="#60A5FA" stroke-width="2"/>
        <polygon points="360,111 370,115 360,119" fill="#60A5FA"/>

        <line x1="620" y1="115" x2="680" y2="115" stroke="#A78BFA" stroke-width="2"/>
        <polygon points="670,111 680,115 670,119" fill="#A78BFA"/>
      </svg>
    `;
  }

  // 6. DEPLOYMENT DOCKER SVG
  private renderDeploymentSvg(): string {
    return `
      <svg width="960" height="480" viewBox="0 0 960 480" xmlns="http://www.w3.org/2000/svg">
        <rect x="40" y="30" width="880" height="420" rx="16" fill="#0F172A" stroke="#334155" stroke-width="2"/>
        <text x="65" y="60" fill="#94A3B8" font-family="Inter, sans-serif" font-size="12" font-weight="700">DOCKER HOST INFRASTRUCTURE (ARCH LINUX / AMD64)</text>

        <g transform="translate(80, 90)">
          <rect width="240" height="130" rx="12" fill="#1E293B" stroke="#3B82F6" stroke-width="1.5"/>
          <text x="120" y="35" fill="#FFFFFF" font-family="Inter, sans-serif" font-size="13" font-weight="700" text-anchor="middle">legacyai-frontend</text>
          <text x="120" y="58" fill="#60A5FA" font-family="Inter, sans-serif" font-size="11" text-anchor="middle">Port 4200 : 80</text>
          <text x="120" y="90" fill="#94A3B8" font-family="Inter, sans-serif" font-size="11" text-anchor="middle">Network: frontend-net</text>
        </g>

        <g transform="translate(360, 90)">
          <rect width="240" height="130" rx="12" fill="#1E293B" stroke="#8B5CF6" stroke-width="1.5"/>
          <text x="120" y="35" fill="#FFFFFF" font-family="Inter, sans-serif" font-size="13" font-weight="700" text-anchor="middle">legacyai-backend</text>
          <text x="120" y="58" fill="#A78BFA" font-family="Inter, sans-serif" font-size="11" text-anchor="middle">Port 3000 : 3000</text>
          <text x="120" y="90" fill="#94A3B8" font-family="Inter, sans-serif" font-size="11" text-anchor="middle">Network: backend-net</text>
        </g>

        <g transform="translate(640, 90)">
          <rect width="240" height="130" rx="12" fill="#1E293B" stroke="#10B981" stroke-width="1.5"/>
          <text x="120" y="35" fill="#FFFFFF" font-family="Inter, sans-serif" font-size="13" font-weight="700" text-anchor="middle">postgres:16-alpine</text>
          <text x="120" y="58" fill="#34D399" font-family="Inter, sans-serif" font-size="11" text-anchor="middle">Port 5432 : 5432</text>
          <text x="120" y="90" fill="#94A3B8" font-family="Inter, sans-serif" font-size="11" text-anchor="middle">Volume: pgdata</text>
        </g>

        <!-- Hardware Card -->
        <g transform="translate(220, 270)">
          <rect width="520" height="130" rx="14" fill="#151821" stroke="#F59E0B" stroke-width="1.5"/>
          <text x="260" y="35" fill="#FFFFFF" font-family="Inter, sans-serif" font-size="13" font-weight="700" text-anchor="middle">Hardware Acceleration: NVIDIA GeForce RTX 3050 (4GB VRAM)</text>
          <text x="260" y="65" fill="#FBBF24" font-family="Inter, sans-serif" font-size="12" text-anchor="middle">Ollama Daemon :11434 · Qwen 2.5 Coder 7B</text>
          <text x="260" y="95" fill="#94A3B8" font-family="Inter, sans-serif" font-size="11" text-anchor="middle">Direct CUDA 13.3 Compute · Offloaded AST Embeddings</text>
        </g>
      </svg>
    `;
  }

  // 7. COMPONENT BOUNDARY SVG
  private renderComponentBoundarySvg(): string {
    return `
      <svg width="960" height="480" viewBox="0 0 960 480" xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(60, 60)">
          <rect width="250" height="150" rx="12" fill="#1E293B" stroke="#3B82F6" stroke-width="1.5"/>
          <text x="125" y="35" fill="#FFFFFF" font-family="Inter, sans-serif" font-size="13" font-weight="700" text-anchor="middle">Presentation Module</text>
          <text x="125" y="70" fill="#94A3B8" font-family="Inter, sans-serif" font-size="11" text-anchor="middle">• AuthController</text>
          <text x="125" y="95" fill="#94A3B8" font-family="Inter, sans-serif" font-size="11" text-anchor="middle">• ProjectController</text>
          <text x="125" y="120" fill="#94A3B8" font-family="Inter, sans-serif" font-size="11" text-anchor="middle">• AnalysisController</text>
        </g>

        <g transform="translate(370, 60)">
          <rect width="250" height="150" rx="12" fill="#1E293B" stroke="#8B5CF6" stroke-width="1.5"/>
          <text x="125" y="35" fill="#FFFFFF" font-family="Inter, sans-serif" font-size="13" font-weight="700" text-anchor="middle">Application Core</text>
          <text x="125" y="70" fill="#94A3B8" font-family="Inter, sans-serif" font-size="11" text-anchor="middle">• AnalysisPipeline</text>
          <text x="125" y="95" fill="#94A3B8" font-family="Inter, sans-serif" font-size="11" text-anchor="middle">• DocGenerator</text>
          <text x="125" y="120" fill="#94A3B8" font-family="Inter, sans-serif" font-size="11" text-anchor="middle">• UMLGenerator</text>
        </g>

        <g transform="translate(680, 60)">
          <rect width="230" height="150" rx="12" fill="#1E293B" stroke="#10B981" stroke-width="1.5"/>
          <text x="115" y="35" fill="#FFFFFF" font-family="Inter, sans-serif" font-size="13" font-weight="700" text-anchor="middle">Infrastructure</text>
          <text x="115" y="70" fill="#94A3B8" font-family="Inter, sans-serif" font-size="11" text-anchor="middle">• PrismaAdapter</text>
          <text x="115" y="95" fill="#94A3B8" font-family="Inter, sans-serif" font-size="11" text-anchor="middle">• OllamaAdapter</text>
          <text x="115" y="120" fill="#94A3B8" font-family="Inter, sans-serif" font-size="11" text-anchor="middle">• StorageAdapter</text>
        </g>

        <line x1="310" y1="135" x2="370" y2="135" stroke="#60A5FA" stroke-width="2"/>
        <polygon points="360,131 370,135 360,139" fill="#60A5FA"/>

        <line x1="620" y1="135" x2="680" y2="135" stroke="#A78BFA" stroke-width="2"/>
        <polygon points="670,131 680,135 670,139" fill="#A78BFA"/>
      </svg>
    `;
  }

  // 8. PROCESS FLOW SVG
  private renderProcessFlowSvg(): string {
    return `
      <svg width="960" height="520" viewBox="0 0 960 520" xmlns="http://www.w3.org/2000/svg">
        <!-- Start Pill -->
        <g transform="translate(380, 30)">
          <rect width="200" height="40" rx="20" fill="#1E3A8A" stroke="#3B82F6" stroke-width="1.5"/>
          <text x="100" y="25" fill="#FFFFFF" font-family="Inter, sans-serif" font-size="12" font-weight="600" text-anchor="middle">Receive Request</text>
        </g>

        <line x1="480" y1="70" x2="480" y2="110" stroke="#60A5FA" stroke-width="2"/>
        <polygon points="476,105 484,105 480,112" fill="#60A5FA"/>

        <!-- Decision 1: Auth -->
        <g transform="translate(390, 110)">
          <polygon points="90,0 180,40 90,80 0,40" fill="#151821" stroke="#F59E0B" stroke-width="1.5"/>
          <text x="90" y="44" fill="#F59E0B" font-family="Inter, sans-serif" font-size="11" font-weight="600" text-anchor="middle">Is Auth Valid?</text>
        </g>

        <!-- No Branch (Error) -->
        <line x1="390" y1="150" x2="260" y2="150" stroke="#EF4444" stroke-width="2"/>
        <polygon points="265,146 255,150 265,154" fill="#EF4444"/>
        <rect x="130" y="130" width="120" height="40" rx="8" fill="#7F1D1D"/>
        <text x="190" y="155" fill="#FCA5A5" font-family="Inter, sans-serif" font-size="11" text-anchor="middle">Return 401</text>

        <!-- Yes Branch -->
        <line x1="480" y1="190" x2="480" y2="230" stroke="#10B981" stroke-width="2"/>
        <polygon points="476,225 484,225 480,232" fill="#10B981"/>

        <!-- Step 2: Lock & Validate -->
        <g transform="translate(360, 235)">
          <rect width="240" height="50" rx="10" fill="#1E293B" stroke="#8B5CF6" stroke-width="1.5"/>
          <text x="120" y="30" fill="#FFFFFF" font-family="Inter, sans-serif" font-size="12" font-weight="600" text-anchor="middle">Lock DB Row & Validate Rules</text>
        </g>

        <line x1="480" y1="285" x2="480" y2="325" stroke="#60A5FA" stroke-width="2"/>
        <polygon points="476,320 484,320 480,327" fill="#60A5FA"/>

        <!-- Step 3: Commit & Emit -->
        <g transform="translate(360, 330)">
          <rect width="240" height="50" rx="10" fill="#1E293B" stroke="#10B981" stroke-width="1.5"/>
          <text x="120" y="30" fill="#FFFFFF" font-family="Inter, sans-serif" font-size="12" font-weight="600" text-anchor="middle">Commit DB & Publish Event</text>
        </g>

        <line x1="480" y1="380" x2="480" y2="420" stroke="#10B981" stroke-width="2"/>
        <polygon points="476,415 484,415 480,422" fill="#10B981"/>

        <!-- End Pill -->
        <g transform="translate(380, 425)">
          <rect width="200" height="40" rx="20" fill="#064E3B" stroke="#10B981" stroke-width="1.5"/>
          <text x="100" y="25" fill="#FFFFFF" font-family="Inter, sans-serif" font-size="12" font-weight="600" text-anchor="middle">Return 200 OK</text>
        </g>
      </svg>
    `;
  }

  zoomIn() {
    this.zoomLevel.update(z => Math.min(220, z + 15));
  }

  zoomOut() {
    this.zoomLevel.update(z => Math.max(30, z - 15));
  }

  resetZoom() {
    this.zoomLevel.set(100);
  }

  toggleFullscreen() {
    this.isFullscreen.update(f => !f);
  }

  exportSvg() {
    const svg = this.svgContent();
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${this.title().toLowerCase().replace(/[^a-z0-9]+/g, '-')}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  }
}
