import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="cardClasses()">
      @if (title() || badge()) {
        <div class="flex items-center justify-between pb-3 mb-4 border-b border-white/5">
          <div>
            @if (title()) {
              <h3 class="text-base font-semibold tracking-tight text-white flex items-center gap-2">
                @if (icon()) {
                  <span class="material-symbols-outlined text-blue-400 text-lg">{{ icon() }}</span>
                }
                {{ title() }}
              </h3>
            }
            @if (subtitle()) {
              <p class="text-xs text-slate-400 mt-0.5">{{ subtitle() }}</p>
            }
          </div>
          @if (badge()) {
            <span [class]="badgeClasses()">{{ badge() }}</span>
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
  icon = input<string>('');
  badge = input<string>('');
  badgeColor = input<'blue' | 'purple' | 'emerald' | 'amber' | 'rose'>('blue');
  hoverable = input<boolean>(true);
  customClass = input<string>('');

  cardClasses(): string {
    const base = 'bg-[#151821] border border-white/[0.08] rounded-2xl p-6 transition-all duration-200 shadow-lg ';
    const hover = this.hoverable() ? 'hover:border-blue-500/30 hover:shadow-glow-primary/10 ' : '';
    return base + hover + this.customClass();
  }

  badgeClasses(): string {
    const colorMap = {
      blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      rose: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    };
    return `text-xs px-2.5 py-0.5 rounded-full font-medium border ${colorMap[this.badgeColor()] || colorMap.blue}`;
  }
}
