import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  isDarkMode = signal<boolean>(false);

  initTheme() {
    const theme = localStorage.getItem('theme') || 'dark';
    this.setTheme(theme === 'dark');
  }

  setTheme(isDark: boolean) {
    this.isDarkMode.set(isDark);
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }

  toggleTheme() {
    this.setTheme(!this.isDarkMode());
  }
}
