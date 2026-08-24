import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-[#151821] border border-white/[0.08] hover:border-blue-500/30 rounded-2xl p-5 transition-all duration-200 shadow-md group">
      <div class="flex items-center justify-between">
        <span class="text-xs font-medium text-slate-400 uppercase tracking-wider">{{ label() }}</span>
        <div [class]="iconWrapperClasses()">
          <span class="material-symbols-outlined text-lg">{{ icon() }}</span>
        </div>
      </div>
      
      <div class="mt-3 flex items-baseline justify-between">
        <span class="text-2xl lg:text-3xl font-bold tracking-tight text-white group-hover:text-blue-400 transition-colors">{{ value() }}</span>
        
        @if (change()) {
          <span [class]="changeBadgeClasses()">
            @if (trend() === 'up') {
              <span class="material-symbols-outlined text-xs mr-0.5">trending_up</span>
            } @else if (trend() === 'down') {
              <span class="material-symbols-outlined text-xs mr-0.5">trending_down</span>
            }
            {{ change() }}
          </span>
        }
      </div>

      @if (subtext()) {
        <p class="mt-1 text-xs text-slate-400">{{ subtext() }}</p>
      }
    </div>
  `
})
export class StatCardComponent {
  label = input<string>('');
  value = input<string | number>('');
  icon = input<string>('analytics');
  iconColor = input<'blue' | 'purple' | 'emerald' | 'amber' | 'rose' | 'cyan'>('blue');
  change = input<string>('');
  trend = input<'up' | 'down' | 'neutral'>('up');
  subtext = input<string>('');

  iconWrapperClasses(): string {
    const colorMap = {
      blue: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
      purple: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
      emerald: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
      amber: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
      rose: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
      cyan: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20',
    };
    return `w-9 h-9 rounded-xl flex items-center justify-center ${colorMap[this.iconColor()] || colorMap.blue}`;
  }

  changeBadgeClasses(): string {
    if (this.trend() === 'up') {
      return 'inline-flex items-center text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20';
    } else if (this.trend() === 'down') {
      return 'inline-flex items-center text-xs font-semibold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-500/20';
    }
    return 'inline-flex items-center text-xs font-semibold text-slate-400 bg-slate-500/10 px-2 py-0.5 rounded-md';
  }
}
