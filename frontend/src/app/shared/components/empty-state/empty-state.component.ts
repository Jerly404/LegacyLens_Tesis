import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="flex flex-col items-center justify-center p-12 text-center rounded-2xl bg-[#151821]/50 border border-white/[0.08] my-4">
      <div class="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4 shadow-glow-primary/10">
        <span class="material-symbols-outlined text-3xl">{{ icon() }}</span>
      </div>
      <h3 class="text-lg font-bold text-white mb-2">{{ title() }}</h3>
      <p class="text-sm text-slate-400 max-w-md mb-6 leading-relaxed">{{ description() }}</p>
      
      @if (actionText()) {
        @if (actionLink()) {
          <a [routerLink]="actionLink()" class="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-xl transition shadow-lg shadow-blue-600/20">
            @if (actionIcon()) {
              <span class="material-symbols-outlined text-base">{{ actionIcon() }}</span>
            }
            {{ actionText() }}
          </a>
        } @else {
          <button (click)="actionClicked.emit()" class="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-xl transition shadow-lg shadow-blue-600/20">
            @if (actionIcon()) {
              <span class="material-symbols-outlined text-base">{{ actionIcon() }}</span>
            }
            {{ actionText() }}
          </button>
        }
      }
    </div>
  `
})
export class EmptyStateComponent {
  icon = input<string>('folder_open');
  title = input<string>('No data found');
  description = input<string>('There are no items to display at this time.');
  actionText = input<string>('');
  actionLink = input<string>('');
  actionIcon = input<string>('add');
  actionClicked = output<void>();
}
