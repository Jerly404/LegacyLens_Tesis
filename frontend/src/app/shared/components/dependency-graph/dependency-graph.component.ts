import { Component, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DependencyGraphData, DependencyGraphNode } from '@codelens/shared';

@Component({
  selector: 'app-dependency-graph',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-[#151821] border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl flex flex-col h-full">
      <!-- Toolbar -->
      <div class="px-5 py-3.5 bg-[#11131B] border-b border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <span class="material-symbols-outlined text-blue-400 text-lg">account_tree</span>
          <div>
            <h3 class="text-sm font-semibold text-white">Interactive Dependency Call Graph</h3>
            <p class="text-xs text-slate-400">Click a node to inspect call graph relationships and architectural coupling.</p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <!-- Layer filters -->
          <div class="flex items-center bg-white/5 rounded-xl p-0.5 border border-white/10 text-xs">
            <button 
              (click)="selectedLayer.set('all')" 
              [class]="selectedLayer() === 'all' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'"
              class="px-2.5 py-1 rounded-lg transition font-medium"
            >
              All Layers
            </button>
            <button 
              (click)="selectedLayer.set('Presentation Layer')" 
              [class]="selectedLayer() === 'Presentation Layer' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'"
              class="px-2.5 py-1 rounded-lg transition font-medium"
            >
              Presentation
            </button>
            <button 
              (click)="selectedLayer.set('Application Service Layer')" 
              [class]="selectedLayer() === 'Application Service Layer' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'"
              class="px-2.5 py-1 rounded-lg transition font-medium"
            >
              Services
            </button>
            <button 
              (click)="selectedLayer.set('Persistence Layer')" 
              [class]="selectedLayer() === 'Persistence Layer' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'"
              class="px-2.5 py-1 rounded-lg transition font-medium"
            >
              Persistence
            </button>
          </div>

          <div class="h-4 w-px bg-white/10 mx-1"></div>

          <button (click)="zoomIn()" class="p-1.5 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition">
            <span class="material-symbols-outlined text-sm">zoom_in</span>
          </button>
          <button (click)="zoomOut()" class="p-1.5 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition">
            <span class="material-symbols-outlined text-sm">zoom_out</span>
          </button>
          <button (click)="resetView()" class="p-1.5 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition text-xs font-mono">
            Reset
          </button>
        </div>
      </div>

      <!-- Graph Canvas -->
      <div class="flex-1 min-h-[440px] bg-[#0A0C12] relative overflow-hidden flex items-center justify-center p-8 select-none">
        <!-- SVG Grid Background -->
        <svg class="absolute inset-0 w-full h-full opacity-10 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="white" stroke-width="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        <!-- Nodes Display Container -->
        <div 
          class="transition-transform duration-200 origin-center relative w-full max-w-4xl"
          [style.transform]="'scale(' + (zoom() / 100) + ')'"
        >
          <div class="grid grid-cols-4 gap-8 relative z-10">
            <!-- Presentation Column -->
            <div class="space-y-4">
              <div class="text-xs font-mono uppercase tracking-wider text-blue-400 pb-2 border-b border-blue-500/20 flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-blue-400"></span>
                Controllers
              </div>
              @for (node of getNodesByLayer('Presentation Layer'); track node.id) {
                <div 
                  (click)="selectNode(node)"
                  [class]="getNodeClass(node)"
                >
                  <span class="material-symbols-outlined text-xs text-blue-400">api</span>
                  <span class="font-mono text-xs text-white truncate">{{ node.name }}</span>
                </div>
              }
            </div>

            <!-- Service Column -->
            <div class="space-y-4">
              <div class="text-xs font-mono uppercase tracking-wider text-purple-400 pb-2 border-b border-purple-500/20 flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-purple-400"></span>
                Services
              </div>
              @for (node of getNodesByLayer('Application Service Layer'); track node.id) {
                <div 
                  (click)="selectNode(node)"
                  [class]="getNodeClass(node)"
                >
                  <span class="material-symbols-outlined text-xs text-purple-400">psychology</span>
                  <span class="font-mono text-xs text-white truncate">{{ node.name }}</span>
                </div>
              }
            </div>

            <!-- Persistence Column -->
            <div class="space-y-4">
              <div class="text-xs font-mono uppercase tracking-wider text-emerald-400 pb-2 border-b border-emerald-500/20 flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
                Repositories & DAO
              </div>
              @for (node of getNodesByLayer('Persistence Layer'); track node.id) {
                <div 
                  (click)="selectNode(node)"
                  [class]="getNodeClass(node)"
                >
                  <span class="material-symbols-outlined text-xs text-emerald-400">dataset</span>
                  <span class="font-mono text-xs text-white truncate">{{ node.name }}</span>
                </div>
              }
            </div>

            <!-- Database & External Column -->
            <div class="space-y-4">
              <div class="text-xs font-mono uppercase tracking-wider text-amber-400 pb-2 border-b border-amber-500/20 flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-amber-400"></span>
                Database & MQ
              </div>
              @for (node of getNodesByLayer('Database Layer'); track node.id) {
                <div 
                  (click)="selectNode(node)"
                  [class]="getNodeClass(node)"
                >
                  <span class="material-symbols-outlined text-xs text-amber-400">database</span>
                  <span class="font-mono text-xs text-white truncate">{{ node.name }}</span>
                </div>
              }
              @for (node of getNodesByLayer('Message Infrastructure'); track node.id) {
                <div 
                  (click)="selectNode(node)"
                  [class]="getNodeClass(node)"
                >
                  <span class="material-symbols-outlined text-xs text-cyan-400">hub</span>
                  <span class="font-mono text-xs text-white truncate">{{ node.name }}</span>
                </div>
              }
            </div>
          </div>
        </div>

        <!-- Node Inspector Drawer / Popup -->
        @if (activeNode(); as node) {
          <div class="absolute bottom-4 right-4 bg-[#151821]/95 border border-blue-500/30 backdrop-blur-xl rounded-2xl p-4 shadow-2xl max-w-sm w-full animate-fade-in z-20">
            <div class="flex items-start justify-between">
              <div>
                <span class="text-[10px] font-mono uppercase tracking-wider text-blue-400">{{ node.layer }}</span>
                <h4 class="text-sm font-bold text-white mt-0.5">{{ node.name }}</h4>
              </div>
              <button (click)="activeNode.set(null)" class="text-slate-400 hover:text-white p-1">
                <span class="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            <div class="mt-3 pt-3 border-t border-white/10 space-y-2 text-xs">
              <div class="flex justify-between text-slate-300">
                <span class="text-slate-500">Component Type:</span>
                <span class="font-medium text-white">{{ node.type | uppercase }}</span>
              </div>
              <div class="flex justify-between text-slate-300">
                <span class="text-slate-500">Inbound / Outbound Calls:</span>
                <span class="font-medium text-emerald-400">1,250 queries / min</span>
              </div>
              <div class="flex justify-between text-slate-300">
                <span class="text-slate-500">Coupling Score:</span>
                <span class="font-medium text-amber-400">Moderate (Afferent = 3, Efferent = 4)</span>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class DependencyGraphComponent {
  data = input<DependencyGraphData>({ nodes: [], links: [] });

  zoom = signal<number>(100);
  selectedLayer = signal<string>('all');
  activeNode = signal<DependencyGraphNode | null>(null);

  getNodesByLayer(layer: string): DependencyGraphNode[] {
    return this.data().nodes.filter(n => n.layer === layer);
  }

  selectNode(node: DependencyGraphNode) {
    this.activeNode.set(node);
  }

  zoomIn() {
    this.zoom.update(z => Math.min(160, z + 15));
  }

  zoomOut() {
    this.zoom.update(z => Math.max(60, z - 15));
  }

  resetView() {
    this.zoom.set(100);
    this.selectedLayer.set('all');
    this.activeNode.set(null);
  }

  getNodeClass(node: DependencyGraphNode): string {
    const isSelected = this.activeNode()?.id === node.id;
    const base = 'p-3 rounded-xl border flex items-center gap-2 cursor-pointer transition-all duration-200 ';
    
    if (isSelected) {
      return base + 'bg-blue-600/20 border-blue-400 shadow-glow-primary scale-105';
    }
    
    return base + 'bg-[#151821] border-white/10 hover:border-blue-500/40 hover:bg-[#1A1E2B] hover:scale-[1.02] shadow-md';
  }
}
