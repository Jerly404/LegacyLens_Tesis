import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span [class]="badgeClasses()">
      @if (dot()) {
        <span class="w-1.5 h-1.5 rounded-full mr-1.5" [class]="dotColorClass()"></span>
      }
      @if (icon()) {
        <span class="material-symbols-outlined text-xs mr-1">{{ icon() }}</span>
      }
      <ng-content></ng-content>
    </span>
  `
})
export class BadgeComponent {
  variant = input<'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'outline'>('default');
  size = input<'sm' | 'md'>('sm');
  dot = input<boolean>(false);
  icon = input<string>('');

  badgeClasses(): string {
    const sizeMap = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-1 text-xs font-medium',
    };

    const base = `inline-flex items-center rounded-lg font-medium border ${sizeMap[this.size()]} `;

    switch (this.variant()) {
      case 'success':
        return base + 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'warning':
        return base + 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'danger':
        return base + 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'info':
        return base + 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'purple':
        return base + 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'outline':
        return base + 'bg-transparent text-slate-300 border-white/15';
      default:
        return base + 'bg-white/5 text-slate-300 border-white/10';
    }
  }

  dotColorClass(): string {
    switch (this.variant()) {
      case 'success': return 'bg-emerald-400 animate-pulse';
      case 'warning': return 'bg-amber-400 animate-pulse';
      case 'danger': return 'bg-rose-400 animate-pulse';
      case 'info': return 'bg-blue-400 animate-pulse';
      case 'purple': return 'bg-purple-400 animate-pulse';
      default: return 'bg-slate-400';
    }
  }
}
