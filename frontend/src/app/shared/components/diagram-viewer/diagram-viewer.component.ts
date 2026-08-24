import { Component, input, output, signal, ElementRef, viewChild, afterNextRender } from '@angular/core';
import { CommonModule } from '@angular/common';
import mermaid from 'mermaid';

@Component({
  selector: 'app-diagram-viewer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-[#151821] border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl flex flex-col h-full">
      <!-- Toolbar -->
      <div class="px-5 py-3 bg-[#11131B] border-b border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-purple-400 text-lg">schema</span>
          <span class="text-sm font-semibold text-white">{{ title() }}</span>
          <span class="text-xs bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded-full border border-purple-500/20">Mermaid.js</span>
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
        class="flex-1 overflow-auto bg-[#0a0c12] p-8 flex items-center justify-center min-h-[400px] select-none relative"
        [class.fixed]="isFullscreen()"
        [class.inset-0]="isFullscreen()"
        [class.z-50]="isFullscreen()"
      >
        @if (isFullscreen()) {
          <button (click)="toggleFullscreen()" class="absolute top-4 right-4 z-10 px-3 py-1.5 bg-black/60 backdrop-blur text-white text-xs font-medium rounded-xl border border-white/20 flex items-center gap-1">
            <span class="material-symbols-outlined text-sm">close</span>
            Exit Fullscreen
          </button>
        }

        <div 
          #diagramContainer 
          class="transition-transform duration-150 origin-center flex items-center justify-center"
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
  title = input<string>('UML Architecture Diagram');
  
  diagramContainer = viewChild<ElementRef<HTMLDivElement>>('diagramContainer');

  zoomLevel = signal<number>(100);
  isFullscreen = signal<boolean>(false);
  svgContent = signal<string>('');

  constructor() {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'dark',
      themeVariables: {
        darkMode: true,
        background: '#0a0c12',
        primaryColor: '#3B82F6',
        primaryTextColor: '#ffffff',
        primaryBorderColor: '#60A5FA',
        lineColor: '#94A3B8',
        secondaryColor: '#7C3AED',
        tertiaryColor: '#151821'
      }
    });

    afterNextRender(() => {
      this.renderDiagram();
    });
  }

  async renderDiagram() {
    if (!this.definition()) return;
    try {
      const id = 'mermaid-' + Math.random().toString(36).substring(2, 9);
      const { svg } = await mermaid.render(id, this.definition());
      this.svgContent.set(svg);
    } catch (e) {
      console.error('Mermaid render error:', e);
      // Fallback clean preformatted diagram display
      this.svgContent.set(`<pre class="text-left font-mono text-xs text-blue-400 p-4 bg-[#11131B] rounded-xl border border-white/10">${this.definition()}</pre>`);
    }
  }

  zoomIn() {
    this.zoomLevel.update(z => Math.min(200, z + 15));
  }

  zoomOut() {
    this.zoomLevel.update(z => Math.max(40, z - 15));
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
