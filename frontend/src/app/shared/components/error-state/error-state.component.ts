import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-error-state',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col items-center justify-center p-12 text-center rounded-2xl bg-[#151821] border border-rose-500/20 my-6 shadow-xl">
      <div class="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-4">
        <span class="material-symbols-outlined text-3xl">error_outline</span>
      </div>
      @if (errorCode()) {
        <span class="text-xs font-mono text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-md border border-rose-500/20 mb-2">ERROR {{ errorCode() }}</span>
      }
      <h3 class="text-lg font-bold text-white mb-2">{{ title() }}</h3>
      <p class="text-sm text-slate-400 max-w-md mb-6 leading-relaxed">{{ description() }}</p>
      
      @if (retryText()) {
        <button (click)="retry.emit()" class="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1E2333] hover:bg-[#252B3E] text-slate-200 border border-white/10 text-sm font-medium rounded-xl transition">
          <span class="material-symbols-outlined text-base">refresh</span>
          {{ retryText() }}
        </button>
      }
    </div>
  `
})
export class ErrorStateComponent {
  title = input<string>('Operation failed');
  description = input<string>('An unexpected error occurred while communicating with the service.');
  errorCode = input<string>('');
  retryText = input<string>('Try Again');
  retry = output<void>();
}
