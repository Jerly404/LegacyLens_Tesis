import { Component, input, signal, ElementRef, viewChild, effect, afterNextRender } from '@angular/core';
import { CommonModule } from '@angular/common';
import mermaid from 'mermaid';

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
          <span class="text-[10px] bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded-full border border-purple-500/20 font-mono shrink-0">Vector SVG</span>
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
        class="flex-1 overflow-auto bg-[#0a0c12] p-8 flex items-center justify-center min-h-[420px] select-none relative scrollbar-thin"
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
          class="transition-transform duration-150 origin-center flex items-center justify-center w-full h-full"
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
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: 'loose',
      theme: 'dark',
      themeVariables: {
        darkMode: true,
        background: '#0a0c12',
        primaryColor: '#2563EB',
        primaryTextColor: '#F8FAFC',
        primaryBorderColor: '#3B82F6',
        lineColor: '#60A5FA',
        secondaryColor: '#7C3AED',
        tertiaryColor: '#1E293B',
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: '13px'
      }
    });

    effect(() => {
      const def = this.definition();
      if (def) {
        this.renderDiagram(def);
      }
    });
  }

  async renderDiagram(rawCode: string) {
    if (!rawCode) return;
    const cleanCode = rawCode.trim();

    try {
      const id = 'mermaid_svg_' + Math.random().toString(36).substring(2, 9);
      // Clean previous temp containers if any
      const existing = document.getElementById(id);
      if (existing) existing.remove();

      const { svg } = await mermaid.render(id, cleanCode);
      this.svgContent.set(svg);
    } catch (e) {
      console.warn('Mermaid syntax parsing fallback triggered:', e);
      // Generate clean vector graphical boxes and arrows fallback SVG
      this.svgContent.set(this.generateGraphicalFallbackSvg(cleanCode));
    }
  }

  private generateGraphicalFallbackSvg(code: string): string {
    const lines = code.split('\n').filter(l => l.trim().length > 0);
    const diagramType = lines[0] || 'graph TB';

    // Parse simple nodes and labels
    const nodes: Array<{ id: string; label: string }> = [];
    lines.forEach((l, idx) => {
      const match = l.match(/([a-zA-Z0-9_-]+)\["?(.*?)"?\]/) || l.match(/class\s+([a-zA-Z0-9_]+)/);
      if (match && nodes.length < 8) {
        nodes.push({ id: match[1], label: match[2] || match[1] });
      }
    });

    if (nodes.length === 0) {
      nodes.push(
        { id: 'client', label: 'Client / Frontend Tier' },
        { id: 'gateway', label: 'API Gateway & Security' },
        { id: 'backend', label: 'Backend Application Services' },
        { id: 'database', label: 'Database & Cache Cluster' }
      );
    }

    let svgBoxes = '';
    const startY = 40;
    const boxHeight = 65;
    const boxWidth = 260;
    const spacing = 45;

    nodes.forEach((node, i) => {
      const y = startY + i * (boxHeight + spacing);
      svgBoxes += `
        <g transform="translate(120, ${y})">
          <rect width="${boxWidth}" height="${boxHeight}" rx="12" fill="#151821" stroke="#3B82F6" stroke-width="1.5" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.3))"/>
          <text x="${boxWidth / 2}" y="36" fill="#F8FAFC" font-family="Inter, sans-serif" font-size="13" font-weight="600" text-anchor="middle">${node.label}</text>
        </g>
      `;

      if (i < nodes.length - 1) {
        const arrowY = y + boxHeight;
        svgBoxes += `
          <g>
            <line x1="${120 + boxWidth / 2}" y1="${arrowY}" x2="${120 + boxWidth / 2}" y2="${arrowY + spacing}" stroke="#60A5FA" stroke-width="2" stroke-dasharray="4"/>
            <polygon points="${120 + boxWidth / 2 - 5},${arrowY + spacing - 2} ${120 + boxWidth / 2 + 5},${arrowY + spacing - 2} ${120 + boxWidth / 2},${arrowY + spacing + 6}" fill="#60A5FA"/>
          </g>
        `;
      }
    });

    const totalHeight = startY + nodes.length * (boxHeight + spacing) + 20;

    return `
      <svg width="500" height="${totalHeight}" viewBox="0 0 500 ${totalHeight}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#3B82F6" stop-opacity="0.2"/>
            <stop offset="100%" stop-color="#7C3AED" stop-opacity="0.2"/>
          </linearGradient>
        </defs>
        ${svgBoxes}
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
