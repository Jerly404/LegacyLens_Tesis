import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (type() === 'card') {
      <div class="bg-[#151821] border border-white/[0.08] rounded-2xl p-6 space-y-4">
        <div class="h-4 w-1/3 bg-white/10 rounded skeleton-shimmer"></div>
        <div class="h-8 w-1/2 bg-white/10 rounded skeleton-shimmer"></div>
        <div class="h-3 w-4/5 bg-white/5 rounded skeleton-shimmer"></div>
      </div>
    } @else if (type() === 'table') {
      <div class="space-y-3">
        <div class="h-10 bg-white/10 rounded-xl skeleton-shimmer"></div>
        <div class="h-12 bg-white/5 rounded-xl skeleton-shimmer"></div>
        <div class="h-12 bg-white/5 rounded-xl skeleton-shimmer"></div>
        <div class="h-12 bg-white/5 rounded-xl skeleton-shimmer"></div>
      </div>
    } @else if (type() === 'lines') {
      <div class="space-y-2">
        <div class="h-4 bg-white/10 rounded skeleton-shimmer" [style.width]="'100%'"></div>
        <div class="h-4 bg-white/10 rounded skeleton-shimmer" [style.width]="'85%'"></div>
        <div class="h-4 bg-white/10 rounded skeleton-shimmer" [style.width]="'60%'"></div>
      </div>
    } @else if (type() === 'chart') {
      <div class="bg-[#151821] border border-white/[0.08] rounded-2xl p-6 h-64 flex items-end justify-between gap-4">
        <div class="w-full bg-white/10 rounded-t h-1/3 skeleton-shimmer"></div>
        <div class="w-full bg-white/10 rounded-t h-2/3 skeleton-shimmer"></div>
        <div class="w-full bg-white/10 rounded-t h-1/2 skeleton-shimmer"></div>
        <div class="w-full bg-white/10 rounded-t h-4/5 skeleton-shimmer"></div>
        <div class="w-full bg-white/10 rounded-t h-3/5 skeleton-shimmer"></div>
      </div>
    }
  `
})
export class SkeletonComponent {
  type = input<'card' | 'table' | 'lines' | 'chart'>('lines');
}
