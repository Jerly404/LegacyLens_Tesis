import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  template: `
    <button 
      [type]="type()"
      [disabled]="disabled()"
      (click)="onClick($event)"
      [class]="buttonClass()"
    >
      <ng-content></ng-content>
    </button>
  `
})
export class ButtonComponent {
  variant = input<'primary' | 'secondary' | 'danger'>('primary');
  type = input<'button' | 'submit'>('button');
  disabled = input<boolean>(false);
  clicked = output<MouseEvent>();

  onClick(event: MouseEvent) {
    if (!this.disabled()) {
      this.clicked.emit(event);
    }
  }

  buttonClass(): string {
    const base = 'px-6 py-2.5 rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ';
    if (this.variant() === 'primary') {
      return base + 'bg-brand-500 hover:bg-brand-600 text-white focus:ring-brand-500 shadow-md hover:shadow-lg';
    } else if (this.variant() === 'secondary') {
      return base + 'bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 focus:ring-slate-400';
    } else {
      return base + 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-500';
    }
  }
}
