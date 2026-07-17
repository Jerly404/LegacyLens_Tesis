import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { User, UserRole } from '@codelens/shared';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSignal = signal<User | null>(null);

  currentUser = computed(() => this.currentUserSignal());
  isAuthenticated = computed(() => !!this.currentUserSignal());

  constructor(private router: Router) {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      this.currentUserSignal.set(JSON.parse(savedUser));
    }
  }

  login(email: string, role: UserRole = 'DEVELOPER'): Observable<boolean> {
    const mockUser: User = {
      id: 'mock-user-id',
      email,
      name: email.split('@')[0],
      role,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    localStorage.setItem('token', 'mock-jwt-token');
    localStorage.setItem('user', JSON.stringify(mockUser));
    this.currentUserSignal.set(mockUser);
    this.router.navigate(['/dashboard']);
    return of(true);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSignal.set(null);
    this.router.navigate(['/login']);
  }

  hasRole(roles: UserRole[]): boolean {
    const user = this.currentUserSignal();
    return !!user && roles.includes(user.role);
  }
}
