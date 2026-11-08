/**
 * app.config.ts
 * Angular application config (replaces NgModule in standalone apps)
 */

import { ApplicationConfig } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    // Router with view transitions for smooth page changes
    provideRouter(routes, withViewTransitions()),
    // HttpClient for loading data.json
    provideHttpClient(),
    // Angular animations
    provideAnimations(),
  ],
};
