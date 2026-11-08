/**
 * app.config.ts
 * Angular application config (replaces NgModule in standalone apps)
 */

import { ApplicationConfig } from '@angular/core';
import { provideRouter, withViewTransitions, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    // Router with view transitions for smooth page changes
    provideRouter(
      routes,
      withViewTransitions(),
      // Every navigation starts at the top of the new page (was keeping old scroll position)
      withInMemoryScrolling({ scrollPositionRestoration: 'top', anchorScrolling: 'enabled' })
    ),
    // HttpClient for loading data.json
    provideHttpClient(),
    // Angular animations
    provideAnimations(),
  ],
};
