/**
 * services/theme.service.ts
 *
 * Dark / light mode.
 *  - Persists the choice in localStorage
 *  - Toggles the "dark" class on <html>; the light palette lives in styles.scss
 *    under `html:not(.dark)` so every component switches together
 *  - Adds a short-lived "theme-transition" class so colours fade instead of snapping
 */
import { Injectable, signal, effect } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  isDark = signal<boolean>(true);

  constructor() {
    try {
      const saved = localStorage.getItem('portfolio-theme');
      if (saved === 'light') this.isDark.set(false);
    } catch { /* storage unavailable (private mode) - stay on default dark */ }

    effect(() => {
      const dark = this.isDark();
      const root = document.documentElement;
      root.classList.toggle('dark', dark);
      root.style.colorScheme = dark ? 'dark' : 'light';
      try { localStorage.setItem('portfolio-theme', dark ? 'dark' : 'light'); } catch { /* ignore */ }
    });
  }

  toggle() {
    const root = document.documentElement;
    root.classList.add('theme-transition');
    this.isDark.set(!this.isDark());
    setTimeout(() => root.classList.remove('theme-transition'), 450);
  }
}
