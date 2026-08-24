import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button 
      [type]="type()"
      [disabled]="disabled() || loading()"
      (click)="onClick($event)"
      [class]="buttonClass()"
    >
      @if (loading()) {
        <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      } @else if (icon()) {
        <span class="material-symbols-outlined mr-1.5 text-base">{{ icon() }}</span>
      }
      <ng-content></ng-content>
    </button>
  `
})
export class ButtonComponent {
  variant = input<'primary' | 'secondary' | 'outline' | 'gradient' | 'danger' | 'ghost'>('primary');
  size = input<'sm' | 'md' | 'lg'>('md');
  type = input<'button' | 'submit'>('button');
  disabled = input<boolean>(false);
  loading = input<boolean>(false);
  icon = input<string>('');
  customClass = input<string>('');
  clicked = output<MouseEvent>();

  onClick(event: MouseEvent) {
    if (!this.disabled() && !this.loading()) {
      this.clicked.emit(event);
    }
  }

  buttonClass(): string {
    const sizeMap = {
      sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
      md: 'px-4 py-2 text-sm rounded-xl gap-2',
      lg: 'px-6 py-3 text-base rounded-xl gap-2.5',
    };

    const base = `inline-flex items-center justify-center font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed ${sizeMap[this.size()]} `;

    let variantStyle = '';
    switch (this.variant()) {
      case 'primary':
        variantStyle = 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20 active:scale-[0.98] border border-blue-400/20';
        break;
      case 'gradient':
        variantStyle = 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg shadow-blue-600/25 active:scale-[0.98] border border-white/10';
        break;
      case 'secondary':
        variantStyle = 'bg-[#1E2333] hover:bg-[#252B3E] text-slate-200 border border-white/[0.08] hover:border-white/20 active:scale-[0.98]';
        break;
      case 'outline':
        variantStyle = 'bg-transparent hover:bg-white/5 text-slate-300 border border-white/15 hover:border-white/30 active:scale-[0.98]';
        break;
      case 'danger':
        variantStyle = 'bg-rose-600/90 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/20 border border-rose-400/20 active:scale-[0.98]';
        break;
      case 'ghost':
        variantStyle = 'bg-transparent hover:bg-white/10 text-slate-400 hover:text-white';
        break;
    }

    return base + variantStyle + ' ' + this.customClass();
  }
}
