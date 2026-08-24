import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../core/notifications/notification.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (notificationService.activeToast(); as toast) {
      <div class="fixed bottom-6 right-6 z-50 max-w-md w-full animate-slide-up">
        <div [class]="toastClasses(toast.type)">
          <div class="flex items-start gap-3">
            <span [class]="iconClasses(toast.type)">{{ getIcon(toast.type) }}</span>
            <div class="flex-1 min-w-0">
              <h4 class="text-sm font-semibold text-white truncate">{{ toast.title }}</h4>
              <p class="text-xs text-slate-300 mt-0.5 leading-relaxed">{{ toast.message }}</p>
            </div>
            <button (click)="notificationService.dismissToast()" class="text-slate-400 hover:text-white transition p-1">
              <span class="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    @keyframes slideUp {
      from { transform: translateY(100%); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    .animate-slide-up {
      animation: slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
  `]
})
export class ToastComponent {
  notificationService = inject(NotificationService);

  getIcon(type: string): string {
    switch (type) {
      case 'success': return 'check_circle';
      case 'warning': return 'warning';
      case 'error': return 'error';
      default: return 'info';
    }
  }

  toastClasses(type: string): string {
    const base = 'p-4 rounded-2xl shadow-2xl backdrop-blur-xl border transition-all ';
    switch (type) {
      case 'success':
        return base + 'bg-[#151821]/95 border-emerald-500/30 text-emerald-400 shadow-emerald-950/40';
      case 'warning':
        return base + 'bg-[#151821]/95 border-amber-500/30 text-amber-400 shadow-amber-950/40';
      case 'error':
        return base + 'bg-[#151821]/95 border-rose-500/30 text-rose-400 shadow-rose-950/40';
      default:
        return base + 'bg-[#151821]/95 border-blue-500/30 text-blue-400 shadow-blue-950/40';
    }
  }

  iconClasses(type: string): string {
    const base = 'material-symbols-outlined text-xl mt-0.5 ';
    switch (type) {
      case 'success': return base + 'text-emerald-400';
      case 'warning': return base + 'text-amber-400';
      case 'error': return base + 'text-rose-400';
      default: return base + 'text-blue-400';
    }
  }
}
