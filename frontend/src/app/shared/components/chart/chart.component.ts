import { Component, input, OnInit } from '@angular/core';

@Component({
  selector: 'app-chart',
  standalone: true,
  template: `
    <div class="glass-panel p-6 rounded-2xl shadow-md border border-slate-200/50 dark:border-slate-800/50">
      <h3 class="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-4 tracking-wider uppercase">{{ title() }}</h3>
      <div class="h-64 flex items-end justify-between px-4 pb-2 pt-8 relative">
        <!-- Mock Chart bar heights based on data input -->
        <div class="absolute inset-0 flex flex-col justify-between pointer-events-none border-b border-slate-200/50 dark:border-slate-800/50 pb-8">
          <div class="border-t border-slate-200/20 dark:border-slate-800/20 w-full"></div>
          <div class="border-t border-slate-200/20 dark:border-slate-800/20 w-full"></div>
          <div class="border-t border-slate-200/20 dark:border-slate-800/20 w-full"></div>
        </div>
        @for (item of data(); track item.label) {
          <div class="flex flex-col items-center flex-1 group z-10">
            <div class="text-xs font-semibold mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-brand-500 text-white px-2 py-0.5 rounded shadow">
              {{ item.value }}
            </div>
            <div 
              class="w-8 bg-gradient-to-t from-brand-600 to-brand-400 rounded-t-lg transition-all duration-500 ease-out group-hover:brightness-110 shadow-lg"
              [style.height.%]="item.value"
            ></div>
            <span class="text-xs text-slate-500 dark:text-slate-400 mt-2 truncate w-full text-center">{{ item.label }}</span>
          </div>
        }
      </div>
    </div>
  `
})
export class ChartComponent {
  title = input<string>('Performance Metrics');
  data = input<Array<{ label: string, value: number }>>([
    { label: 'Parser', value: 75 },
    { label: 'Analyzer', value: 85 },
    { label: 'RAG', value: 60 },
    { label: 'UML', value: 95 }
  ]);
}
