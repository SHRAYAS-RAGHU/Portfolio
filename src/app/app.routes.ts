/**
 * app.routes.ts
 *
 * All routes are lazy-loaded using Angular's loadComponent() for better
 * initial bundle size. Each page is its own chunk that loads on demand.
 */

import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/landing/landing.component').then(m => m.LandingComponent),
    title: 'Home — YOUR NAME',
  },
  {
    path: 'experience',
    loadComponent: () =>
      import('./pages/experience-page/experience-page.component').then(m => m.ExperiencePageComponent),
    title: 'Experience — YOUR NAME',
  },
  {
    path: 'projects',
    loadComponent: () =>
      import('./pages/projects-page/projects-page.component').then(m => m.ProjectsPageComponent),
    title: 'Projects — YOUR NAME',
  },
  {
    path: 'system-design',
    loadComponent: () =>
      import('./pages/system-design-page/system-design-page.component').then(m => m.SystemDesignPageComponent),
    title: 'System Design — YOUR NAME',
  },
  {
    path: 'research',
    loadComponent: () =>
      import('./pages/research-page/research-page.component').then(m => m.ResearchPageComponent),
    title: 'Research — YOUR NAME',
  },
  {
    path: 'timeline',
    loadComponent: () =>
      import('./pages/timeline-page/timeline-page.component').then(m => m.TimelinePageComponent),
    title: 'Timeline — YOUR NAME',
  },
  // Catch-all: redirect unknown paths to home
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
