import { Component, input, effect, signal } from '@angular/core';

@Component({
  selector: 'app-diagram',
  standalone: true,
  template: `
    <div class="glass-panel p-6 rounded-2xl shadow-md border border-slate-200/50 dark:border-slate-800/50 flex flex-col items-center">
      <div class="w-full flex justify-between items-center mb-4">
        <h3 class="text-sm font-semibold text-slate-500 dark:text-slate-400 tracking-wider uppercase">UML Diagram Architecture</h3>
        <span class="text-xs bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full">MermaidJS</span>
      </div>
      <div class="bg-slate-900/5 dark:bg-slate-950 p-6 rounded-xl w-full border border-slate-200/20 dark:border-slate-800/30 overflow-auto font-mono text-sm">
        <pre class="text-left text-brand-700 dark:text-brand-300">{{ definition() }}</pre>
      </div>
    </div>
  `
})
export class DiagramComponent {
  definition = input<string>('classDiagram\n  Class01 <|-- AveryLongClass : Cool\n  Class03 *-- Class04\n  Class05 o-- Class06');
}
