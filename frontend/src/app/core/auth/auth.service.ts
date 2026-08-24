import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { User, UserRole } from '@codelens/shared';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private defaultUser: User = {
    id: 'usr-98124',
    email: 'architect@legacyai.io',
    name: 'Alex Vance',
    role: 'ADMIN',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2026-08-20T12:00:00Z'
  };

  private currentUserSignal = signal<User | null>(null);

  currentUser = computed(() => this.currentUserSignal());
  isAuthenticated = computed(() => !!this.currentUserSignal());

  constructor(private router: Router) {
    const savedUser = localStorage.getItem('legacyai_user');
    if (savedUser) {
      try {
        this.currentUserSignal.set(JSON.parse(savedUser));
      } catch {
        this.currentUserSignal.set(this.defaultUser);
        localStorage.setItem('legacyai_user', JSON.stringify(this.defaultUser));
      }
    } else {
      // Default to authenticated session for seamless dev/presentation experience
      this.currentUserSignal.set(this.defaultUser);
      localStorage.setItem('legacyai_user', JSON.stringify(this.defaultUser));
    }
  }

  login(email: string, password?: string, rememberMe = true, role: UserRole = 'ADMIN'): Observable<boolean> {
    const name = email.split('@')[0].replace('.', ' ').replace(/^./, str => str.toUpperCase());
    const user: User = {
      id: 'usr-' + Math.floor(Math.random() * 90000 + 10000),
      email,
      name: name || 'Engineer',
      role,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return of(true).pipe(
      delay(400),
      tap(() => {
        if (rememberMe) {
          localStorage.setItem('legacyai_token', 'jwt_sess_' + Date.now());
          localStorage.setItem('legacyai_user', JSON.stringify(user));
        } else {
          sessionStorage.setItem('legacyai_token', 'jwt_sess_' + Date.now());
          sessionStorage.setItem('legacyai_user', JSON.stringify(user));
        }
        this.currentUserSignal.set(user);
        this.router.navigate(['/dashboard']);
      })
    );
  }

  logout() {
    localStorage.removeItem('legacyai_token');
    localStorage.removeItem('legacyai_user');
    sessionStorage.removeItem('legacyai_token');
    sessionStorage.removeItem('legacyai_user');
    this.currentUserSignal.set(null);
    this.router.navigate(['/login']);
  }

  hasRole(roles: UserRole[]): boolean {
    const user = this.currentUserSignal();
    return !!user && roles.includes(user.role);
  }
}
