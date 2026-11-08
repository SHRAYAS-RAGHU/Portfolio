/**
 * components/footer/footer.component.ts
 * Simple footer with links and attribution.
 */

import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="border-t border-blue-900/20 py-12 mt-20">
      <div class="section-container">
        <div class="flex flex-col md:flex-row items-center justify-between gap-6">

          <!-- Left: Name & tagline -->
          <div>
            <p class="font-display font-bold text-white text-lg">{{ name() }}</p>
            <p class="text-slate-500 text-sm mt-1 font-body">Full Stack Engineer & AI Researcher</p>
          </div>

          <!-- Center: Nav links -->
          <div class="flex flex-wrap gap-6 justify-center">
            <a routerLink="/"              class="text-slate-500 hover:text-blue-400 text-sm transition-colors font-body">Home</a>
            <a routerLink="/experience"    class="text-slate-500 hover:text-blue-400 text-sm transition-colors font-body">Experience</a>
            <a routerLink="/projects"      class="text-slate-500 hover:text-blue-400 text-sm transition-colors font-body">Projects</a>
            <a routerLink="/system-design" class="text-slate-500 hover:text-blue-400 text-sm transition-colors font-body">System Design</a>
            <a routerLink="/research"      class="text-slate-500 hover:text-blue-400 text-sm transition-colors font-body">Research</a>
          </div>

          <!-- Right: Social links -->
          <div class="flex gap-3">
            <a [href]="github()" target="_blank"
              class="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:border-blue-500/30 transition-all duration-200">
              <!-- GitHub icon -->
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
            </a>
            <a [href]="linkedin()" target="_blank"
              class="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:border-blue-500/30 transition-all duration-200">
              <!-- LinkedIn icon -->
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          </div>
        </div>

        <!-- Bottom bar -->
        <div class="mt-8 pt-6 border-t border-blue-900/20 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p class="text-slate-600 text-xs font-mono">
            Built with Angular 17 + Tailwind CSS — deployed on GitHub Pages
          </p>
          <p class="text-slate-600 text-xs font-mono">
            Press <kbd class="bg-slate-800 px-1 rounded">⌘K</kbd> to search
          </p>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  private dataService = inject(DataService);
  name     = signal('YOUR NAME');
  github   = signal('#');
  linkedin = signal('#');

  constructor() {
    this.dataService.getPersonal().subscribe(p => {
      this.name.set(p.name);
      this.github.set(p.github);
      this.linkedin.set(p.linkedin);
    });
  }
}
