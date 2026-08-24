import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { NotificationService } from '../../core/notifications/notification.service';
import { UserRole } from '@codelens/shared';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  authService = inject(AuthService);
  notificationService = inject(NotificationService);
  router = inject(Router);

  email = signal<string>('architect@legacyai.io');
  password = signal<string>('••••••••••••');
  rememberMe = signal<boolean>(true);
  loading = signal<boolean>(false);

  login() {
    this.loading.set(true);
    this.authService.login(this.email(), this.password(), this.rememberMe()).subscribe({
      next: () => {
        this.loading.set(false);
        this.notificationService.success('Welcome back', `Logged in as ${this.email()}`);
      },
      error: () => {
        this.loading.set(false);
        this.notificationService.error('Login Failed', 'Please check your credentials.');
      }
    });
  }

  demoLogin(role: UserRole, email: string) {
    this.email.set(email);
    this.password.set('password123');
    this.loading.set(true);
    this.authService.login(email, 'password123', true, role).subscribe({
      next: () => {
        this.loading.set(false);
        this.notificationService.success('Demo Session Started', `Signed in as ${role}`);
      }
    });
  }
}
