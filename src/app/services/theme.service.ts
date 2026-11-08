/**
 * services/theme.service.ts
 *
 * Manages dark/light mode preference.
 * Persists choice to localStorage so it survives page refreshes.
 * Toggles the 'dark' class on <html> — Tailwind's darkMode:'class' picks this up.
 */

import { Injectable, signal, effect } from '@angular/core';

export type Theme = 'dark' | 'light';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  // Reactive signal — any component can read isDark() directly
  isDark = signal<boolean>(true);

  constructor() {
    // Restore saved preference on startup
    const saved = localStorage.getItem('portfolio-theme') as Theme | null;
    if (saved) {
      this.isDark.set(saved === 'dark');
    }

    // Apply class to <html> whenever the signal changes
    effect(() => {
      const dark = this.isDark();
      document.documentElement.classList.toggle('dark', dark);
      localStorage.setItem('portfolio-theme', dark ? 'dark' : 'light');
    });
  }

  toggle() {
    this.isDark.update(v => !v);
  }
}
