import { Component, input } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  template: `
    <div class="glass-panel rounded-2xl p-6 shadow-xl border border-slate-200/50 dark:border-slate-800/50 transition-all duration-300 hover:shadow-2xl">
      @if (title()) {
        <div class="mb-4">
          <h3 class="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">{{ title() }}</h3>
          @if (subtitle()) {
            <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">{{ subtitle() }}</p>
          }
        </div>
      }
      <ng-content></ng-content>
    </div>
  `
})
export class CardComponent {
  title = input<string>('');
  subtitle = input<string>('');
}
