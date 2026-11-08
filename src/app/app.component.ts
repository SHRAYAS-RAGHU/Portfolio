import {
  Component,
  HostListener,
  signal,
  inject,
  OnInit
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { CommandPaletteComponent } from './components/command-palette/command-palette.component';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, NavbarComponent, FooterComponent, CommandPaletteComponent],
  template: `
    <app-navbar (openCommandPalette)="showCommandPalette.set(true)"></app-navbar>

    <!-- page-body adds top padding equal to navbar height so NO page ever goes under the navbar -->
    <div class="page-body">
      <router-outlet></router-outlet>
    </div>

    <app-footer></app-footer>

    @if (showCommandPalette()) {
      <app-command-palette (close)="showCommandPalette.set(false)"></app-command-palette>
    }
  `,
  styles: [`
    /* Push ALL page content below the fixed navbar — single source of truth */
    .page-body {
      padding-top: var(--navbar-height); /* defined as 72px in styles.scss */
      min-height: calc(100vh - var(--navbar-height));
    }
  `]
})
export class AppComponent {
  private themeService = inject(ThemeService);
  showCommandPalette = signal(false);

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
      event.preventDefault();
      this.showCommandPalette.update(v => !v);
    }
    if (event.key === 'Escape' && this.showCommandPalette()) {
      this.showCommandPalette.set(false);
    }
  }
}
