import {
  Component,
  Output,
  EventEmitter,
  inject,
  signal,
  HostListener
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme.service';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  template: `
    <nav
      class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      [class.navbar-glass]="isScrolled()">

      <div class="section-container">
        <div class="flex items-center justify-between h-[72px]">

          <!-- LOGO -->
          <a routerLink="/" class="flex items-center gap-3 group flex-shrink-0 mr-4">
            <div class="logo-mark">
              <span class="text-blue-400 font-display font-bold text-xl">&lt;/&gt;</span>
            </div>
            <span class="hidden sm:block whitespace-nowrap font-display font-bold text-lg text-white group-hover:text-blue-400 transition-colors duration-200">
              {{ personal()?.name || 'YOUR NAME' }}
            </span>
            <span class="hidden xl:flex whitespace-nowrap items-center gap-1.5 text-xs font-mono text-cyan-400 bg-cyan-400/10 border border-cyan-400/20 px-2 py-1 rounded-full">
              <span class="glow-dot" style="width:6px;height:6px;"></span>
              Available
            </span>
          </a>

          <!-- DESKTOP NAV -->
          <div class="hidden lg:flex items-center gap-1">
            @for (link of navLinks; track link.path) {
              <a
                [routerLink]="link.path"
                routerLinkActive="active-nav-link"
                [routerLinkActiveOptions]="{ exact: link.path === '/' }"
                class="nav-link">
                {{ link.label }}
              </a>
            }
          </div>

          <!-- ACTIONS -->
          <div class="flex items-center gap-2">

            <!-- Command palette trigger -->
            <button
              class="hidden xl:flex whitespace-nowrap items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 text-xs font-mono hover:bg-blue-500/10 hover:border-blue-500/30 hover:text-blue-400 transition-all duration-200"
              (click)="openCommandPalette.emit()">
              <span>Search</span>
              <kbd class="flex items-center gap-0.5 opacity-70">
                <span class="text-[10px]">&#8984;</span>
                <span>K</span>
              </kbd>
            </button>

            <!-- Theme toggle -->
            <button
              class="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-all duration-200"
              (click)="themeService.toggle()"
              [title]="themeService.isDark() ? 'Switch to light mode' : 'Switch to dark mode'">
              <svg *ngIf="themeService.isDark()" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 3v1m0 16v1m8.66-9h-1M4.34 12h-1m15.07-6.07l-.71.71M6.34 17.66l-.71.71M17.66 17.66l-.71-.71M6.34 6.34l-.71-.71M12 7a5 5 0 100 10A5 5 0 0012 7z"/>
              </svg>
              <svg *ngIf="!themeService.isDark()" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
              </svg>
            </button>

            <!-- Download Resume -->
            <a
              [href]="personal()?.resumeUrl || '#'"
              target="_blank"
              class="hidden sm:flex btn-primary text-sm py-2 px-4">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              Resume
            </a>

            <!-- Mobile hamburger -->
            <button
              class="lg:hidden p-2 text-slate-400 hover:text-white"
              (click)="toggleMobileMenu()">
              <svg *ngIf="mobileMenuOpen()" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
              <svg *ngIf="!mobileMenuOpen()" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- MOBILE MENU -->
        @if (mobileMenuOpen()) {
          <div class="lg:hidden mobile-menu py-4 border-t border-blue-900/30">
            @for (link of navLinks; track link.path) {
              <a
                [routerLink]="link.path"
                routerLinkActive="active-mobile-link"
                class="block py-3 px-2 text-slate-300 hover:text-blue-400 font-body text-base transition-colors"
                (click)="closeMobileMenu()">
                {{ link.label }}
              </a>
            }
            <a
              [href]="personal()?.resumeUrl || '#'"
              target="_blank"
              class="mt-3 btn-primary w-full justify-center text-sm">
              Download Resume
            </a>
          </div>
        }
      </div>
    </nav>
  `,
  styles: [`
    nav { background: transparent; }

    .navbar-glass {
      background: rgba(2, 8, 23, 0.85);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-bottom: 1px solid rgba(59, 130, 246, 0.1);
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
    }

    .nav-link {
      white-space: nowrap;
      padding: 6px 12px;
      border-radius: 8px;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.875rem;
      font-weight: 500;
      color: #94a3b8;
      text-decoration: none;
      transition: all 0.2s ease;
    }
    .nav-link:hover {
      color: #fff;
      background: rgba(255, 255, 255, 0.05);
    }

    :host ::ng-deep .active-nav-link {
      color: #60a5fa !important;
      background: rgba(59, 130, 246, 0.1) !important;
    }

    .logo-mark {
      width: 36px;
      height: 36px;
      background: linear-gradient(135deg, rgba(37, 99, 235, 0.2), rgba(6, 182, 212, 0.2));
      border: 1px solid rgba(59, 130, 246, 0.3);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }
    .logo-mark:hover {
      border-color: rgba(59, 130, 246, 0.6);
      box-shadow: 0 0 15px rgba(59, 130, 246, 0.25);
    }

    .mobile-menu {
      animation: fadeDown 0.2s ease forwards;
    }
    @keyframes fadeDown {
      from { opacity: 0; transform: translateY(-8px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class NavbarComponent {
  @Output() openCommandPalette = new EventEmitter<void>();

  themeService = inject(ThemeService);
  private dataService = inject(DataService);

  isScrolled     = signal(false);
  mobileMenuOpen = signal(false);
  personal       = signal<any>(null);

  navLinks = [
    { label: 'Home',          path: '/' },
    { label: 'Experience',    path: '/experience' },
    { label: 'Projects',      path: '/projects' },
    { label: 'System Design', path: '/system-design' },
    { label: 'Research',      path: '/research' },
    { label: 'Timeline',      path: '/timeline' },
  ];

  constructor() {
    this.dataService.getPersonal().subscribe(p => this.personal.set(p));
  }

  toggleMobileMenu() {
    this.mobileMenuOpen.set(!this.mobileMenuOpen());
  }

  closeMobileMenu() {
    this.mobileMenuOpen.set(false);
  }

  @HostListener('window:scroll')
  onScroll() {
    this.isScrolled.set(window.scrollY > 60);
  }
}
