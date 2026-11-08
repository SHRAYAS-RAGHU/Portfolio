import {
  Component,
  Output,
  EventEmitter,
  inject,
  signal,
  computed,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { CommandResult } from '../../models/portfolio.models';

@Component({
  selector: 'app-command-palette',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <!-- Backdrop -->
    <div class="cmd-backdrop" (click)="close.emit()">
      <div class="cmd-modal glass-card w-full max-w-2xl mx-4" (click)="$event.stopPropagation()">

        <!-- Search input -->
        <div class="flex items-center gap-3 p-4 border-b border-blue-900/30">
          <svg class="w-5 h-5 text-blue-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input
            #searchInput
            type="text"
            class="flex-1 bg-transparent text-white placeholder-slate-500 text-base outline-none font-body"
            placeholder="Search experiences, projects, research..."
            [(ngModel)]="query"
            (ngModelChange)="onQueryChange($event)"
            (keydown)="onKeydown($event)">
          <button *ngIf="query.length > 0" class="text-slate-500 hover:text-slate-300 text-xs" (click)="query = ''">
            Clear
          </button>
          <kbd class="text-slate-500 text-xs font-mono border border-slate-700 rounded px-1.5 py-0.5">ESC</kbd>
        </div>

        <!-- Results -->
        <div class="max-h-96 overflow-y-auto py-2">

          <div *ngIf="filteredResults().length === 0 && query.length > 0"
            class="text-center py-10 text-slate-500 font-body">
            No results for "{{ query }}"
          </div>

          <div *ngIf="query.length === 0" class="px-4 py-3">
            <p class="text-xs font-mono text-slate-500 uppercase tracking-wider mb-2">Quick Navigate</p>
          </div>

          <button
            *ngFor="let result of filteredResults(); let i = index"
            class="result-item w-full text-left px-4 py-3 flex items-start gap-3 transition-all duration-150"
            [class.result-active]="i === activeIndex()"
            (click)="navigateTo(result)"
            (mouseenter)="setActiveIndex(i)">

            <span class="flex-shrink-0 mt-0.5 text-xs font-mono px-2 py-0.5 rounded-full"
              [ngClass]="getTypeBadgeClass(result.type)">
              {{ result.type }}
            </span>

            <div class="flex-1 min-w-0">
              <p class="text-sm font-body font-medium text-slate-200 truncate">{{ result.title }}</p>
              <p *ngIf="result.tags && result.tags.length > 0"
                class="text-xs text-slate-500 mt-0.5 truncate">
                {{ result.tags.slice(0, 4).join(' · ') }}
              </p>
            </div>

            <svg *ngIf="i === activeIndex()"
              class="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        </div>

        <!-- Footer -->
        <div class="px-4 py-3 border-t border-blue-900/30 flex gap-4 text-xs text-slate-600 font-mono">
          <span><kbd class="bg-slate-800 px-1 rounded">&#8593;&#8595;</kbd> navigate</span>
          <span><kbd class="bg-slate-800 px-1 rounded">&#8629;</kbd> open</span>
          <span><kbd class="bg-slate-800 px-1 rounded">esc</kbd> close</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .cmd-modal {
      animation: slideDown 0.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    }
    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-16px) scale(0.97); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }
    .result-item:hover { background: rgba(59,130,246,0.06); }
    .result-active {
      background: rgba(59,130,246,0.1) !important;
      border-left: 2px solid #3b82f6;
    }
    .max-h-96::-webkit-scrollbar { width: 4px; }
    .max-h-96::-webkit-scrollbar-thumb { background: #1e40af; border-radius: 2px; }
  `]
})
export class CommandPaletteComponent implements OnInit, AfterViewInit, OnDestroy {
  @Output() close = new EventEmitter<void>();
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  private router      = inject(Router);
  private dataService = inject(DataService);

  query       = '';
  allResults  = signal<CommandResult[]>([]);
  activeIndex = signal(0);

  filteredResults = computed(() => {
    const q   = this.query.toLowerCase().trim();
    const all = this.allResults();
    if (!q) return all.filter(r => r.type === 'navigation');
    return all.filter(r =>
      r.title.toLowerCase().includes(q) ||
      r.type.toLowerCase().includes(q) ||
      r.tags?.some(t => t.toLowerCase().includes(q))
    ).slice(0, 10);
  });

  ngOnInit() {
    // Prevent the page behind the palette from scrolling
    document.body.style.overflow = 'hidden';
    this.dataService.getCommandResults().subscribe(r => this.allResults.set(r));
  }

  ngOnDestroy() {
    document.body.style.overflow = '';
  }

  ngAfterViewInit() {
    setTimeout(() => this.searchInput?.nativeElement?.focus(), 50);
  }

  onQueryChange(value: string) {
    this.activeIndex.set(0);
  }

  setActiveIndex(i: number) {
    this.activeIndex.set(i);
  }

  onKeydown(event: KeyboardEvent) {
    const max = this.filteredResults().length;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.activeIndex.set(Math.min(this.activeIndex() + 1, max - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.activeIndex.set(Math.max(this.activeIndex() - 1, 0));
    } else if (event.key === 'Enter') {
      const result = this.filteredResults()[this.activeIndex()];
      if (result) this.navigateTo(result);
    }
  }

  navigateTo(result: CommandResult) {
    this.router.navigate([result.route]);
    this.close.emit();
  }

  getTypeBadgeClass(type: string): string {
    const map: Record<string, string> = {
      'navigation':    'bg-slate-700 text-slate-400',
      'experience':    'bg-blue-900 text-blue-400',
      'project':       'bg-cyan-900 text-cyan-400',
      'research':      'bg-purple-900 text-purple-400',
      'system-design': 'bg-green-900 text-green-400',
    };
    return map[type] || 'bg-slate-700 text-slate-400';
  }
}
