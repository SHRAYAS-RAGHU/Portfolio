/**
 * services/data.service.ts
 *
 * Loads the portfolio data.json once and caches it.
 * All components inject this service rather than fetching data themselves.
 * Uses shareReplay(1) so the HTTP call is made only once regardless of
 * how many components subscribe.
 */

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PlatformLocation } from '@angular/common';
import { Observable, shareReplay, map, catchError, throwError } from 'rxjs';
import { PortfolioData, Experience, CommandResult } from '../models/portfolio.models';

@Injectable({ providedIn: 'root' })
export class DataService {
  private http = inject(HttpClient);
  private platformLocation = inject(PlatformLocation);

  // Cached data stream — only one HTTP request is ever made
  private data$: Observable<PortfolioData> = this.http
    .get<PortfolioData>('assets/data/data.json')
    .pipe(
      map(data => {
        const baseHref = this.platformLocation.getBaseHrefFromDOM() || '/';
        const cleanBase = baseHref.endsWith('/') ? baseHref : baseHref + '/';

        // Helper to cleanly prefix asset paths without duplicating
        const fixPath = (path?: string) => {
          if (!path) return path;
          if (path.startsWith('http://') || path.startsWith('https://')) return path;
          if (path.startsWith(cleanBase)) return path;

          const cleanPath = path.startsWith('/') ? path.slice(1) : path;
          return cleanBase + cleanPath;
        };

        // Fix personal info asset paths globally (photo, resume, etc.)
        if (data.personal) {
          data.personal.photo = fixPath(data.personal.photo)!;
          data.personal.resumeUrl = fixPath(data.personal.resumeUrl)!;
        }

        return data;
      }),
      // Log the failing URL + status so problems are visible in DevTools > Console
      catchError(err => {
        console.error('[DataService] Failed to load assets/data/data.json', err);
        return throwError(() => err);
      }),
      shareReplay(1)
    );

  /** Returns the full portfolio data object */
  getData(): Observable<PortfolioData> {
    return this.data$;
  }

  /** Convenience: just personal info */
  getPersonal() {
    return this.data$.pipe(map(d => d.personal));
  }

  /** Convenience: just experiences (for the filter page) */
  getExperiences() {
    return this.data$.pipe(map(d => d.experiences));
  }

  /**
   * Builds a flat list of CommandResult objects from all data sections.
   * Used by the command palette to search across the entire portfolio.
   */
  getCommandResults(): Observable<CommandResult[]> {
    return this.data$.pipe(
      map(data => {
        const results: CommandResult[] = [];

        // Navigation entries always appear first
        const navItems = [
          { title: 'Home',          route: '/' },
          { title: 'Experience',    route: '/experience' },
          { title: 'Projects',      route: '/projects' },
          { title: 'System Design', route: '/system-design' },
          { title: 'Research',      route: '/research' },
          { title: 'Timeline',      route: '/timeline' },
        ];
        navItems.forEach(n =>
          results.push({ id: n.route, title: n.title, type: 'navigation', route: n.route })
        );

        // All experiences
        data.experiences.forEach(e =>
          results.push({ id: e.id, title: e.title, type: 'experience', route: '/experience', tags: e.tags })
        );

        // All projects
        data.projects.forEach(p =>
          results.push({ id: p.id, title: p.title, type: 'project', route: '/projects', tags: p.stack })
        );

        // Research
        data.research.forEach(r =>
          results.push({ id: r.id, title: r.title, type: 'research', route: '/research', tags: r.tags })
        );

        // System designs
        data.systemDesigns.forEach(s =>
          results.push({ id: s.id, title: s.title, type: 'system-design', route: '/system-design', tags: s.tags })
        );

        return results;
      })
    );
  }
}