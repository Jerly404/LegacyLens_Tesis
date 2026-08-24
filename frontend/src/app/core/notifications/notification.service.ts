import { Injectable, signal } from '@angular/core';
import { NotificationItem } from '@codelens/shared';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSignal = signal<NotificationItem[]>([
    {
      id: 'n-1',
      type: 'success',
      title: 'Analysis Completed',
      message: 'Full architecture recovery for legacy-banking-api completed successfully.',
      timestamp: '5 min ago',
      read: false
    },
    {
      id: 'n-2',
      type: 'info',
      title: 'Docs Generated',
      message: 'API documentation for payment-service is ready for export.',
      timestamp: '25 min ago',
      read: false
    },
    {
      id: 'n-3',
      type: 'warning',
      title: 'High Coupling Detected',
      message: 'UserService.java has 14 tight dependencies on legacy DAOs.',
      timestamp: '1 hour ago',
      read: true
    }
  ]);

  private activeToastSignal = signal<NotificationItem | null>(null);

  notifications = this.notificationsSignal.asReadonly();
  activeToast = this.activeToastSignal.asReadonly();

  unreadCount = () => this.notificationsSignal().filter(n => !n.read).length;

  show(type: 'success' | 'info' | 'warning' | 'error', title: string, message: string, duration = 4000) {
    const item: NotificationItem = {
      id: 'notif-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      type,
      title,
      message,
      timestamp: 'Just now',
      read: false
    };

    this.notificationsSignal.update(list => [item, ...list]);
    this.activeToastSignal.set(item);

    if (duration > 0) {
      setTimeout(() => {
        if (this.activeToastSignal()?.id === item.id) {
          this.activeToastSignal.set(null);
        }
      }, duration);
    }
  }

  success(title: string, message: string) {
    this.show('success', title, message);
  }

  info(title: string, message: string) {
    this.show('info', title, message);
  }

  warning(title: string, message: string) {
    this.show('warning', title, message);
  }

  error(title: string, message: string) {
    this.show('error', title, message, 6000);
  }

  dismissToast() {
    this.activeToastSignal.set(null);
  }

  markAllAsRead() {
    this.notificationsSignal.update(list => list.map(n => ({ ...n, read: true })));
  }

  remove(id: string) {
    this.notificationsSignal.update(list => list.filter(n => n.id !== id));
  }

  clearAll() {
    this.notificationsSignal.set([]);
  }
}
