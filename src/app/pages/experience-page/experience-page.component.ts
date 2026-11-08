/**
 * pages/experience-page/experience-page.component.ts
 *
 * The centerpiece of the portfolio — a fully filterable, searchable list
 * of all your professional experiences, projects, incidents, and research.
 *
 * Features:
 *  - Multi-select tag filter with OR / AND mode toggle
 *  - Real-time text search
 *  - Result count display
 *  - Relevance-sorted results (more tag matches = higher rank)
 *  - Clear-all button
 *  - Animated result cards
 */

import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { FilterService } from '../../services/filter.service';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';
import { Experience } from '../../models/portfolio.models';

@Component({
  selector: 'app-experience-page',
  standalone: true,
  imports: [CommonModule, FormsModule, ScrollRevealDirective],
  template: `
    <!-- Page header -->
    <div class="page-header">
      <div class="section-container pt-16 pb-12">
        <div appScrollReveal>
          <p class="section-label mb-4">Browse & Filter</p>
          <h1 class="font-display text-5xl lg:text-6xl text-white mb-4">
            All <span class="gradient-text">Experience</span>
          </h1>
          <p class="text-slate-400 font-body text-lg max-w-2xl">
            {{ filterService.totalCount() }} experiences across full-stack, AI/ML, system design, DevOps, and more.
            Use multi-select tags to find exactly what you're looking for.
          </p>
        </div>
      </div>
    </div>

    <div class="section-container pb-20">
      <div class="flex flex-col lg:flex-row gap-8">

        <!-- ══════════════════════════════════════════════════
             LEFT PANEL: Filters
             ══════════════════════════════════════════════════ -->
        <aside class="lg:w-72 flex-shrink-0">
          <div class="filter-panel glass-card p-6 lg:sticky lg:top-24">

            <!-- Search input -->
            <div class="mb-6">
              <label class="section-label text-[11px] mb-2 block">Search</label>
              <div class="relative">
                <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
                <input
                  type="text"
                  class="search-input w-full pl-9 pr-4 py-2.5 bg-dark-800 border border-blue-900/30 rounded-lg text-white placeholder-slate-600 text-sm font-body outline-none focus:border-blue-500/50 transition-colors"
                  placeholder="Search title, summary, tags..."
                  [ngModel]="filterService.searchQuery()"
                  (ngModelChange)="filterService.setSearchQuery($event)">
              </div>
            </div>

            <!-- Match mode toggle -->
            <div class="mb-6">
              <label class="section-label text-[11px] mb-2 block">Tag Match Mode</label>
              <div class="flex rounded-lg overflow-hidden border border-blue-900/30">
                <button
                  class="flex-1 py-2 text-xs font-mono transition-all duration-200"
                  [class.mode-active]="filterService.matchMode() === 'any'"
                  [class.mode-inactive]="filterService.matchMode() !== 'any'"
                  (click)="filterService.setMatchMode('any')">
                  Match Any
                </button>
                <button
                  class="flex-1 py-2 text-xs font-mono border-l border-blue-900/30 transition-all duration-200"
                  [class.mode-active]="filterService.matchMode() === 'all'"
                  [class.mode-inactive]="filterService.matchMode() !== 'all'"
                  (click)="filterService.setMatchMode('all')">
                  Match All
                </button>
              </div>
            </div>

            <!-- Tag cloud -->
            <div class="mb-6">
              <div class="flex items-center justify-between mb-3">
                <label class="section-label text-[11px]">Filter by Tag</label>
                @if (filterService.selectedTags().length > 0) {
                  <button class="text-xs text-blue-400 hover:text-blue-300 font-mono transition-colors"
                    (click)="filterService.clearAll()">
                    Clear ({{ filterService.selectedTags().length }})
                  </button>
                }
              </div>

              <div class="flex flex-wrap gap-2">
                @for (tag of allTags(); track tag) {
                  <button
                    class="tag-chip text-[11px] py-1 px-2.5"
                    [class.active]="filterService.isTagSelected(tag)"
                    (click)="filterService.toggleTag(tag)">
                    {{ tag }}
                  </button>
                }
              </div>
            </div>

            <!-- Active filter summary -->
            @if (filterService.selectedTags().length > 0) {
              <div class="active-filters pt-4 border-t border-blue-900/20">
                <p class="text-xs font-mono text-slate-500 mb-2">Active filters:</p>
                <div class="flex flex-wrap gap-1">
                  @for (tag of filterService.selectedTags(); track tag) {
                    <span class="flex items-center gap-1 tag-chip active text-[11px] py-0.5 px-2">
                      {{ tag }}
                      <button class="ml-1 text-slate-400 hover:text-white"
                        (click)="filterService.toggleTag(tag)">×</button>
                    </span>
                  }
                </div>
              </div>
            }
          </div>
        </aside>

        <!-- ══════════════════════════════════════════════════
             RIGHT PANEL: Results
             ══════════════════════════════════════════════════ -->
        <div class="flex-1 min-w-0">

          <!-- Result count header -->
          <div class="flex items-center justify-between mb-6">
            <div>
              <span class="text-white font-display text-xl">
                {{ filterService.resultCount() }}
              </span>
              <span class="text-slate-500 font-body ml-2">
                of {{ filterService.totalCount() }} results
              </span>
            </div>

            @if (filterService.selectedTags().length > 0 || filterService.searchQuery().length > 0) {
              <span class="text-xs font-mono text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                Filtered
              </span>
            }
          </div>

          <!-- No results state -->
          @if (filterService.resultCount() === 0) {
            <div class="glass-card p-16 text-center">
              <div class="text-4xl mb-4">🔍</div>
              <h3 class="font-display text-xl text-white mb-2">No results found</h3>
              <p class="text-slate-500 font-body text-sm mb-6">
                Try switching to "Match Any" mode or clearing some filters.
              </p>
              <button class="btn-ghost text-sm" (click)="filterService.clearAll()">
                Clear all filters
              </button>
            </div>
          }

          <!-- Experience cards -->
          <div class="space-y-4">
            @for (exp of filterService.filteredExperiences(); track exp.id; let i = $index) {
              <div
                class="experience-card glass-card p-6 cursor-default group"
                [style.animation-delay]="(i * 40) + 'ms'">

                <!-- Card header -->
                <div class="flex items-start justify-between gap-4 mb-3">
                  <div class="flex-1 min-w-0">
                    <!-- Type + Year -->
                    <div class="flex items-center gap-2 mb-2">
                      <span class="text-xs font-mono px-2 py-0.5 rounded-full"
                        [class]="getTypeBadge(exp.type)">
                        {{ exp.type }}
                      </span>
                      <span class="text-xs font-mono text-slate-600">{{ exp.year }}</span>
                      @if (exp.featured) {
                        <span class="text-xs font-mono text-yellow-500/80 flex items-center gap-1">
                          ⭐ Featured
                        </span>
                      }
                    </div>

                    <h3 class="font-display text-lg text-white group-hover:text-blue-400 transition-colors duration-200">
                      {{ exp.title }}
                    </h3>
                  </div>

                  <!-- Impact stat pill -->
                  <div class="flex-shrink-0 text-right">
                    <div class="impact-pill">
                      {{ exp.impact }}
                    </div>
                  </div>
                </div>

                <!-- Summary -->
                <p class="text-slate-400 font-body text-sm leading-relaxed mb-4">
                  {{ exp.summary }}
                </p>

                <!-- Tags -->
                <div class="flex flex-wrap gap-2">
                  @for (tag of exp.tags; track tag) {
                    <button
                      class="tag-chip text-[11px] py-0.5 px-2"
                      [class.active]="filterService.isTagSelected(tag)"
                      (click)="filterService.toggleTag(tag)">
                      {{ tag }}
                    </button>
                  }
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-header {
      background: radial-gradient(ellipse 80% 60% at 50% -10%, rgba(29, 78, 216, 0.2), transparent);
    }

    /* Mode toggle buttons */
    .mode-active  { background: rgba(59,130,246,0.2); color: #60a5fa; }
    .mode-inactive { background: transparent; color: #475569; }
    .mode-inactive:hover { background: rgba(255,255,255,0.03); color: #94a3b8; }

    /* Experience card entrance */
    .experience-card {
      animation: slideIn 0.4s ease both;
    }
    @keyframes slideIn {
      from { opacity: 0; transform: translateX(-12px); }
      to   { opacity: 1; transform: translateX(0); }
    }

    /* Impact stat pill */
    .impact-pill {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.7rem;
      padding: 4px 10px;
      background: rgba(34, 211, 238, 0.08);
      border: 1px solid rgba(34, 211, 238, 0.2);
      color: #22d3ee;
      border-radius: 20px;
      white-space: nowrap;
    }

    /* Sticky filter panel height management */
    .filter-panel {
      max-height: calc(100vh - 120px);
      overflow-y: auto;
    }
    .filter-panel::-webkit-scrollbar { width: 3px; }
    .filter-panel::-webkit-scrollbar-thumb { background: #1e40af; }
  `]
})
export class ExperiencePageComponent implements OnInit {
  filterService = inject(FilterService);
  private dataService = inject(DataService);

  allTags = signal<string[]>([]);

  ngOnInit() {
    this.dataService.getData().subscribe(data => {
      // Initialize filter service with all experiences
      this.filterService.setAllExperiences(data.experiences);
      this.allTags.set(data.allTags);
    });
  }

  /** Returns Tailwind classes for experience type badges */
  getTypeBadge(type: string): string {
    const map: Record<string, string> = {
      project:    'bg-blue-500/20 text-blue-400',
      research:   'bg-purple-500/20 text-purple-400',
      incident:   'bg-red-500/20 text-red-400',
      leadership: 'bg-amber-500/20 text-amber-400',
    };
    return map[type] || 'bg-slate-700/50 text-slate-400';
  }
}
